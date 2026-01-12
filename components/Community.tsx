
import React, { useMemo } from 'react';
import { User, Language } from '../types';
import { UI_TRANSLATIONS as translations } from '../constants';

interface CommunityProps {
  currentUser: User;
  allUsers: User[];
  onConnect: (userId: string) => void;
  onAccept: (userId: string) => void;
  onOpenChat: (userId: string) => void;
  language?: Language;
}

const Community: React.FC<CommunityProps> = ({ 
  currentUser, 
  allUsers, 
  onConnect, 
  onAccept, 
  onOpenChat, 
  language = 'en' 
}) => {
  const t = translations[language];

  // Simple distance calculation (simulated in KM)
  const calculateDistance = (lat1?: number, lng1?: number, lat2?: number, lng2?: number) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return (Math.random() * 10 + 1).toFixed(1);
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const nearbyFarmers = useMemo(() => {
    return allUsers
      .filter(u => u.id !== currentUser.id)
      .map(u => ({
        ...u,
        distance: calculateDistance(currentUser.lat, currentUser.lng, u.lat, u.lng)
      }))
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [allUsers, currentUser]);

  const requests = useMemo(() => {
    return allUsers.filter(u => currentUser.pendingRequests?.includes(u.id));
  }, [allUsers, currentUser.pendingRequests]);

  return (
    <div className="p-6 pb-32 animate-in slide-in-from-right duration-500">
      <header className="mb-8 pt-2">
        <h1 className="text-2xl font-bold text-[#1B4332]">{t.community}</h1>
        <p className="text-xs text-gray-500">Grow together with local experts</p>
      </header>

      {/* Requests Section */}
      {requests.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fas fa-bell"></i> {t.requests}
          </h3>
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="bg-orange-50 p-4 rounded-3xl border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100 font-bold">
                    {req.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B4332]">{req.name}</p>
                    <p className="text-[10px] text-orange-600/70 font-medium">Wants to connect</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onAccept(req.id)}
                    className="bg-[#1B4332] text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-sm"
                  >
                    {t.accept}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearby Farmers List */}
      <section>
        <h3 className="text-sm font-bold text-[#1B4332] uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-location-dot text-green-600"></i> {t.nearby_farmers}
        </h3>
        
        {nearbyFarmers.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-green-50 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-users text-2xl text-gray-200"></i>
            </div>
            <p className="text-xs text-gray-400 font-medium">{t.no_nearby}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {nearbyFarmers.map(farmer => {
              const isAccepted = currentUser.connections?.includes(farmer.id);
              const isPending = currentUser.sentRequests?.includes(farmer.id);

              return (
                <div key={farmer.id} className="bg-white p-4 rounded-[1.8rem] shadow-sm border border-green-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 font-bold text-xl border border-green-100">
                        {farmer.name[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B4332] text-sm">{farmer.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <i className="fas fa-map-marker-alt text-[8px] text-gray-400"></i>
                        <p className="text-[10px] text-gray-400 font-medium">{farmer.distance} km {t.distance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isAccepted ? (
                      <button 
                        onClick={() => onOpenChat(farmer.id)}
                        className="bg-green-600 text-white p-3 rounded-2xl shadow-lg shadow-green-900/10 active:scale-90 transition-transform"
                      >
                        <i className="fas fa-comment-dots text-sm"></i>
                      </button>
                    ) : isPending ? (
                      <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-gray-200">
                        {t.pending}
                      </div>
                    ) : (
                      <button 
                        onClick={() => onConnect(farmer.id)}
                        className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                      >
                        {t.connect}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Community;
