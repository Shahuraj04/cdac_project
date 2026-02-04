import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';
import departmentService from '../../services/departmentService';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Plus, Edit, Trash2, Eye, X, CheckCircle } from 'lucide-react';

export default function DepartmentsPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [formData, setFormData] = useState({ dept_name: '', dept_code: '', dept_description: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            setUserData(user);
            fetchDepartments();
        }
    }, [navigate]);

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAll();
            setDepartments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to load departments' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await departmentService.create(formData);
            setMessage({ type: 'success', text: 'Department created successfully!' });
            setShowAddModal(false);
            setFormData({ dept_name: '', dept_code: '', dept_description: '' });
            fetchDepartments();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to create department' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!selectedDept?.deptId) return;
        try {
            await departmentService.update(selectedDept.deptId, formData);
            setMessage({ type: 'success', text: 'Department updated successfully!' });
            setShowEditModal(false);
            setSelectedDept(null);
            fetchDepartments();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update department' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDelete = async (dept) => {
        if (!confirm(`Delete department "${dept.dept_name}"? This may fail if employees are assigned.`)) return;
        try {
            await departmentService.delete(dept.deptId);
            setMessage({ type: 'success', text: 'Department deleted successfully!' });
            fetchDepartments();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Cannot delete department (may have employees)' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const openEdit = (dept) => {
        setSelectedDept(dept);
        setFormData({
            dept_name: dept.dept_name || '',
            dept_code: dept.dept_code || '',
            dept_description: dept.dept_description || ''
        });
        setShowEditModal(true);
    };

    if (!userData) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {message.text && (
                <div className={`fixed top-5 right-5 z-[110] p-5 rounded-2xl shadow-2xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'}`}>
                    <CheckCircle size={24} />
                    <span className="font-bold text-sm uppercase">{message.text}</span>
                </div>
            )}

            <Sidebar onLogout={handleLogout} userData={userData} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Departments</h1>
                            <p className="text-sm text-slate-500">Manage organization departments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setFormData({ dept_name: '', dept_code: '', dept_description: '' }); setShowAddModal(true); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Department
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading departments...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept) => (
                                <div key={dept.deptId} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
                                        <h3 className="text-xl font-bold text-white">{dept.dept_name}</h3>
                                        <p className="text-indigo-100 text-sm mt-1">{dept.dept_code}</p>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-600 text-sm mb-4">{dept.dept_description || 'No description'}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(dept)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(dept)} className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Add Department</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                <input type="text" required value={formData.dept_name} onChange={e => setFormData({ ...formData, dept_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Department name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Code</label>
                                <input type="text" required value={formData.dept_code} onChange={e => setFormData({ ...formData, dept_code: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. ENG" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <textarea value={formData.dept_description} onChange={e => setFormData({ ...formData, dept_description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Brief description" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Create</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedDept && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Edit Department</h3>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                <input type="text" required value={formData.dept_name} onChange={e => setFormData({ ...formData, dept_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Code</label>
                                <input type="text" required value={formData.dept_code} onChange={e => setFormData({ ...formData, dept_code: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <textarea value={formData.dept_description} onChange={e => setFormData({ ...formData, dept_description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Save</button>
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
