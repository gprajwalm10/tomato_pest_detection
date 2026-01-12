
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: User[] = JSON.parse(localStorage.getItem('agri_users') || '[]');

    if (mode === 'register') {
      if (!formData.name || !formData.username || !formData.password) {
        setError('Please fill all fields');
        return;
      }
      if (users.find(u => u.username === formData.username)) {
        setError('Username already exists');
        return;
      }
      const newUser: User = { 
        id: Date.now().toString(), 
        name: formData.name, 
        username: formData.username, 
        password: formData.password,
        preferredLanguage: 'en'
      };
      localStorage.setItem('agri_users', JSON.stringify([...users, newUser]));
      onAuthSuccess(newUser);
    } else {
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAF8] flex flex-col p-8 justify-center animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-900/10">
          <i className="fas fa-seedling text-4xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-[#1B4332]">AgriGuard AI</h1>
        <p className="text-gray-500 mt-2 font-medium">Protecting Your Tomato Harvest</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-50">
        <div className="flex mb-8 bg-gray-50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'register' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Username</label>
            <input 
              type="text" 
              placeholder="farmer_123" 
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center pt-2">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[#1B4332] text-white py-5 rounded-2xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-all mt-4"
          >
            {mode === 'login' ? 'Continue to My Farm' : 'Create My Account'}
          </button>
        </form>
      </div>

      <p className="text-center text-gray-400 text-[10px] mt-10 font-bold uppercase tracking-widest">
        Empowering {mode === 'login' ? 'Return' : 'New'} Farmers in India
      </p>
    </div>
  );
};

export default Auth;
