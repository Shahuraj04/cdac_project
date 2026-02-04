import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, Calendar, TrendingUp, CheckCircle, Zap, Shield, BarChart3,
  ArrowRight, Play
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // CDN injection removed as Tailwind is now properly configured locally
  }, []);

  const features = [
    { icon: <Users className="w-8 h-8" />, title: 'Employee Management', description: 'Comprehensive employee profiles, onboarding, and lifecycle management', color: 'blue' },
    { icon: <Clock className="w-8 h-8" />, title: 'Smart Attendance', description: 'Automated attendance tracking with real-time monitoring and late marking', color: 'green' },
    { icon: <Calendar className="w-8 h-8" />, title: 'Leave Management', description: 'Streamlined leave requests with multiple categories and instant approvals', color: 'purple' },
    { icon: <BarChart3 className="w-8 h-8" />, title: 'Advanced Analytics', description: 'Insightful reports and dashboards for data-driven decisions', color: 'orange' },
    { icon: <Zap className="w-8 h-8" />, title: 'Real-time Updates', description: 'Live notifications and instant synchronization across the platform', color: 'yellow' },
    { icon: <Shield className="w-8 h-8" />, title: 'Secure & Compliant', description: 'Enterprise-grade security with role-based access control', color: 'red' }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '50M+', label: 'Transactions' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ top: '-50px', left: '10%' }} />
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ top: '100px', right: '10%', animationDelay: '2s' }} />
          <div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ bottom: '-50px', left: '50%', animationDelay: '4s' }} />
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">OneHR</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-semibold text-sm flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4" />
                Trusted by 500+ Organizations
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Modern HR Management</span>
              <br />
              <span className="text-slate-900">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Streamline your workforce management with our powerful, intuitive platform. Automate attendance, manage leaves, and gain valuable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <button
                onClick={() => navigate('/login')}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Powerful features designed to make HR management effortless and efficient</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{f.title}</h3>
              <p className="text-slate-600">{f.description}</p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="w-5 h-5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your HR?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Join thousands of organizations already using our platform to streamline their HR processes</p>
            <button onClick={() => navigate('/login')} className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 text-center text-slate-600">
          <p className="mb-2">© 2026 OneHR. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
