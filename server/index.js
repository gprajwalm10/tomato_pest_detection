import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

// Emulate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env.local if present (use .env as fallback)
const localEnv = path.resolve(__dirname, '..', '.env.local');
dotenv.config({ path: localEnv });
console.log('Loaded env from', localEnv);
const _gk = process.env.GEMINI_API_KEY || '';
const isDemoMode = (process.env.DEMO_MODE || '').toLowerCase() === 'true' || !_gk || _gk.includes('TEST') || _gk.includes('PLACEHOLDER');
console.log('GEMINI_API_KEY present:', Boolean(_gk), 'len:', _gk.length, 'DEMO_MODE:', isDemoMode);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 8080;
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Set it in your .env to use AI features.');
}

// Lazily create AI client only when needed to avoid SDK credential checks during startup or demo mode
let ai = null;
const getAI = () => {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Missing GEMINI_API_KEY');
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
};

app.post('/api/diagnose', async (req, res) => {
  try {
    const { image, lang = 'en' } = req.body;
    console.log('diagnose handler invoked', { demoEnv: process.env.DEMO_MODE, keyPreview: (process.env.GEMINI_API_KEY||'').slice(0,8) });
    if (!image) return res.status(400).json({ error: 'Missing image' });

    // Demo fallback: return mock data if DEMO_MODE enabled or credentials are missing
    const demoMode = (process.env.DEMO_MODE || '').toLowerCase() === 'true';
    console.log('diagnose computed demoMode', demoMode);
    if (demoMode || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('TEST') || process.env.GEMINI_API_KEY.includes('PLACEHOLDER')) {
      console.log('Returning demo diagnosis (DEMO_MODE or missing creds)');
      // Return a realistic mock diagnosis matching the `PestDiagnosis` interface
      const mock = {
        name: "Early Blight",
        scientificName: "Alternaria solani",
        confidence: 0.87,
        symptoms: [
          "Dark brown concentric lesions on lower leaves",
          "Yellowing of leaf margins"
        ],
        immediateActions: [
          "Remove heavily infected leaves",
          "Improve air circulation"
        ],
        organicSolutions: [
          "Apply copper-based fungicide",
          "Use neem oil spray"
        ],
        chemicalSolutions: [
          "Chlorothalonil spray as per local guidelines"
        ],
        preventionTips: [
          "Rotate crops yearly",
          "Avoid overhead irrigation"
        ],
        isHealthy: false,
        severity: 'medium'
      };
      return res.json({ data: mock, demo: true });
    }

    console.log('Handler diagnose: GEMINI key preview:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0,8) : 'MISSING');

    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const client = getAI();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: `Diagnose this tomato plant. Return the JSON response with all text fields translated into ${lang}.` }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT
          // Server validates less strictly; frontend expects the schema
        }
      }
    });

    const text = response.text;
    if (!text) return res.status(502).json({ error: 'Empty response from AI' });

    const data = JSON.parse(text);
    res.json({ data, raw: response });
  } catch (err) {
    console.error('Server diagnose error:', err);
    const msg = (err && err.message) ? err.message : String(err);
    console.error('Server diagnose caught message:', msg);
    if (msg.includes('default credentials') || msg.toLowerCase().includes('credentials')) {
      return res.status(502).json({ error: 'AI credentials missing or invalid. Set a valid GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS on the server.' });
    }
    if (msg.toLowerCase().includes('api key')) {
      return res.status(502).json({ error: 'Invalid API key provided to Gemini client.' });
    }
    res.status(500).json({ error: msg || 'Server error' });
  }
});

app.post('/api/weather', async (req, res) => {
  try {
    const { lat, lng, lang = 'en' } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') return res.status(400).json({ error: 'Missing coordinates' });

    const demoMode = (process.env.DEMO_MODE || '').toLowerCase() === 'true';
    if (demoMode || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('TEST') || process.env.GEMINI_API_KEY.includes('PLACEHOLDER')) {
      console.log('Returning demo weather (DEMO_MODE or missing creds)');
      const mock = {
        temp: '27°C',
        location: 'Sampleville',
        condition: 'Partly Cloudy',
        insight: 'Keep irrigation light today; consider delaying fertilization if heavy rain is forecast later.',
        alerts: [],
        sources: []
      };
      return res.json({ data: mock, demo: true });
    }

    const client = getAI();
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Search for real-time weather and forecast for coordinates (${lat}, ${lng}).\nReturn ONLY JSON in ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return res.status(502).json({ error: 'Empty response from AI' });

    const data = JSON.parse(text);

    // Return grounding info if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks.filter(c => c.web && c.web.uri).map(c => ({ title: c.web.title || 'Source', uri: c.web.uri }));

    res.json({ data, sources });
  } catch (err) {
    console.error('Server weather error:', err);
    const msg = (err && err.message) ? err.message : String(err);
    if (msg.includes('default credentials') || msg.toLowerCase().includes('credentials')) {
      return res.status(502).json({ error: 'AI credentials missing or invalid. Set a valid GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS on the server.' });
    }
    res.status(500).json({ error: msg || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API proxy server listening at http://localhost:${PORT}`);
});
