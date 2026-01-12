
import React from 'react';
import { User, Language } from '../types';
import { UI_TRANSLATIONS as translations } from '../constants';

interface SettingsProps {
  user: User;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onUpdatePlantedDate: (date: string) => void;
}

const LANGUAGES: { id: Language; name: string; local: string }[] = [
  { id: 'en', name: 'English', local: 'English' },
  { id: 'kn', name: 'Kannada', local: 'ಕನ್ನಡ' },
  { id: 'hi', name: 'Hindi', local: 'हिन्दी' },
  { id: 'te', name: 'Telugu', local: 'తెలుగు' },
  { id: 'ml', name: 'Malayalam', local: 'മലയാളം' },
  { id: 'ta', name: 'Tamil', local: 'தமிழ்' }
];

const Settings: React.FC<SettingsProps> = ({ user, onLanguageChange, onLogout, onUpdatePlantedDate }) => {
  const lang = user.preferredLanguage || 'en';
  const t = translations[lang];

  return (
    <div className="p-6 pb-32 animate-in slide-in-from-right duration-500">
      <header className="mb-8 pt-2">
        <h1 className="text-2xl font-bold text-[#1B4332]">{t.settings}</h1>
        <p className="text-xs text-gray-500">{t.personal_space}</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-green-50 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-600">
            <i className="fas fa-user-circle text-4xl"></i>
          </div>
          <div>
            <h2 className="font-bold text-[#1B4332] text-lg">{user.name}</h2>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.full_name}</span>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
          <div className="flex flex-col gap-2 py-2 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Crop Planting Date</span>
            <input 
              type="date" 
              defaultValue={user.plantedDate ? user.plantedDate.split('T')[0] : ''}
              onChange={(e) => onUpdatePlantedDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-language text-green-600"></i> {t.lang_select}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => onLanguageChange(l.id)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col ${
                lang === l.id 
                ? 'bg-green-50 border-green-200 shadow-sm' 
                : 'bg-white border-gray-100 hover:border-green-100'
              }`}
            >
              <span className={`text-xs font-bold ${lang === l.id ? 'text-green-700' : 'text-gray-400'}`}>{l.name}</span>
              <span className={`text-lg font-bold ${lang === l.id ? 'text-green-900' : 'text-[#1B4332]'}`}>{l.local}</span>
            </button>
          ))}
        </div>
      </section>

      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <i className="fas fa-power-off"></i>
        {t.logout}
      </button>
    </div>
  );
};

export default Settings;
