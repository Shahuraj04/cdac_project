import React, { useEffect, useState } from 'react';
import {
  Users, Calendar, Bell,
  TrendingUp, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component Imports
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';
import EmployeeDashboard from './EmployeeDashboard';

// Service Imports
import employeeService from '../../services/employeeService';
import authService from '../../services/authService';
import leaveService from '../../services/leaveservice';
import attendanceService from '../../services/attendanceService';
import dashboardService from '../../services/dashboardService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const [detailedLeaves, setDetailedLeaves] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    } else {
      setUserData(user);
      refreshDashboard();
    }
  }, [navigate]);

  const refreshDashboard = (user = userData) => {
    const role = user?.role || JSON.parse(localStorage.getItem('user'))?.role;

    if (role === 'ROLE_ADMIN' || role === 'ROLE_HR') {
      fetchEmployeeCount();
      fetchLeaveData();
      fetchRecentActivity();
    }

    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const fetchLeaveData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const approved = await leaveService.getLeavesByStatus('APPROVED');
      const pending = await leaveService.getLeavesByStatus('PENDING');
      setApprovedLeaves(approved);
      setLeaveRequests(pending);

      if (user && (user.role === 'ROLE_HR' || user.role === 'ROLE_ADMIN')) {
        const detailed = await leaveService.getDetailedLeaves();
        setDetailedLeaves(detailed.filter(l => l.status === 'PENDING'));
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && (user.role === 'ROLE_HR' || user.role === 'ROLE_ADMIN')) {
        const activity = await attendanceService.getRecentAttendance();
        setRecentActivity(activity);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      const count = await employeeService.getEmployeeCount();
      setEmployeeCount(count);
    } catch (error) {
      console.error('Failed to fetch employee count:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!userData) return null;

  return (
    <div className="flex h-full w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">

      <Sidebar onLogout={handleLogout} userData={userData} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
          </div>

          <div className="flex items-center space-x-6">
            
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{userData.email.split('@')[0]}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{userData.role.replace('ROLE_', '')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold border-2 border-white">
                {userData.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-7xl mx-auto">

            {/* Welcome Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, <span className="text-indigo-600">{userData.email.split('@')[0]}</span>
                </h2>
                <p className="text-slate-500 mt-1 font-medium">Here's what's happening in your organization today.</p>
              </div>
              <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Clock size={20} />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Time</p>
                  <p className="text-sm font-bold text-slate-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {userData.role !== 'ROLE_EMPLOYEE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Employees" value={employeeCount.toLocaleString()} icon={<Users className="text-blue-600" />}  />
                <StatCard label="Active Leave" value={approvedLeaves.toLocaleString()} icon={<Calendar className="text-amber-600" />} />
                <StatCard label="Pending Leaves" value={leaveRequests.toLocaleString()} icon={<TrendingUp className="text-emerald-600" />} />
              </div>
            )}

            {/* Role-Based Dashboard Content */}
            {userData.role === 'ROLE_ADMIN' && (
              <AdminDashboard employees={dashboardData?.employees || []} hrs={dashboardData?.hrs || []} />
            )}

            {userData.role === 'ROLE_HR' && (
              <HRDashboard
                team={dashboardData?.employees || []}
                activity={recentActivity}
                leaves={detailedLeaves}
                onRefresh={refreshDashboard}
                userData={userData}
              />
            )}

            {userData.role === 'ROLE_EMPLOYEE' && (
              <EmployeeDashboard profile={dashboardData?.profile} />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
