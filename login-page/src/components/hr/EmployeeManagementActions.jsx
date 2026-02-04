import { useState, useEffect } from 'react';
import { Eye, Edit, UserX, UserCheck, BarChart3, AlertCircle, X } from 'lucide-react';
import employeeService from '../../services/employeeService';

const EmployeeManagementActions = ({ employee, onAction }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [details, setDetails] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [editData, setEditData] = useState({ emp_name: '', email: '', phone: '', designation: '', joinDate: '', deptId: '', hrId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const name = employee?.emp_name ?? employee?.empName ?? '';
  const empId = employee?.empId ?? employee?.emp_id;

  useEffect(() => {
    if (showDetails && empId && !details) {
      employeeService.getEmployeeById(empId).then(setDetails).catch(() => setDetails(null));
    }
  }, [showDetails, empId, details]);

  useEffect(() => {
    if (showPerformance && empId) {
      employeeService.getPerformance(empId, 6).then(data => setPerformance(Array.isArray(data) ? data : []));
    }
  }, [showPerformance, empId]);

  useEffect(() => {
    if (showEdit && employee) {
      const deptId = employee.department?.deptId ?? employee.department?.dept_id ?? employee.deptId;
      const hrId = employee.hr?.hrId ?? employee.hr?.hr_id ?? employee.hrId;
      setEditData({
        emp_name: employee.emp_name ?? employee.empName ?? '',
        email: employee.user?.email ?? employee.email ?? '',
        phone: employee.phone ?? '',
        designation: employee.designation ?? '',
        joinDate: employee.joinDate ?? employee.join_date ?? '',
        deptId: deptId ?? '',
        hrId: hrId ?? ''
      });
    }
  }, [showEdit, employee]);

  const handleDeactivate = async () => {
    const reason = window.prompt('Please provide a reason for deactivation (optional):');
    const confirmed = window.confirm(`Are you sure you want to deactivate ${name}?`);
    if (!confirmed) return;
    setLoading(true);
    setError('');
    try {
      await employeeService.deleteEmployee(empId);
      alert('Employee deactivated successfully');
      setShowDetails(false);
      onAction?.();
    } catch (err) {
      setError(err.message || 'Failed to deactivate employee');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    const confirmed = window.confirm(`Reactivate ${name}?`);
    if (!confirmed) return;
    setLoading(true);
    setError('');
    try {
      await employeeService.reactivateEmployee(empId);
      alert('Employee reactivated successfully');
      onAction?.();
    } catch (err) {
      setError(err.message || 'Failed to reactivate employee');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...editData,
        deptId: Number(editData.deptId) || details?.department?.deptId || employee?.department?.deptId,
        hrId: Number(editData.hrId) || details?.hr?.hrId || employee?.hr?.hrId
      };
      await employeeService.updateEmployee(empId, payload);
      alert('Employee updated successfully');
      setShowEdit(false);
      onAction?.();
    } catch (err) {
      setError(err.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const isActive = employee?.isDeleted === false && employee?.status !== 'Terminated';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => { setShowDetails(true); setDetails(null); }}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => { setShowEdit(true); setDetails(employee); }}
        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
        title="Edit Employee"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => setShowPerformance(true)}
        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
        title="View Performance"
      >
        <BarChart3 className="w-4 h-4" />
      </button>
      {isActive !== false ? (
        <button
          onClick={handleDeactivate}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
          title="Deactivate"
        >
          <UserX className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={handleReactivate}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
          title="Reactivate"
        >
          <UserCheck className="w-4 h-4" />
        </button>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-[120] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Employee Details</h3>
            {details ? (
              <div className="space-y-3 text-sm">
                <p><strong className="text-slate-500">Name:</strong> {details.emp_name}</p>
                <p><strong className="text-slate-500">Email:</strong> {details.user?.email ?? details.email}</p>
                <p><strong className="text-slate-500">Phone:</strong> {details.phone}</p>
                <p><strong className="text-slate-500">Designation:</strong> {details.designation}</p>
                <p><strong className="text-slate-500">Department:</strong> {details.department?.dept_name ?? details.department?.deptName ?? 'N/A'}</p>
                <p><strong className="text-slate-500">Join Date:</strong> {details.joinDate}</p>
              </div>
            ) : (
              <div className="text-slate-500">Loading...</div>
            )}
            <button onClick={() => setShowDetails(false)} className="mt-6 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Close</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowEdit(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Edit Employee</h3>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                <input type="text" required value={editData.emp_name} onChange={e => setEditData({ ...editData, emp_name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input type="email" required value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                <input type="text" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                <input type="text" value={editData.designation} onChange={e => setEditData({ ...editData, designation: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Join Date</label>
                <input type="date" value={editData.joinDate} onChange={e => setEditData({ ...editData, joinDate: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowEdit(false)} className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Performance Modal */}
      {showPerformance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPerformance(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Performance Metrics (last 6 months)</h3>
            {performance.length > 0 ? (
              <div className="space-y-3">
                {performance.map((m, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">{m.month ?? m.monthYear}</p>
                    <p className="text-sm text-slate-600">Days present: {m.totalDays ?? 0} · On-time: {m.onTimeDays ?? 0} · Late: {m.lateDays ?? 0} · WFH: {m.wfhDays ?? 0}</p>
                    <p className="text-sm text-slate-600">Avg hours: {m.avgHours != null ? Number(m.avgHours).toFixed(1) : '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No performance data for this period.</p>
            )}
            <button onClick={() => setShowPerformance(false)} className="mt-6 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementActions;
