'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Registration successful! Check your email to confirm, or sign in if email confirmations are disabled.');
        setIsRegister(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        onSuccess(data.user);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative flex flex-col gap-6">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white font-bold text-sm"
        >
          ✕
        </button>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-zinc-400">
            {isRegister ? 'Sign up to manage your rides & profile.' : 'Sign in to your Go Rapid account.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
              required 
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="mt-2 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm tracking-wide transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)} 
            className="text-emerald-400 font-bold hover:underline ml-1"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}