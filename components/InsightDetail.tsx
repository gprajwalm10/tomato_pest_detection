
import React from 'react';
import { FarmInsight, Language } from '../types';
import { UI_TRANSLATIONS as translations } from '../constants';

interface InsightDetailProps {
  insight: FarmInsight;
  onClose: () => void;
  language?: Language;
}

const InsightDetail: React.FC<InsightDetailProps> = ({ insight, onClose, language = 'en' }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-white z-[110] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className={`relative h-56 ${insight.color} flex items-center justify-center overflow-hidden`}>
        <div className="absolute top-6 left-6 flex gap-4 items-center">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        <i className={`fas ${insight.icon} text-white/20 text-[120px] absolute -right-4 -bottom-4 rotate-12`}></i>
        <div className="text-center p-6 relative z-10">
          <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full text-white font-bold uppercase tracking-widest mb-3 inline-block backdrop-blur-sm">
            {insight.category} {insight.isIndianContext && "• India Update"}
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">{insight.title}</h2>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <h3 className="text-lg font-bold text-[#1B4332] mb-4">{t.know_more_title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">
          "{insight.description}"
        </p>

        <div className="space-y-6">
          {insight.details.map((point, i) => {
            const [title, desc] = point.split(': ');
            return (
              <div key={i} className="flex gap-4">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${insight.color}`}></div>
                <div>
                  <h4 className="font-bold text-[#1B4332] text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i> {t.pro_tip}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {language === 'kn' ? 'ಯಾವುದೇ ಹೊಸ ನೀರಾವರಿ ಅಥವಾ ಗೊಬ್ಬರದ ಪದ್ಧತಿಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವ ಮೊದಲು ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು (KVK) ಸಂಪರ್ಕಿಸಿ.' :
             language === 'hi' ? 'कोई भी नया सिंचाई या उर्वरक अभ्यास शुरू करने से पहले स्थानीय कृषि विज्ञान केंद्र (KVK) से सलाह लें।' :
             language === 'te' ? 'ఏదైనా కొత్త సాగు పద్ధతులను ప్రారంభించే ముందు స్థానిక కృషి విజ్ఞాన కేంద్రాన్ని (KVK) సంప్రదించండి.' :
             language === 'ta' ? 'புதிய பாசன முறைகளை செயல்படுத்தும் முன் உங்கள் பகுதி வேளாண் அறிவியல் மையத்தை (KVK) அணுகவும்.' :
             language === 'ml' ? 'ഏതെങ്കിലും പുതിയ കൃഷിരീതികൾ തുടങ്ങുന്നതിന് മുമ്പ് പ്രാദേശിക കൃഷി വിജ്ഞാന കേന്ദ്രവുമായി (KVK) ബന്ധപ്പെടുക.' :
             'Always consult with your local Krishi Vigyan Kendra (KVK) representative before implementing major changes to your irrigation or fertilization schedule.'}
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={onClose}
          className={`w-full ${insight.color} text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all`}
        >
          {t.got_it}
        </button>
      </div>
    </div>
  );
};

export default InsightDetail;
