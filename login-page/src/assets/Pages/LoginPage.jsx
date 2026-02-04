import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Mail, Lock, Eye, EyeOff,
  ArrowRight, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // CDN injection removed as Tailwind is now properly configured locally
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        role: data.role,
        id: data.id
      }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center font-sans text-slate-900 overflow-hidden relative">

      {/* BACKGROUND IMAGE STRATEGY: Full Screen Soft Blur */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)'
        }}
      />

      {/* Main Container */}
      <div className="w-full h-full max-w-6xl lg:h-[85%] lg:max-h-[800px] grid grid-cols-1 lg:grid-cols-2 bg-white/90 lg:rounded-3xl shadow-2xl overflow-hidden z-10 backdrop-blur-md border border-white/20">

        {/* Left Section (Branding with Specific HR Image) */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 lg:p-14 h-full relative text-white"
          style={{
            backgroundImage: "linear-gradient(to bottom right, rgba(37, 99, 235, 0.85), rgba(67, 56, 202, 0.9)), url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <LayoutDashboard size={32} className="text-blue-200" />
              <h1 className="text-3xl font-bold tracking-tight text-white">One<span className="text-blue-300">HR</span></h1>
            </div>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Manage your <br />
              <span className="text-blue-200">Talent Smarter.</span>
            </h2>
            <p className="text-blue-50 text-lg font-light max-w-md leading-relaxed">
              The professional all-in-one platform for modern HR teams to manage talent, attendance, and company culture seamlessly.
            </p>
          </div>

          <div className="relative z-10 flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck size={24} className="text-emerald-900" />
            </div>
            <div>
              <p className="text-sm font-bold">Secure Enterprise Access</p>
              <p className="text-xs text-blue-100">End-to-end encrypted workplace portal</p>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center h-full bg-white/80">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <LayoutDashboard size={24} />
                <span className="text-xl font-bold uppercase tracking-tighter">OneHR</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 text-sm font-medium">Please enter your work credentials</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center space-x-2 animate-shake">
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[2px]">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[2px]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                <label htmlFor="remember" className="text-xs text-slate-600 font-bold cursor-pointer">Remember me</label>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 text-lg mt-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>


        </div>
      </div>

      <div className="absolute bottom-6 text-white/40 text-[10px] font-bold tracking-[3px] uppercase hidden lg:block z-10">
        © 2026 OneHR Systems
      </div>
    </div>
  );
}