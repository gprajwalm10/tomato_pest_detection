import axios from 'axios';
import { Weather, WeatherAlert } from '../types';

// Map WMO Weather Codes to descriptions and icons
const getWeatherDescription = (code: number): { condition: string; icon: string; severity: 'low' | 'medium' | 'high' } => {
    switch (code) {
        case 0: return { condition: 'Clear Sky', icon: 'fa-sun', severity: 'low' };
        case 1:
        case 2:
        case 3: return { condition: 'Partly Cloudy', icon: 'fa-cloud-sun', severity: 'low' };
        case 45:
        case 48: return { condition: 'Foggy', icon: 'fa-smog', severity: 'medium' };
        case 51:
        case 53:
        case 55: return { condition: 'Drizzle', icon: 'fa-cloud-rain', severity: 'low' };
        case 56:
        case 57: return { condition: 'Freezing Drizzle', icon: 'fa-snowflake', severity: 'medium' };
        case 61:
        case 63:
        case 65: return { condition: 'Rain', icon: 'fa-cloud-showers-heavy', severity: 'medium' };
        case 66:
        case 67: return { condition: 'Freezing Rain', icon: 'fa-icicles', severity: 'high' };
        case 71:
        case 73:
        case 75: return { condition: 'Snow', icon: 'fa-snowflake', severity: 'medium' };
        case 77: return { condition: 'Snow Grains', icon: 'fa-snowflake', severity: 'medium' };
        case 80:
        case 81:
        case 82: return { condition: 'Rain Showers', icon: 'fa-cloud-rain', severity: 'medium' };
        case 85:
        case 86: return { condition: 'Snow Showers', icon: 'fa-snowflake', severity: 'medium' };
        case 95: return { condition: 'Thunderstorm', icon: 'fa-bolt', severity: 'high' };
        case 96:
        case 99: return { condition: 'Hailstorm', icon: 'fa-cloud-bolt', severity: 'high' };
        default: return { condition: 'Unknown', icon: 'fa-cloud', severity: 'low' };
    }
};

export const fetchWeather = async (lat: number, lng: number): Promise<Weather> => {
    try {
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        // Reverse geocoding for location name (using OpenStreetMap Nominatim - Free)
        // Note: In a real scaled app, use a paid service or cache aggressively. 
        // For this demo, we'll try to get it, fallback if fails.
        let locationName = "Your Farm";
        try {
            const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (geoRes.data && geoRes.data.address) {
                locationName = geoRes.data.address.village || geoRes.data.address.town || geoRes.data.address.city || geoRes.data.address.county || "Local Farm";
            }
        } catch (e) {
            console.warn("Reverse geocode failed", e);
        }

        const current = response.data.current_weather;
        const { condition, icon, severity } = getWeatherDescription(current.weathercode);

        const alerts: WeatherAlert[] = [];
        if (severity === 'high') {
            alerts.push({
                id: Date.now().toString(),
                type: 'Storm',
                message: `Severe weather alert: ${condition}. Take necessary precautions for your crops.`,
                severity: 'high'
            });
        }

        return {
            temperature: current.temperature,
            condition,
            location: locationName,
            icon,
            humidity: 0, // Open-Meteo current_weather doesn't give humidity in basic call, ignoring for simplicity or could add hourly param
            windSpeed: current.windspeed,
            alerts
        };
    } catch (error) {
        console.error("Weather fetch failed", error);
        throw new Error("Could not fetch weather data");
    }
};
