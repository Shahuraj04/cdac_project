import React, { useState, useEffect, useMemo } from 'react';
import {
    AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective,
    Inject, AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel,
    ChartComponent, SeriesCollectionDirective, SeriesDirective, BarSeries, Category, Legend, Tooltip, DataLabel
} from '@syncfusion/ej2-react-charts';
import api from '../../services/api';
import { Download } from 'lucide-react';

export default function AdminDashboard({ employees = [], hrs = [] }) {
    const [companyRows, setCompanyRows] = useState([]);
    const [filters, setFilters] = useState(() => {
        const today = new Date();
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const start = new Date();
        start.setDate(today.getDate() - 7);

        return {
            startDate: formatDate(start),
            endDate: formatDate(today),
            status: 'all'
        };
    });

    // Unified fetch logic with polling
    useEffect(() => {
        const fetchCompanyAttendance = async () => {
            try {
                const params = new URLSearchParams({
                    start_date: filters.startDate,
                    end_date: filters.endDate
                });
                if (filters.status !== 'all') {
                    params.append('status', filters.status);
                }
                const res = await api.get(`/api/timesheet/company?${params.toString()}`);
                setCompanyRows(res.data || []);
            } catch (err) {
                console.error('Error fetching company attendance:', err);
            }
        };

        fetchCompanyAttendance();
        const interval = setInterval(fetchCompanyAttendance, 60000);
        return () => clearInterval(interval);
    }, [filters.startDate, filters.endDate, filters.status]);

    // useMemo ensures chart data is recalculated only when companyRows change
    const dynamicAttendanceData = useMemo(() => {
        if (companyRows.length === 0) {
            return [{ x: 'No Data', y: 1, text: 'No Records' }];
        }

        const stats = companyRows.reduce((acc, row) => {
            const statusLabel = row.status === 'PRESENT' ? 'Present' : 'Other';
            acc[statusLabel] = (acc[statusLabel] || 0) + 1;
            return acc;
        }, { Present: 0, Other: 0 });

        return [
            { x: 'Present', y: stats.Present, text: `${stats.Present} Staff`, fill: '#4f46e5' },
            { x: 'Other', y: stats.Other, text: `${stats.Other} Staff`, fill: '#f59e0b' }
        ];
    }, [companyRows]);

    // Data for Department Chart
    const deptData = useMemo(() => {
        if (!employees || employees.length === 0) return [];
        const counts = employees.reduce((acc, emp) => {
            const dept = emp.department?.deptName || emp.department?.dept_name || 'Unassigned';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([dept, count]) => ({
            x: dept,
            y: count
        }));
    }, [employees]);

    const exportCompanyCsv = async () => {
        try {
            const res = await api.post('/api/timesheet/company/export', {
                startDate: filters.startDate,
                endDate: filters.endDate,
                status: filters.status !== 'all' ? filters.status : null
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `company_attendance_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting CSV:', err);
        }
    };

    // Live Presence Calculation
    const livePulse = useMemo(() => {
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const activeToday = companyRows.filter(row => {
            const isToday = row.attendanceDate === todayDate || row.attendance_date === todayDate;
            const isPresent = row.status === 'PRESENT';
            const noCheckout = !row.checkoutTime && !row.checkout_time;
            return isToday && isPresent && noCheckout;
        }).length;

        const totalExpected = employees.length || 0;
        const occupancy = totalExpected > 0 ? Math.round((activeToday / totalExpected) * 100) : 0;
        return { activeToday, occupancy };
    }, [companyRows, employees]);

    return (
        <div className="space-y-8">
            {/* Live Presence Pulse - Great for Interviews! */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Live Productivity Pulse</h2>
                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Real-time Workforce Presence Monitoring</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-12">
                            <div className="text-center">
                                <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Now</p>
                                <p className="text-4xl font-black tracking-tighter">{livePulse.activeToday}<span className="text-lg text-indigo-400 font-bold ml-1">Staff</span></p>
                            </div>
                            <div className="h-12 w-px bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Floor Occupancy</p>
                                <p className="text-4xl font-black tracking-tighter">{livePulse.occupancy}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Pie Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30">
                    <h3 className="font-black text-xl mb-6 text-slate-800 uppercase tracking-wider text-center">
                        Workforce Attendance
                    </h3>
                    <div className="h-[350px] w-full">
                        <AccumulationChartComponent
                            id="attendance-pie-chart"
                            legendSettings={{ visible: true, position: 'Bottom' }}
                            tooltip={{ enable: true }}
                            background="transparent"
                        >
                            <Inject services={[AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel]} />
                            <AccumulationSeriesCollectionDirective>
                                <AccumulationSeriesDirective
                                    dataSource={dynamicAttendanceData}
                                    xName='x'
                                    yName='y'
                                    innerRadius='60%'
                                    dataLabel={{
                                        visible: true,
                                        name: 'text',
                                        position: 'Outside',
                                        font: { fontWeight: '600' }
                                    }}
                                    palettes={['#4f46e5', '#f59e0b', '#ef4444']}
                                />
                            </AccumulationSeriesCollectionDirective>
                        </AccumulationChartComponent>
                    </div>
                </div>

                {/* Employees per Department Bar Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30">
                    <h3 className="font-black text-xl mb-6 text-slate-800 uppercase tracking-wider text-center">
                        Employees per Department
                    </h3>
                    <div className="h-[350px] w-full">
                        <ChartComponent
                            id="dept-bar-chart"
                            primaryXAxis={{ valueType: 'Category', majorGridLines: { width: 0 } }}
                            primaryYAxis={{ edgeLabelPlacement: 'Shift', labelFormat: '{value}', majorGridLines: { width: 1, dashArray: '5' } }}
                            chartArea={{ border: { width: 0 } }}
                            tooltip={{ enable: true }}
                            legendSettings={{ visible: false }}
                            background="transparent"
                        >
                            <Inject services={[BarSeries, Category, Legend, Tooltip, DataLabel]} />
                            <SeriesCollectionDirective>
                                <SeriesDirective
                                    dataSource={deptData}
                                    xName='x'
                                    yName='y'
                                    type='Bar'
                                    columnSpacing={0.1}
                                    cornerRadius={{ topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 }}
                                    fill="#f26522"
                                    dataLabel={{
                                        visible: true,
                                        position: 'Top',
                                        font: { fontWeight: '600', color: '#ffffff' }
                                    }}
                                />
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 flex items-center justify-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        Department-wise distribution of active workforce
                    </p>
                </div>
            </div>


            {/* Attendance Table */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-xl text-slate-800 uppercase tracking-wider">Company Attendance</h3>
                    <div className="flex items-center space-x-3">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                        />
                        <select
                            value={filters.status}
                            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                        </select>
                        <button onClick={exportCompanyCsv} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl font-bold">
                            <Download size={16} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                <th className="pb-4 px-4">Emp ID</th>
                                <th className="pb-4 px-4">Name</th>
                                <th className="pb-4 px-4">HR</th>
                                <th className="pb-4 px-4">Date</th>
                                <th className="pb-4 px-4">Hours</th>
                                <th className="pb-4 px-4">Status</th>
                                <th className="pb-4 px-4">Check In/Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {companyRows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-slate-300 font-bold uppercase tracking-widest italic">
                                        No attendance records in selected range
                                    </td>
                                </tr>
                            ) : (
                                companyRows.map((row, idx) => (
                                    <tr key={`${row.empId}-${row.date}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4 text-xs font-mono text-slate-500">{row.empId}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">{row.empName}</td>
                                        <td className="py-3 px-4 text-xs text-slate-500">{row.hrName || row.hrId || '-'}</td>
                                        <td className="py-3 px-4 text-xs font-mono text-slate-600">{row.date}</td>
                                        <td className="py-3 px-4 text-xs font-mono text-slate-800">
                                            {row.workingHours != null ? Number(row.workingHours).toFixed(2) : '0.00'}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-mono text-slate-700">{row.status}</td>
                                        <td className="py-3 px-4 text-xs font-mono text-slate-700">
                                            {row.checkinTime || '--'} - {row.checkoutTime || 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}