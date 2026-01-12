
import React from 'react';
import { PestDiagnosis } from '../types';

interface DiagnosisCardProps {
  diagnosis: PestDiagnosis;
  image: string;
  onClose: () => void;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis, image, onClose }) => {
  const getSeverity = (s: string) => {
    switch (s.toLowerCase()) {
      case 'high': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: 'fa-triangle-exclamation' };
      case 'medium': return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: 'fa-circle-exclamation' };
      case 'low': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'fa-circle-info' };
      default: return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: 'fa-circle-check' };
    }
  };

  const style = getSeverity(diagnosis.severity);

  return (
    <div className="fixed inset-0 bg-[#F8FAF8] z-[80] overflow-y-auto animate-in slide-in-from-bottom duration-500">
      {/* Hero Image Section */}
      <div className="relative h-80">
        <img src={image} alt="Scan Result" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>
        <div className="absolute bottom-10 left-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${style.bg} ${style.border} ${style.color} text-[10px] font-bold uppercase tracking-wider mb-3 shadow-xl`}>
            <i className={`fas ${style.icon}`}></i>
            {diagnosis.severity} Severity
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{diagnosis.name}</h2>
          <p className="text-white/70 italic text-sm">{diagnosis.scientificName}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-28 -mt-8 relative z-10">
        <div className="bg-[#F8FAF8] rounded-t-[2.5rem] pt-8">
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-green-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Confidence</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-[#1B4332]">{Math.round(diagnosis.confidence * 100)}%</span>
                <i className="fas fa-check-circle text-green-500 mb-1.5 text-xs"></i>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-green-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Category</p>
              <div className="flex items-end gap-1">
                <span className="text-lg font-bold text-[#1B4332]">{diagnosis.isHealthy ? 'Healthy' : 'Affected'}</span>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Visible Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {diagnosis.symptoms.map((s, i) => (
                <span key={i} className="bg-white px-4 py-2 rounded-2xl text-xs text-gray-600 border border-green-50 shadow-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Treatment Timeline / Actions */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Treatment Plan
            </h3>
            <div className="space-y-4">
              {diagnosis.immediateActions.map((action, i) => (
                <div key={i} className="group relative bg-white p-5 rounded-[2rem] shadow-sm border border-green-50 flex gap-4 items-start transition-all hover:shadow-md">
                  <div className="w-10 h-10 shrink-0 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Step {i + 1}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Solutions Toggle Style */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-emerald-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-leaf text-emerald-400"></i> Organic Protocol
              </h3>
              <ul className="space-y-3">
                {diagnosis.organicSolutions.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-emerald-100/80">
                    <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                    {s}
                  </li>
                ))}
              </ul>
              <i className="fas fa-leaf absolute -right-6 -bottom-6 text-emerald-800/20 text-7xl rotate-12"></i>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-flask text-indigo-500"></i> Chemical Solutions
              </h3>
              <ul className="space-y-3">
                {diagnosis.chemicalSolutions.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prevention */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-widest mb-4">Prevention Strategy</h3>
            <div className="bg-[#E9F5EE] p-6 rounded-[2.5rem]">
              <div className="grid grid-cols-1 gap-3">
                {diagnosis.preventionTips.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <i className="fas fa-shield-halved text-green-600 mt-0.5 text-sm"></i>
                    <p className="text-xs text-[#1B4332]/70 font-medium leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAF8] via-[#F8FAF8]/95 to-transparent flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 bg-[#1B4332] text-white font-bold py-5 rounded-[1.8rem] shadow-2xl shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-camera"></i>
          New Scan
        </button>
        <button className="w-20 bg-white border border-green-50 text-green-600 rounded-[1.8rem] shadow-xl flex items-center justify-center active:scale-[0.98] transition-all">
          <i className="fas fa-share-nodes text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default DiagnosisCard;
