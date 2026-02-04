import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import employeeService from '../../services/employeeService';
import hrService from '../../services/hrService'; // Need to check if this exists
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, Briefcase } from 'lucide-react';

export default function SettingsPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        deptId: null,
        designation: '',
        joinDate: '',
        hrId: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            setUserData(user);
            fetchProfile(user);
        }
    }, [navigate]);

    const fetchProfile = async (user) => {
        try {
            let data;
            if (user.role === 'ROLE_EMPLOYEE') {
                try {
                    data = user.id ? await employeeService.getEmployeeByUserId(user.id) : await employeeService.getEmployeeByEmail(user.email);
                } catch (e) {
                    data = await employeeService.getEmployeeByEmail(user.email);
                }

                setProfile({
                    id: data.empId,
                    name: data.emp_name,
                    email: data.user.email,
                    phone: data.phone,
                    password: '',
                    deptId: data.department?.deptId,
                    designation: data.designation,
                    joinDate: data.joinDate,
                    hrId: data.hr?.hrId
                });
            } else if (user.role === 'ROLE_HR' || user.role === 'ROLE_ADMIN') {
                try {
                    try {
                        data = user.id ? await hrService.getHrByUserId(user.id) : await hrService.getHrByEmail(user.email);
                    } catch (e) {
                        data = await hrService.getHrByEmail(user.email);
                    }

                    setProfile({
                        id: data.hrId,
                        name: data.hr_name,
                        email: data.user.email,
                        phone: data.phone,
                        password: '',
                        deptId: data.department?.deptId
                        // Add other HR fields if needed
                    });
                } catch (e) {
                    // Fallback if HR profile doesn't exist for Admin
                    setProfile({
                        id: null,
                        name: user.role.replace('ROLE_', ''),
                        email: user.email,
                        phone: '',
                        password: '',
                        deptId: null
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const user = userData;

            if (user.role === 'ROLE_EMPLOYEE') {
                const updateData = {
                    emp_name: profile.name,
                    email: profile.email,
                    password: profile.password || undefined,
                    phone: profile.phone,
                    deptId: profile.deptId || 1,
                    designation: profile.designation,
                    joinDate: profile.joinDate,
                    hrId: profile.hrId
                };
                await employeeService.updateEmployee(profile.id, updateData);
            } else if (user.role === 'ROLE_HR' || user.role === 'ROLE_ADMIN') {
                if (profile.id) {
                    const updateData = {
                        hr_name: profile.name,
                        email: profile.email,
                        password: profile.password || undefined,
                        phone: profile.phone,
                        deptId: profile.deptId || user.deptId || 1
                    };
                    await hrService.updateHr(profile.id, updateData);
                } else {
                    throw new Error("Cannot update profile: No ID found");
                }
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
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

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                        <p className="text-slate-500">Manage your personal information and security preferences.</p>
                    </header>

                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {profile.name.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">{profile.name}</h3>
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{userData.role.replace('ROLE_', '')}</p>

                                <div className="mt-6 pt-6 border-t border-slate-50 text-left space-y-3">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Mail size={16} className="mr-3 text-slate-400" />
                                        <span className="truncate">{profile.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Phone size={16} className="mr-3 text-slate-400" />
                                        <span>{profile.phone || 'No phone added'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-sm text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">New Password (Leave blank to keep current)</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="password"
                                                    value={profile.password}
                                                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save size={18} />
                                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
