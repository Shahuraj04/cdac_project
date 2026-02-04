import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import api from '../../services/api';
import { exportTimesheetToCSV, formatTime } from '../../utils/csvExport';

const statusColors = {
    PRESENT: 'bg-green-100 text-green-800',
    LATE: 'bg-red-100 text-red-800',
    HALF_DAY: 'bg-yellow-100 text-yellow-800',
    ABSENT: 'bg-gray-100 text-gray-800',
    WORK_FROM_HOME: 'bg-blue-100 text-blue-800',
    LEAVE: 'bg-purple-100 text-purple-800'
};

export default function TimesheetTable({ empId }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            status: 'all'
        };
    });

    useEffect(() => {
        if (!empId) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empId, filters.startDate, filters.endDate, filters.status]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                start_date: filters.startDate,
                end_date: filters.endDate
            });
            if (filters.status !== 'all') {
                params.append('status', filters.status);
            }
            const res = await api.get(`/api/timesheet/employee/${empId}?${params.toString()}`);
            setRows(res.data || []);
        } catch (err) {
            console.error('Error fetching timesheet:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        exportTimesheetToCSV(rows);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30 mt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-2xl text-slate-800">My Timesheet</h3>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md active:scale-95"
                >
                    <Download size={16} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="PRESENT">On-time</option>
                    <option value="LATE">Late</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="ABSENT">Absent</option>
                    <option value="WORK_FROM_HOME">WFH</option>
                    <option value="LEAVE">Leave</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="pb-3 px-4">Emp ID</th>
                            <th className="pb-3 px-4">Name</th>
                            <th className="pb-3 px-4">HR</th>
                            <th className="pb-3 px-4">Date</th>
                            <th className="pb-3 px-4">Hours</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 px-4">Check In/Out</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                                    Loading timesheet...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-slate-300 font-bold uppercase tracking-widest italic">
                                    No records in selected range
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={`${row.empId}-${row.date}`} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3 px-4 text-xs font-mono text-slate-500">{row.empId}</td>
                                    <td className="py-3 px-4 font-semibold text-slate-800">{row.empName}</td>
                                    <td className="py-3 px-4 text-xs text-slate-500">{row.hrName || row.hrId || '-'}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                                        {row.date}
                                    </td>
                                    <td className="py-3 px-4 text-xs font-mono text-slate-800">
                                        {row.workingHours != null ? Number(row.workingHours).toFixed(2) : '0.00'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs font-mono text-slate-700">
                                        {row.checkinTime ? formatTime(row.checkinTime) : '--'}{' '}
                                        <span className="text-slate-400">-</span>{' '}
                                        {row.checkoutTime ? formatTime(row.checkoutTime) : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

