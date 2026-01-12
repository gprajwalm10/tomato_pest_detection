import React from 'react';
import { Weather } from '../types';

interface WeatherWidgetProps {
    weather: Weather | null;
    loading: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-[#4ADE80] to-[#22c55e] p-6 rounded-[2.5rem] shadow-lg text-white mb-6 animate-pulse">
                <div className="h-4 w-24 bg-white/20 rounded mb-4"></div>
                <div className="h-10 w-16 bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-32 bg-white/20 rounded"></div>
            </div>
        );
    }

    if (!weather) {
        // Hidden if failed or no location yet, to keep UI clean
        return null;
    }

    return (
        <div className="mb-6 relative overflow-hidden">
            {/* Main Weather Card */}
            <div className="bg-gradient-to-br from-[#4ADE80] to-[#22c55e] p-6 rounded-[2.5rem] shadow-lg text-white relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-sm font-bold opacity-90 mb-1 flex items-center gap-2">
                            <i className="fas fa-location-dot"></i>
                            {weather.location}
                        </h2>
                        <h1 className="text-4xl font-bold mb-2">{weather.temperature}°C</h1>
                        <p className="font-medium opacity-90">{weather.condition}</p>
                    </div>
                    <div className="text-5xl opacity-80">
                        <i className={`fas ${weather.icon}`}></i>
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold">
                        <i className="fas fa-wind"></i>
                        {weather.windSpeed} km/h
                    </div>
                </div>
            </div>

            {/* Disaster Alerts - Stacked below if any */}
            {weather.alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                    {weather.alerts.map(alert => (
                        <div key={alert.id} className="bg-red-500 text-white p-4 rounded-3xl shadow-md flex items-start gap-3 animate-pulse">
                            <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                <i className="fas fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-90">{alert.type} Alert</p>
                                <p className="text-sm font-bold leading-tight">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
