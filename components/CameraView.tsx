
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Language, User } from '../types';
import { UI_TRANSLATIONS as translations, LIVE_SYSTEM_INSTRUCTION } from '../constants';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
  language?: Language;
  user?: User | null;
}

// Audio encoding/decoding utilities per Gemini Live API guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel, language = 'en', user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState("");
  const t = translations[language];

  // Live session refs
  const sessionRef = useRef<any>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const liveIntervalRef = useRef<number | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  // Using a ref for nextStartTime to ensure consistent audio playback scheduling
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError(t.camera_error);
      }
    };
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      stopLiveSession();
    };
  }, [t.camera_error]);

  const stopLiveSession = useCallback(() => {
    if (liveIntervalRef.current) {
      window.clearInterval(liveIntervalRef.current);
      liveIntervalRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    for (const source of sourcesRef.current) {
      try { source.stop(); } catch (e) {}
    }
    sourcesRef.current.clear();
    setIsLive(false);
    
    // Cleanup audio contexts
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
  }, []);

  const startLiveSession = async () => {
    if (isLive) {
      stopLiveSession();
      return;
    }

    setIsLive(true);
    setTranscription("");
    
    // Function to create PCM blob for audio streaming
    const createBlob = (data: Float32Array): Blob => {
      const l = data.length;
      const int16 = new Int16Array(l);
      for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
      }
      return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
      };
    };

    // Initialize fresh audio contexts for the session
    inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          // Stream video frames as image parts
          liveIntervalRef.current = window.setInterval(() => {
            if (videoRef.current && canvasRef.current && sessionRef.current) {
              const v = videoRef.current;
              const c = canvasRef.current;
              if (v.videoWidth === 0) return;
              
              c.width = 480; 
              c.height = (v.videoHeight / v.videoWidth) * 480;
              const ctx = c.getContext('2d');
              if (ctx) {
                ctx.drawImage(v, 0, 0, c.width, c.height);
                const base64Data = c.toDataURL('image/jpeg', 0.6).split(',')[1];
                // CRITICAL: Always handle via sessionPromise to avoid race conditions
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({
                    media: { data: base64Data, mimeType: 'image/jpeg' }
                  });
                });
              }
            }
          }, 1000); // 1 FPS for real-time visual grounding

          // Synchronized audio input streaming
          if (streamRef.current && inputAudioCtxRef.current) {
            const source = inputAudioCtxRef.current.createMediaStreamSource(streamRef.current);
            const scriptProcessor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioCtxRef.current.destination);
          }
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioCtxRef.current) {
            const ctx = outputAudioCtxRef.current;
            // Gapless playback scheduling using nextStartTimeRef
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.addEventListener('ended', () => sourcesRef.current.delete(source));
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }

          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => (prev + " " + message.serverContent?.outputTranscription?.text).slice(-150));
          }

          if (message.serverContent?.interrupted) {
            for (const source of sourcesRef.current) {
              try { source.stop(); } catch (e) {}
            }
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error("Live AI Error:", e);
          stopLiveSession();
        },
        onclose: () => setIsLive(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        systemInstruction: LIVE_SYSTEM_INSTRUCTION(language as Language, user?.name || 'Farmer'),
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
        }
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current;
      const c = canvasRef.current;
      
      if (v.videoWidth === 0 || v.videoHeight === 0) {
        return;
      }

      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(v, 0, 0);
        onCapture(c.toDataURL('image/jpeg', 0.85));
      }
    }
  }, [onCapture]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-[70] flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-camera-slash text-red-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Camera Access Denied</h3>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">{error}</p>
        <button onClick={onCancel} className="w-full bg-[#1B4332] text-white py-4 rounded-2xl font-bold shadow-lg">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-72 h-72 border-2 border-white/40 rounded-3xl relative">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl"></div>
            
            <div className="absolute w-full h-0.5 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] top-0 left-0 animate-[scan_3s_linear_infinite]"></div>
          </div>
          <p className="text-white/80 text-[10px] font-bold tracking-widest mt-8 px-4 py-2 bg-black/40 rounded-full backdrop-blur-sm uppercase">{t.position_leaf}</p>
        </div>

        {isLive && (
          <div className="absolute bottom-32 left-0 right-0 px-6 animate-in slide-in-from-bottom duration-300">
             <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white text-xs font-medium leading-relaxed shadow-2xl">
                <div className="flex items-center gap-2 mb-2 text-green-400 font-bold uppercase tracking-widest text-[8px]">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   AI Transcription
                </div>
                {transcription || "Listening and watching your plant..."}
             </div>
          </div>
        )}

        {isLive && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-lg">
             <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
             Live
          </div>
        )}

        <button onClick={onCancel} className="absolute top-6 left-6 w-12 h-12 bg-black/40 text-white rounded-2xl backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform">
          <i className="fas fa-xmark"></i>
        </button>
      </div>

      <div className="bg-black p-8 flex items-center justify-between px-10">
        <button 
          onClick={startLiveSession}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${isLive ? 'bg-red-600 text-white' : 'bg-white/10 text-white'}`}
        >
          <i className={`fas ${isLive ? 'fa-stop' : 'fa-headset'} text-xl`}></i>
          <span className="text-[7px] font-bold uppercase">{isLive ? t.stop_live : t.live_mode}</span>
        </button>
        
        <button 
          onClick={capture}
          className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center group active:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <div className="w-16 h-16 rounded-full border-[3px] border-black/5"></div>
          <div className="absolute w-14 h-14 rounded-full bg-gray-100/20 group-hover:scale-105 transition-transform"></div>
        </button>

        <label className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center gap-1 text-white cursor-pointer active:scale-95 transition-all">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               const r = new FileReader();
               r.onload = (ev) => onCapture(ev.target?.result as string);
               r.readAsDataURL(file);
             }
          }} />
          <i className="fas fa-image text-xl"></i>
          <span className="text-[7px] font-bold uppercase">Gallery</span>
        </label>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(288px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraView;
