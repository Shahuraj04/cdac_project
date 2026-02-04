import React from 'react';
import { Megaphone, Bell, Info } from 'lucide-react';

export default function NoticeBoard() {
    const notices = [
        { id: 1, type: 'URGENT', text: 'Quarterly review meetings scheduled for Friday morning.', time: '2h ago' },
        { id: 2, type: 'INFO', text: 'New health insurance policy documents are now available in settings.', time: '5h ago' },
        { id: 3, type: 'EVENT', text: 'Team dinner celebration next Thursday at 7:00 PM.', time: '1d ago' }
    ];

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-2xl text-slate-800 flex items-center space-x-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                        <Megaphone size={20} />
                    </div>
                    <span>Boardroom Bulletins</span>
                </h3>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 relative">
                    <Bell size={20} />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                </div>
            </div>

            <div className="space-y-6">
                {notices.map((notice) => (
                    <div key={notice.id} className="flex gap-4 group">
                        <div className={`mt-1 w-1.5 h-12 rounded-full transition-all group-hover:scale-y-110 ${notice.type === 'URGENT' ? 'bg-rose-500' :
                                notice.type === 'INFO' ? 'bg-indigo-500' : 'bg-emerald-500'
                            }`}></div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-black tracking-widest uppercase ${notice.type === 'URGENT' ? 'text-rose-600' :
                                        notice.type === 'INFO' ? 'text-indigo-600' : 'text-emerald-600'
                                    }`}>
                                    {notice.type}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{notice.time}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                {notice.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all">
                Access Archive
            </button>
        </div>
    );
}
