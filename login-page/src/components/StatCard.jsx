import React from 'react';

export default function StatCard({ label, value, icon, trend }) {
    const isPositive = trend?.startsWith('+');

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>

                {trend && (
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg ${isPositive
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                    >
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-2xl font-extrabold mt-1">{value}</p>
            </div>
        </div>
    );
}
