import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Mail } from 'lucide-react';

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('john@hrpulse.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await signIn(email);
      // Navigation is handled by the useEffect above
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-blue-900 border border-blue-800 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-blue-900 text-3xl shadow-xl shadow-black/20 italic mb-6">
            P
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tighter italic uppercase">HR Pulse</h1>
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mt-2">Enterprise Intel</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] pl-1">Command Identity</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-blue-950/50 border border-blue-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium transition-all focus:bg-blue-950"
                placeholder="identity@enterprise.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <button
            type="submit"
            id="login-button"
            disabled={isSubmitting}
            className="flex items-center justify-center w-full gap-3 py-4 font-black text-blue-900 transition-all bg-white rounded-2xl hover:bg-blue-50 active:scale-[0.98] shadow-lg shadow-black/20 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Authorizing...' : 'Authenticate'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-blue-800/50 space-y-4">
          <p className="text-[10px] text-center text-blue-500 uppercase tracking-[0.3em] font-black">Simulation Roles</p>
          <div className="flex justify-center gap-3">
            <RoleChip email="john@hrpulse.com" label="Employee" onClick={setEmail} />
            <RoleChip email="sarah@hrpulse.com" label="Manager" onClick={setEmail} />
            <RoleChip email="admin@hrpulse.com" label="Admin" onClick={setEmail} />
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-[10px] text-blue-400 font-bold uppercase tracking-[0.5em] animate-pulse">
        System Secure • 2024 Cycle
      </div>
    </div>
  );
}

function RoleChip({ email, label, onClick }: any) {
  return (
    <button 
      type="button"
      onClick={() => onClick(email)}
      className="px-3 py-1.5 bg-blue-800 border border-blue-700 text-[9px] font-black uppercase tracking-widest text-blue-200 rounded-xl hover:bg-white hover:text-blue-900 hover:border-white transition-all shadow-sm"
    >
      {label}
    </button>
  );
}
