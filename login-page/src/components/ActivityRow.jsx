import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ActivityRow({ name, role, type, time, status }) {
    const statusColors = {
        'on-time': 'bg-emerald-500',
        'pending': 'bg-amber-500',
        'completed': 'bg-blue-500',
        'late': 'bg-red-500'
    };

    return (
        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${statusColors[status] || 'bg-slate-300'} shadow-sm shadow-current/20`} />
                <div>
                    <p className="text-sm font-bold text-slate-800">{name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                        {role} • <span className="text-indigo-600">{type}</span>
                    </p>
                </div>
            </div>
            <div className="flex items-center text-right">
                <span className="text-xs font-bold text-slate-400 mr-3">{time}</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}
