import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import employeeService from '../../services/employeeService';
import dashboardService from '../../services/dashboardService';
import hrService from '../../services/hrService';
import EmployeeManagementActions from '../../components/hr/EmployeeManagementActions';
import { useNavigate } from 'react-router-dom';
import { UserPlus, X, CheckCircle } from 'lucide-react';

export default function EmployeeManagement() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Onboarding States
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            setUserData(user);
            fetchData();
            fetchHRProfile(user.id);
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const data = await dashboardService.getDashboardData();
            setEmployees(data.employees || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHRProfile = async (userId) => {
        try {
            const data = await hrService.getHrByUserId(userId);
            setHrProfile(data);
            setNewEmp(prev => ({ ...prev, deptId: data.department?.deptId || '' }));
        } catch (err) {
            console.error('Error fetching HR profile:', err);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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
            fetchData(); // Refresh list after adding
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to onboard employee' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const filteredEmployees = employees.filter(emp =>
        emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.deptName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!userData) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Notification Toast */}
            {message.text && (
                <div className={`fixed top-5 right-5 z-[110] p-5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all animate-in slide-in-from-right-10 ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'}`}>
                    {message.type === 'success' ? <CheckCircle size={24} /> : <X size={24} />}
                    <span className="font-bold text-sm uppercase">{message.text}</span>
                </div>
            )}

            <Sidebar onLogout={handleLogout} userData={userData} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-slate-800">Employee Management</h1>

                    <div className="flex items-center space-x-4">
                       
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                            <UserPlus size={18} />
                            <span>Add Employee</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Join Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan="5" className="py-20 text-center text-slate-400">Loading employees...</td></tr>
                                    ) : filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                                        <tr key={emp.empId} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                                                        {emp.emp_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{emp.emp_name}</p>
                                                        <p className="text-xs text-slate-500">{emp.designation}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                    {emp.department?.dept_name ?? emp.department?.deptName ?? 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600">
                                                <p>{emp.phone}</p>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">
                                                {emp.joinDate || 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <EmployeeManagementActions employee={emp} onAction={fetchData} />
                                            </td>
                                        </tr>
                                        
                                    )) : (
                                        <tr><td colSpan="5" className="py-20 text-center text-slate-400">No employees found matching your search.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Ported Onboarding Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">Onboarding</h3>
                                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">New Personnel Entry</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Employee Name"
                                    value={newEmp.emp_name}
                                    onChange={e => setNewEmp({ ...newEmp, emp_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                <input
                                    type="email" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="email@company.com"
                                    value={newEmp.email}
                                    onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                                <input
                                    type="text" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Job Role"
                                    value={newEmp.designation}
                                    onChange={e => setNewEmp({ ...newEmp, designation: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                <input
                                    type="text" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Phone Number"
                                    value={newEmp.phone}
                                    onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    placeholder="Temporary Password"
                                    value={newEmp.password}
                                    onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date</label>
                                <input
                                    type="date" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                    value={newEmp.joinDate}
                                    onChange={e => setNewEmp({ ...newEmp, joinDate: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                                >
                                    <UserPlus size={20} />
                                    <span>{submitting ? 'Processing...' : 'Complete Onboarding'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}