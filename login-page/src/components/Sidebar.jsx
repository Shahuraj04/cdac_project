import React from 'react';
import {
    BarChart, Users, Calendar, Briefcase,
    Settings, LogOut, Building2, MessageSquare
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout, userData }) {
    const location = useLocation();
    const role = userData?.role;
    const isAdmin = role === 'ROLE_ADMIN';
    const isHR = role === 'ROLE_HR';

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 h-full">
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <BarChart size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">One<span className="text-indigo-600">HR</span></span>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto custom-scrollbar">
                <SidebarItem icon={<BarChart size={20} />} label="Overview" to="/dashboard" active={location.pathname === '/dashboard'} />

                {(isAdmin || isHR) && (
                    <>
                        <div className="pt-4 pb-2 px-3">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Staff Directory</p>
                        </div>
                        <SidebarItem icon={<Users size={20} />} label="Employee Management" to="/employees" active={location.pathname === '/employees'} />
                        <SidebarItem icon={<Building2 size={20} />} label="Departments" to="/departments" active={location.pathname === '/departments'} />
                        <SidebarItem icon={<Calendar size={20} />} label="Attendance" to="/attendance" active={location.pathname === '/attendance'} />
                    </>
                )}

                <div className="pt-4 pb-2 px-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Communication</p>
                </div>
                <SidebarItem icon={<MessageSquare size={20} />} label="Messages" to="/chat" active={location.pathname === '/chat'} />

                <div className="pt-4 pb-2 px-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System</p>
                </div>
                <SidebarItem icon={<Settings size={20} />} label="Settings" to="/settings" active={location.pathname === '/settings'} />
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 w-full p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon, label, to = "#", active = false }) {
    return (
        <Link to={to} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
            }`}>
            {icon}
            <span className="text-sm">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
        </Link>
    );
}