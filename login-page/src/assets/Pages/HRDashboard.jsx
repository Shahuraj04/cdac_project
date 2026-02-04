import React, { useState, useEffect } from 'react';
import ActivityRow from '../../components/ActivityRow';
import leaveService from '../../services/leaveservice';
import hrService from '../../services/hrService';
import employeeService from '../../services/employeeService';
import { Check, X, UserPlus, Briefcase, Phone, Mail, Lock, CheckCircle, Send, Calendar as CalendarIcon, Layout, Users } from 'lucide-react';
import TeamTimesheetTable from '../../components/hr/TeamTimesheetTable';
import TodoList from '../../components/TodoList';



export default function HRDashboard({ team, activity, leaves = [], onRefresh, userData }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [hrProfile, setHrProfile] = useState(null);

    const [newEmp, setNewEmp] = useState({
        emp_name: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        joinDate: new Date().toISOString().split('T')[0],
        deptId: ''
    });

    useEffect(() => {
        if (userData?.id) {
            hrService.getHrByUserId(userData.id)
                .then(data => {
                    setHrProfile(data);
                    setNewEmp(prev => ({ ...prev, deptId: data.department?.deptId }));
                })
                .catch(err => console.error('Error fetching HR profile:', err));
        }
    }, [userData]);

    const handleLeaveStatus = async (leaveId, status) => {
        try {
            const hrId = hrProfile?.hrId || 1;
            await leaveService.updateLeaveStatus(leaveId, status, hrId);
            setMessage({ type: 'success', text: `Leave ${status.toLowerCase()}ed!` });
            if (onRefresh) onRefresh();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Error updating leave status:', err);
            setMessage({ type: 'error', text: 'Failed to update leave status' });
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...newEmp,
                hrId: hrProfile?.hrId || 1,
                deptId: parseInt(newEmp.deptId)
            };
            await employeeService.addEmployee(payload);
            setMessage({ type: 'success', text: 'Employee onboarded successfully!' });
            setShowAddModal(false);
            setNewEmp({
                emp_name: '',
                email: '',
                password: '',
                phone: '',
                designation: '',
                joinDate: new Date().toISOString().split('T')[0],
                deptId: hrProfile?.department?.deptId || ''
            });
            if (onRefresh) onRefresh();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to onboard employee' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };
    const getDayName = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Notification Toast */}
            {message.text && (
                <div className={`fixed top-5 right-5 z-[100] p-5 rounded-[1.5rem] shadow-2xl flex items-center space-x-3 transition-all transform animate-in slide-in-from-right-10 duration-500 ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'}`}>
                    {message.type === 'success' ? <CheckCircle size={24} /> : <X size={24} />}
                    <span className="font-black text-sm uppercase tracking-wider">{message.text}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Management Hub</h2>
                    <p className="text-slate-500 font-medium italic">Coordination and team oversight center.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 group"
                >
                    <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Onboard Colleague</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Team Directory Table */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                        <h3 className="font-black text-2xl mb-8 text-slate-800 flex items-center space-x-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Users size={20} />
                            </div>
                            <span>Team Matrix</span>
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                        <th className="pb-4 px-4">Member Identity</th>
                                        <th className="pb-4 px-4">Designation</th>
                                        <th className="pb-4 px-4">Contact Detail</th>
                                        <th className="pb-4 px-4 text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {team.length > 0 ? team.map(emp => (
                                        <tr key={emp.empId} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
                                                        {emp.emp_name.charAt(0)}
                                                    </div>
                                                    <p className="font-bold text-slate-800">{emp.emp_name}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="text-xs font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                                                    {emp.designation}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-sm font-medium text-slate-400 font-mono italic">{emp.phone}</td>
                                            <td className="py-5 px-4 text-right text-xs font-black text-slate-600 tabular-nums">
                                                {emp.joinDate}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">No team members assigned</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Leave Approvals */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30">
                        <h3 className="font-black text-2xl mb-8 text-slate-800 flex items-center space-x-3">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <Send size={20} />
                            </div>
                            <span>Leave Coordination</span>
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                        <th className="pb-4 px-4">Employee</th>
                                        <th className="pb-4 px-4">Period</th>
                                        <th className="pb-4 px-4">Justification</th>
                                        <th className="pb-4 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {leaves.length > 0 ? leaves.map(leave => (
                                        <tr key={leave.leaveId} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-[10px] uppercase">
                                                        {leave.empName.charAt(0)}
                                                    </div>
                                                    <p className="font-black text-slate-800 text-sm">{leave.empName}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex flex-col text-[10px] font-black tabular-nums">
                                                    <span className="text-indigo-600">{leave.startDate}</span>
                                                    <span className="text-slate-400 font-normal">{getDayName(leave.startDate)}</span>
                                                    <span className="text-slate-800">{leave.endDate}</span>
                                                </div>
                                            </td>
                                            
                                            <td className="py-6 px-4">
                                                <p className="text-xs font-medium text-slate-500 max-w-xs">{leave.reason || leave.leaveCategory }</p>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleLeaveStatus(leave.leaveId, 'APPROVED')}
                                                        className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all active:scale-95"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleLeaveStatus(leave.leaveId, 'REJECTED')}
                                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">No pending requests</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Todo List */}
                <div className="lg:col-span-1">
                    <TodoList userKey={`hr_${userData?.id}`} />
                </div>
            </div>

            {/* Team Timesheet */}
            {hrProfile?.hrId && (
                <TeamTimesheetTable hrId={hrProfile.hrId} />
            )}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>

                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Onboarding</h3>
                                <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Personnel Provisioning Protocol</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-4 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={28} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Employee Name"
                                    value={newEmp.emp_name}
                                    onChange={e => setNewEmp({ ...newEmp, emp_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                <input
                                    type="email" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="email@company.com"
                                    value={newEmp.email}
                                    onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                                <input
                                    type="text" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Job Role"
                                    value={newEmp.designation}
                                    onChange={e => setNewEmp({ ...newEmp, designation: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Line</label>
                                <input
                                    type="text" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Phone Number"
                                    value={newEmp.phone}
                                    onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol</label>
                                <input
                                    type="password" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Temporary Password"
                                    value={newEmp.password}
                                    onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date</label>
                                <input
                                    type="date" required
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    value={newEmp.joinDate}
                                    onChange={e => setNewEmp({ ...newEmp, joinDate: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                                >
                                    <UserPlus size={24} />
                                    <span>{loading ? 'Processing...' : 'Complete Onboarding'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
