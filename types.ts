
export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ml' | 'ta';

export interface PestDiagnosis {
  name: string;
  scientificName: string;
  confidence: number;
  symptoms: string[];
  immediateActions: string[];
  organicSolutions: string[];
  chemicalSolutions: string[];
  preventionTips: string[];
  isHealthy: boolean;
  severity: 'low' | 'medium' | 'high' | 'none';
}

export type AppState = 'dashboard' | 'camera' | 'upload' | 'analyzing' | 'result' | 'history' | 'settings' | 'community' | 'chat' | 'mandi';
export type AuthState = 'login' | 'register' | 'authenticated';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  preferredLanguage?: Language;
  lat?: number;
  lng?: number;
  connections?: string[];
  pendingRequests?: string[];
  sentRequests?: string[];
  plantedDate?: string; // ISO string for crop calendar
}

export interface MarketPrice {
  id: string;
  mandi: string;
  price: string; // e.g. "₹2,400/Quintal"
  trend: 'up' | 'down' | 'stable';
  change: string; // e.g. "+5%"
}

export interface FarmerTask {
  id: string;
  title: string;
  description: string;
  category: 'water' | 'fertilizer' | 'pest' | 'harvest';
  dayRange: [number, number]; // Days since planting
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  userId: string;
  date: string;
  timestamp: number;
  image: string;
  diagnosis: PestDiagnosis;
}

export interface FarmInsight {
  id: string;
  title: string;
  category: 'Yield' | 'News' | 'Tip' | 'Practice';
  description: string;
  details: string[];
  icon: string;
  color: string;
  isIndianContext?: boolean;
}
