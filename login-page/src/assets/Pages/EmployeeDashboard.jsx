import React, { useState, useEffect } from 'react';
import leaveService from '../../services/leaveservice';
import { Calendar, Clock, CheckCircle, Send, X, ArrowRight, Wallet, Award, Coffee, Briefcase, MapPin } from 'lucide-react';
import CheckoutButton from '../../components/employee/CheckoutButton';
import TimesheetTable from '../../components/employee/TimesheetTable';
import TodoList from '../../components/TodoList';



const REASON_PLACEHOLDERS = {
    SICK: 'Describe your symptoms or medical condition',
    CASUAL: 'Specify the personal reason for leave',
    ANNUAL: 'Describe your vacation plans or purpose',
    WFH: 'Explain why you need to work from home',
    UNPAID: 'Provide detailed justification for unpaid leave',
    MATERNITY: 'Expected delivery date and doctor details',
    PATERNITY: 'Birth date of child and family details',
    BEREAVEMENT: 'Relationship with deceased and funeral details',
    COMP_OFF: 'Mention the date(s) you worked extra hours',
    STUDY: 'Exam/course details and schedule'
};

export default function EmployeeDashboard({ profile, onRefresh, leaves = [] }) {
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [leaveCategories, setLeaveCategories] = useState([]);
    const [leaveRequest, setLeaveRequest] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        leaveCategory: 'CASUAL',
        leaveSubCategory: '',
        emergencyContact: '',
        emergencyContactName: ''
    });

    const leaveBalance = 20;
    const usedLeaves = leaveHistory.filter(l => l.status === 'APPROVED').length;

    useEffect(() => {
        const loadHistory = async () => {
            if (!profile?.empId) return;
            try {
                const history = await leaveService.getLeavesByEmployee(profile.empId);
                setLeaveHistory(history);
            } catch (err) {
                console.error('Error fetching leave history:', err);
            }
        };
        loadHistory();
    }, [profile?.empId]);

    useEffect(() => {
        if (showLeaveModal && leaveCategories.length === 0) {
            leaveService.getLeaveCategories().then(data => setLeaveCategories(Array.isArray(data) ? data : []));
        }
    }, [showLeaveModal, leaveCategories.length]);

    const totalDays = (() => {
        if (!leaveRequest.startDate || !leaveRequest.endDate) return 0;
        const start = new Date(leaveRequest.startDate);
        const end = new Date(leaveRequest.endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(0, diff);
    })();

    const requiresMedicalCert = leaveRequest.leaveCategory === 'SICK' || leaveRequest.leaveCategory === 'MATERNITY';

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                empId: profile.empId,
                startDate: leaveRequest.startDate,
                endDate: leaveRequest.endDate,
                reason: leaveRequest.reason,
                leaveCategory: leaveRequest.leaveCategory || 'CASUAL',
                leaveSubCategory: leaveRequest.leaveSubCategory || undefined,
                emergencyContact: totalDays >= 5 ? leaveRequest.emergencyContact : undefined,
                emergencyContactName: totalDays >= 5 ? leaveRequest.emergencyContactName : undefined
            };
            await leaveService.applyLeave(payload);
            alert('Leave applied successfully!');
            setShowLeaveModal(false);
            // Refresh leave history
            try {
                const history = await leaveService.getLeavesByEmployee(profile.empId);
                setLeaveHistory(history);
            } catch (err) {
                console.error('Error refreshing leave history:', err);
            }
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Error applying leave:', err);
            alert('Failed to apply leave');
        } finally {
            setSubmitting(false);
        }
    };

    if (!profile) return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Loading Organization Profile...</div>;

    return (
        <div className="space-y-8 pb-10">
             <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-4xl font-black mb-2 tracking-tight">Welcome back, {profile?.emp_name}!</h2>
                        <p className="text-indigo-100 font-medium text-lg uppercase tracking-widest">{profile?.designation} • {profile?.department?.deptName}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-center min-w-[140px]">
                            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-1">Status</p>
                            <p className="text-2xl font-black">Online</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-center min-w-[140px]">
                            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-1">Leave Usage</p>
                            <p className="text-2xl font-black">{usedLeaves}/{leaveBalance}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/30">                        <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">Current Post</span>
                    </div>
                        <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Designation</h4>
                        <p className="text-2xl font-black text-slate-800">{profile.designation}</p>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/30">                        <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">Leave Balance</span>
                    </div>
                        <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Available Days</h4>
                        <p className="text-2xl font-black text-slate-800">{leaveBalance - usedLeaves} Days</p>
                    </div>
                </div>

                {/* Right Column: Actions & Todo */}
                <div className="flex flex-col gap-8">
                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 flex flex-col space-y-4">
                        <CheckoutButton empId={profile.empId} />

                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="w-full bg-slate-100 text-slate-800 p-6 rounded-3xl font-black flex items-center justify-between hover:bg-slate-200 transition-all active:scale-95 group"
                        >
                            <span>Apply for Leave</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Todo List */}
                    <TodoList userKey={`emp_${profile.empId}`} />
                </div>
            </div>

            {/* Application History */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-2xl text-slate-800 flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <CheckCircle size={20} />
                        </div>
                        <span>Leave Application History</span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="pb-4 px-4">Category</th>
                                <th className="pb-4 px-4">Duration</th>
                                <th className="pb-4 px-4">Reason</th>
                                <th className="pb-4 px-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leaveHistory.length > 0 ? leaveHistory.map(leave => (
                                <tr key={leave.leaveId} className="group hover:bg-slate-50/50 transition-colors cursor-default">
                                    <td className="py-6 px-4">
                                        <p className="font-black text-slate-800 uppercase text-xs tracking-widest">{leave.leaveCategory || leave.leaveType || 'Leave'}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="text-sm font-bold text-slate-600 tabular-nums">{leave.startDate} to {leave.endDate}</p>
                                    </td>
                                    <td className="py-6 px-4 text-sm font-medium text-slate-400">{leave.leaveCategory || leave.leaveType || leave.reason || 'Leave'}</td>
                                    <td className="py-6 px-4 text-right">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                            leave.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {leave.status}
                                        </span>
                                        {console.log(leave)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">No history recorded yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Timesheet */}
            <TimesheetTable empId={profile.empId} />

            {/* Leave Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>

                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900">Application</h3>
                                <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Leave Request Portal</p>
                            </div>
                            <button onClick={() => setShowLeaveModal(false)} className="p-4 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
                                <X size={28} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleApplyLeave} className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Departure Date</label>
                                    <input
                                        type="date" required
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-800 tabular-nums"
                                        value={leaveRequest.startDate}
                                        onChange={e => setLeaveRequest({ ...leaveRequest, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Return Date</label>
                                    <input
                                        type="date" required
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-800 tabular-nums"
                                        value={leaveRequest.endDate}
                                        onChange={e => setLeaveRequest({ ...leaveRequest, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Leave Category *</label>
                                <select
                                    required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-800"
                                    value={leaveRequest.leaveCategory}
                                    onChange={e => setLeaveRequest({ ...leaveRequest, leaveCategory: e.target.value, leaveSubCategory: '' })}
                                >
                                    <option value="">Select leave type</option>
                                    {leaveCategories.map((cat) => (
                                        <option key={cat.categoryCode} value={cat.categoryCode}>
                                            {cat.categoryName}{cat.maxDaysAllowed != null ? ` (Max: ${cat.maxDaysAllowed} days)` : ''}
                                        </option>
                                    ))}
                                </select>
                                {requiresMedicalCert && (
                                    <p className="text-xs text-rose-600 font-bold mt-1 ml-1">Medical certificate may be required for this leave type.</p>
                                )}
                            </div>

                            {totalDays > 0 && (
                                <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                                    <p className="text-sm font-bold text-slate-700">Total duration: {totalDays} day{totalDays !== 1 ? 's' : ''}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reason / Justification *</label>
                                <textarea
                                    required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 h-32 resize-none"
                                    placeholder={REASON_PLACEHOLDERS[leaveRequest.leaveCategory] || 'Briefly explain the reason for your leave...'}
                                    value={leaveRequest.reason}
                                    onChange={e => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
                                ></textarea>
                            </div>

                            {totalDays >= 5 && (
                                <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50 rounded-[1.5rem] border border-amber-200">
                                    <p className="col-span-2 text-xs font-black text-amber-800 uppercase tracking-widest">Emergency contact (leave ≥ 5 days)</p>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Contact name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                                            placeholder="Full name"
                                            value={leaveRequest.emergencyContactName}
                                            onChange={e => setLeaveRequest({ ...leaveRequest, emergencyContactName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Contact number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                                            placeholder="+1234567890"
                                            value={leaveRequest.emergencyContact}
                                            onChange={e => setLeaveRequest({ ...leaveRequest, emergencyContact: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                            >
                                <Send size={24} />
                                <span>{submitting ? 'Transmitting Request...' : 'Submit Application'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
