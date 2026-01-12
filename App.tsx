
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, AuthState, PestDiagnosis, HistoryItem, User, FarmInsight, Language, FarmerTask, MarketPrice } from './types';
import { LOADING_MESSAGES, LOCALIZED_FARM_INSIGHTS, UI_TRANSLATIONS as translations, MOCK_MARKET_PRICES, CROP_TASKS } from './constants';
import { diagnosePlant } from './services/geminiService';
import CameraView from './components/CameraView';
import DiagnosisCard from './components/DiagnosisCard';
import Auth from './components/Auth';
import InsightDetail from './components/InsightDetail';
import Settings from './components/Settings';
import Community from './components/Community';
import ChatRoom from './components/ChatRoom';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<PestDiagnosis | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Interaction State
  const [selectedInsight, setSelectedInsight] = useState<FarmInsight | null>(null);
  const [activeChatPartner, setActiveChatPartner] = useState<User | null>(null);
  const currentLanguage: Language = currentUser?.preferredLanguage || 'en';
  const t = translations[currentLanguage];
  const farmInsights = LOCALIZED_FARM_INSIGHTS[currentLanguage] || LOCALIZED_FARM_INSIGHTS.en;

  // Initialize Data
  useEffect(() => {
    const savedUser = localStorage.getItem('agri_current_user');
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    setAllUsers(users);

    const fullHistory = JSON.parse(localStorage.getItem('agri_history_all') || '[]');
    setAllHistory(fullHistory);

    if (savedUser) {
      const user = JSON.parse(savedUser);
      const latestUser = users.find((u: User) => u.id === user.id) || user;
      setCurrentUser(latestUser);
      setAuthState('authenticated');
    }
  }, []);

  // Sync History and Handle Location
  useEffect(() => {
    if (authState === 'authenticated' && currentUser) {
      const userHistory = allHistory.filter((h: HistoryItem) => h.userId === currentUser.id);
      setHistory(userHistory);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateUser({ lat, lng });
          },
          (err) => {
            // Silently log location error
            console.debug("Location access unavailable:", err.message);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      }
    }
  }, [authState, currentUser?.id, currentLanguage, allHistory]);

  const updateUser = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    localStorage.setItem('agri_current_user', JSON.stringify(updatedUser));
    
    const users: User[] = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('agri_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem('agri_current_user');
    setCurrentUser(null);
    setAuthState('login');
    setAppState('dashboard');
    setSelectedInsight(null);
  };

  const handleLanguageChange = (lang: Language) => {
    updateUser({ preferredLanguage: lang });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        startAnalysis(base64);
      };
      reader.onerror = () => setError("Failed to read the selected file.");
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async (image: string) => {
    setCapturedImage(image);
    setAppState('analyzing');
    setError(null);

    const interval = setInterval(() => {
      setLoadingMsg(prev => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(idx + 1) % LOADING_MESSAGES.length];
      });
    }, 2000);

    try {
      const result = await diagnosePlant(image, currentLanguage);
      setCurrentDiagnosis(result);
      saveToHistory(result, image);
      setAppState('result');
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Scanning failed. Ensure the leaf is clearly visible and your internet is stable.");
      setAppState('dashboard');
    } finally {
      clearInterval(interval);
    }
  };

  const saveToHistory = (diagnosis: PestDiagnosis, image: string) => {
    if (!currentUser) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      userId: currentUser.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      image,
      diagnosis
    };
    const updatedAll = [newItem, ...allHistory];
    localStorage.setItem('agri_history_all', JSON.stringify(updatedAll));
    setAllHistory(updatedAll);
  };

  const daysSincePlanting = useMemo(() => {
    if (!currentUser?.plantedDate) return 0;
    const planted = new Date(currentUser.plantedDate);
    const diffTime = Math.abs(new Date().getTime() - planted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentUser?.plantedDate]);

  const currentTasks = useMemo(() => {
    if (daysSincePlanting === 0) return [];
    return CROP_TASKS.filter(task => daysSincePlanting >= task.dayRange[0] && daysSincePlanting <= task.dayRange[1]);
  }, [daysSincePlanting]);

  const regionalAlerts = useMemo(() => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return allHistory.filter(h => 
      h.userId !== currentUser?.id && 
      h.timestamp > sevenDaysAgo && 
      h.diagnosis.severity === 'high'
    );
  }, [allHistory, currentUser?.id]);

  const reset = () => {
    setAppState('dashboard');
    setCapturedImage(null);
    setCurrentDiagnosis(null);
  };

  if (authState !== 'authenticated') {
    return <Auth onAuthSuccess={(user) => {
      setCurrentUser(user);
      setAuthState('authenticated');
      localStorage.setItem('agri_current_user', JSON.stringify(user));
    }} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAF8] relative font-sans overflow-x-hidden">
      {/* Global Error Toast */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-[200] bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-lg"></i>
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-xmark text-sm"></i>
          </button>
        </div>
      )}

      {appState === 'dashboard' && (
        <div className="p-6 pb-32 animate-in fade-in duration-500">
          <header className="flex items-center justify-between mb-6 pt-2">
            <div>
              <h1 className="text-2xl font-bold text-[#1B4332]">AgriGuard AI</h1>
              <p className="text-gray-500 text-sm tracking-wide">{t.welcome}, {currentUser?.name}</p>
            </div>
            <button onClick={() => setAppState('settings')} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-green-50 active:scale-95 transition-all">
              <i className="fas fa-user-gear text-green-600"></i>
            </button>
          </header>

          {/* Regional Alert Banner */}
          {regionalAlerts.length > 0 && (
            <div className="mb-6 bg-red-600 p-4 rounded-3xl text-white shadow-xl animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <i className="fas fa-triangle-exclamation text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-100">{t.regional_alerts}</p>
                <p className="text-xs font-bold truncate">{regionalAlerts[0].diagnosis.name} detected nearby!</p>
              </div>
              <button onClick={() => setAppState('community')} className="text-[10px] font-bold underline px-2">{t.view_all}</button>
            </div>
          )}

          {/* Core Quick Actions - AI FOCUS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => setAppState('camera')} className="bg-[#2D6A4F] text-white p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center gap-4 active:scale-95 transition-all">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
                <i className="fas fa-camera-viewfinder"></i>
              </div>
              <span className="font-bold text-sm">{t.scan}</span>
            </button>
            <label className="bg-white border border-green-50 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-4 cursor-pointer active:scale-95 transition-all">
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-3xl text-emerald-600">
                <i className="fas fa-file-arrow-up"></i>
              </div>
              <span className="font-bold text-[#1B4332] text-sm">{t.upload}</span>
            </label>
          </div>

          {/* Recent History Shortcut */}
          {history.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-[#1B4332]">Recent Health Checks</h2>
                <button onClick={() => setAppState('history')} className="text-xs font-bold text-green-600">View History</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {history.slice(0, 3).map(item => (
                  <div key={item.id} onClick={() => { setCurrentDiagnosis(item.diagnosis); setCapturedImage(item.image); setAppState('result'); }} className="min-w-[140px] bg-white p-3 rounded-[1.8rem] border border-green-50 shadow-sm flex flex-col shrink-0">
                    <img src={item.image} className="w-full h-24 rounded-2xl object-cover mb-2" alt="Recent" />
                    <p className="text-[10px] font-bold text-[#1B4332] truncate">{item.diagnosis.name}</p>
                    <p className="text-[8px] text-gray-400">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandi Price Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-[#1B4332]">{t.mandi_prices}</h2>
              <i className="fas fa-chart-line text-green-600 opacity-30"></i>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {MOCK_MARKET_PRICES.map(price => (
                <div key={price.id} className="min-w-[150px] bg-white p-4 rounded-3xl border border-green-50 shadow-sm flex flex-col shrink-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[80px]">{price.mandi}</p>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${price.trend === 'up' ? 'bg-green-50 text-green-600' : price.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                      {price.change}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[#1B4332]">{price.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Task Widget */}
          <div className="mb-8">
             <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-[#1B4332]">{t.daily_tasks}</h2>
                {currentUser?.plantedDate && (
                  <div className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">Day {daysSincePlanting}</div>
                )}
              </div>
              {currentUser?.plantedDate ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-[2rem] space-y-3">
                  {currentTasks.length > 0 ? (
                    currentTasks.map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${task.category === 'pest' ? 'bg-red-500' : task.category === 'fertilizer' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                          <i className={`fas ${task.category === 'pest' ? 'fa-bug' : task.category === 'fertilizer' ? 'fa-flask' : 'fa-droplet'}`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1B4332]">{task.title}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{task.description}</p>
                        </div>
                        <i className="fas fa-check-circle text-gray-200"></i>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4 italic">No specific tasks for today. Relax!</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-[2rem] text-center">
                   <p className="text-xs text-gray-400 mb-3">Add your planting date in settings for a personalized crop calendar.</p>
                   <button onClick={() => setAppState('settings')} className="text-xs font-bold text-green-700 underline">Set Date Now</button>
                </div>
              )}
          </div>

          {/* Knowledge Hub */}
          <section className="mb-10 px-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1B4332]">{t.knowledge_hub}</h2>
              <i className="fas fa-book-open-reader text-green-600 opacity-20"></i>
            </div>
            <div className="space-y-4">
              {farmInsights.map((insight) => (
                <div 
                  key={insight.id}
                  onClick={() => setSelectedInsight(insight)}
                  className="bg-white p-5 rounded-[2rem] shadow-sm border border-green-50 flex gap-4 items-center active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl ${insight.color} flex items-center justify-center text-white shadow-lg`}>
                    <i className={`fas ${insight.icon} text-2xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{insight.category}</span>
                      {insight.isIndianContext && (
                        <span className="bg-orange-50 text-orange-600 text-[7px] px-1.5 py-0.5 rounded font-bold uppercase">India</span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#1B4332] text-sm truncate">{insight.title}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{insight.description}</p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-200 text-xs"></i>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Other Views remain but focus on AI data */}
      {appState === 'history' && (
        <div className="p-6 pb-32 animate-in slide-in-from-left duration-500">
          <header className="mb-8 pt-2">
            <h1 className="text-2xl font-bold text-[#1B4332]">{t.history}</h1>
            <p className="text-xs text-gray-500">{t.my_garden}</p>
          </header>
          {history.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-green-50 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl text-gray-200">
                <i className="fas fa-leaf"></i>
              </div>
              <p className="text-sm font-bold text-gray-400">{t.no_history}</p>
              <button onClick={() => setAppState('camera')} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">{t.start_scan}</button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} onClick={() => { setCurrentDiagnosis(item.diagnosis); setCapturedImage(item.image); setAppState('result'); }} className="bg-white p-4 rounded-[1.8rem] shadow-sm border border-green-50 flex gap-4 active:scale-[0.98] transition-all cursor-pointer">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="History" />
                  <div className="flex-1 py-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.date}</p>
                    <h3 className="font-bold text-[#1B4332] mb-1">{item.diagnosis.name}</h3>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${item.diagnosis.isHealthy ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {item.diagnosis.isHealthy ? 'Healthy' : 'Affected'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-200"><i className="fas fa-chevron-right"></i></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Overlays */}
      {appState === 'settings' && currentUser && <Settings user={currentUser} onLanguageChange={handleLanguageChange} onLogout={handleLogout} onUpdatePlantedDate={(date) => updateUser({ plantedDate: date })} />}
      {appState === 'community' && currentUser && <Community currentUser={currentUser} allUsers={allUsers} onConnect={(id) => {}} onAccept={(id) => {}} onOpenChat={(id) => { const partner = allUsers.find(u => u.id === id); if (partner) { setActiveChatPartner(partner); setAppState('chat'); } }} language={currentLanguage} />}
      {appState === 'chat' && currentUser && activeChatPartner && <ChatRoom currentUser={currentUser} partner={activeChatPartner} onClose={() => setAppState('community')} language={currentLanguage} />}
      {selectedInsight && <InsightDetail insight={selectedInsight} onClose={() => setSelectedInsight(null)} language={currentLanguage} />}
      {appState === 'camera' && <CameraView onCapture={startAnalysis} onCancel={() => setAppState('dashboard')} language={currentLanguage} user={currentUser} />}
      {appState === 'result' && currentDiagnosis && capturedImage && <DiagnosisCard diagnosis={currentDiagnosis} image={capturedImage} onClose={reset} />}
      
      {/* Loading Overlay */}
      {appState === 'analyzing' && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-32 h-32 relative mb-10">
            <div className="absolute inset-0 border-4 border-green-50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 bg-green-50 rounded-full flex items-center justify-center text-3xl text-green-600">
              <i className="fas fa-microscope"></i>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1B4332] mb-3">Scanning Plant Health...</h2>
          <p className="text-gray-500 text-sm font-medium animate-pulse">{loadingMsg}</p>
        </div>
      )}

      {/* Persistent Bottom Nav */}
      {(['dashboard', 'history', 'settings', 'community'].includes(appState)) && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-6 pt-2 bg-gradient-to-t from-[#F8FAF8] via-[#F8FAF8] to-transparent pointer-events-none z-[100]">
          <nav className="glass rounded-[2.5rem] p-3 shadow-2xl flex items-center justify-around pointer-events-auto">
            <button onClick={() => setAppState('dashboard')} className={`flex flex-col items-center gap-1 w-14 py-1 ${appState === 'dashboard' ? 'text-green-700' : 'text-gray-300'}`}>
              <i className="fas fa-house-chimney text-lg"></i>
              <span className="text-[8px] font-bold uppercase">{t.home}</span>
            </button>
            <button onClick={() => setAppState('history')} className={`flex flex-col items-center gap-1 w-14 py-1 ${appState === 'history' ? 'text-green-700' : 'text-gray-300'}`}>
              <i className="fas fa-clock-rotate-left text-lg"></i>
              <span className="text-[8px] font-bold uppercase">{t.history}</span>
            </button>
            <div onClick={() => setAppState('camera')} className="w-16 h-16 bg-[#2D6A4F] rounded-2xl flex items-center justify-center text-white shadow-xl -mt-10 border-[5px] border-white active:scale-90 transition-all cursor-pointer">
              <i className="fas fa-plus text-2xl"></i>
            </div>
            <button onClick={() => setAppState('community')} className={`flex flex-col items-center gap-1 w-14 py-1 ${appState === 'community' ? 'text-green-700' : 'text-gray-300'}`}>
              <i className="fas fa-users text-lg"></i>
              <span className="text-[8px] font-bold uppercase">{t.community}</span>
            </button>
            <button onClick={() => setAppState('settings')} className={`flex flex-col items-center gap-1 w-14 py-1 ${appState === 'settings' ? 'text-green-700' : 'text-gray-300'}`}>
              <i className="fas fa-user-gear text-lg"></i>
              <span className="text-[8px] font-bold uppercase">{t.settings}</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default App;
