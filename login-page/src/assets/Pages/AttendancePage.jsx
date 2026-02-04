import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import api from '../../services/api'; // Integrated for timesheet API access
import { exportTimesheetToCSV } from '../../utils/csvExport'; // Integrated for CSV generation
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, Download, Loader2 } from 'lucide-react';

export default function AttendancePage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false); // State to manage export button feedback

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            setUserData(user);
            fetchAttendance();
        }
    }, [navigate]);

    const fetchAttendance = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            let data;

            if (user && user.role === 'ROLE_EMPLOYEE') {
                const profile = await employeeService.getEmployeeByUserId(user.id);
                data = await attendanceService.getAttendanceByEmployee(profile.empId);
            } else {
                data = await attendanceService.getRecentAttendance();
            }
            setAttendance(data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

   
    const handleExportCSV = async () => {
        try {
            setExporting(true);
            const user = JSON.parse(localStorage.getItem('user'));
            let empId;

            // Resolve employee ID based on user role
            if (user && user.role === 'ROLE_EMPLOYEE') {
                const profile = await employeeService.getEmployeeByUserId(user.id);
                empId = profile.empId;
            } else {
                // For HR/Admin, you may use user.id or a specific target ID
                empId = user.id;
            }

            // Define default 30-day range as used in TimesheetTable
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);

            const params = new URLSearchParams({
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0]
            });

            // Fetch timesheet data from the API
            const res = await api.get(`/api/timesheet/employee/${empId}?${params.toString()}`);
            const timesheetData = res.data || [];

            if (timesheetData.length > 0) {
                exportTimesheetToCSV(timesheetData); // Trigger the utility
            } else {
                alert("No timesheet records found for the selected period.");
            }
        } catch (err) {
            console.error('Error exporting timesheet:', err);
            alert("Failed to export timesheet data.");
        } finally {
            setExporting(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!userData) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar onLogout={handleLogout} userData={userData} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">Attendance Records</h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleExportCSV}
                            disabled={exporting}
                            className="flex items-center space-x-2 bg-indigo-600 border border-indigo-600 px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
                        >
                            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            <span>{exporting ? 'Exporting...' : 'Export Timesheet CSV'}</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">Associated Records</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Last 30 Days</span>
                                </div>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee Identity</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Record Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Check-In Time</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Verification Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan="4" className="py-20 text-center text-slate-400">Synchronizing records...</td></tr>
                                    ) : attendance.length > 0 ? attendance.map(rec => (
                                        <tr key={rec.attendanceId} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-[10px] uppercase">
                                                        {rec.empName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{rec.empName}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{rec.empDesignation}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600 font-medium font-mono">
                                                {rec.attendanceDate}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600 font-bold tabular-nums">
                                                {rec.attendanceTime || '--:--'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${rec.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                                                    rec.status === 'LATE' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">No operational records found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}