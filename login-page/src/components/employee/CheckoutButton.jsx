import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import attendanceService from '../../services/attendanceService';

export default function CheckoutButton({ empId, onStatusChange }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!empId) return;

        const fetchStatus = async () => {
            try {
                const data = await attendanceService.getTodayStatus(empId);
                setStatus(data);
                if (onStatusChange) onStatusChange(data);
            } catch (err) {
                console.error('Error fetching today status:', err);
            }
        };

        fetchStatus();
    }, [empId, onStatusChange]);

    const handleCheckIn = async () => {
        setLoading(true);
        setError('');
        try {
            const now = new Date();
            // Using local date instead of UTC to avoid date-shifts in early morning
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const localDate = `${year}-${month}-${day}`;

            const payload = {
                empId,
                attendanceDate: localDate,
                attendanceTime: now.toLocaleTimeString('en-GB', { hour12: false }),
                status: 'PRESENT'
            };
            await attendanceService.markAttendance(payload);
            const updated = await attendanceService.getTodayStatus(empId);
            setStatus(updated);
            if (onStatusChange) onStatusChange(updated);
        } catch (err) {
            console.error('Error marking attendance:', err);
            setError(err.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await attendanceService.checkout(empId);
            const updated = await attendanceService.getTodayStatus(empId);
            setStatus(updated);
            if (onStatusChange) onStatusChange(updated);
            alert(`Checked out successfully! Total hours: ${response.totalHours ?? ''}`);
        } catch (err) {
            console.error('Error during checkout:', err);
            setError(err.message || 'Failed to checkout');
        } finally {
            setLoading(false);
        }
    };

    const isCheckedIn = !!status && !!status.checkinTime;
    const isCheckedOut = !!status && !!status.checkoutTime;

    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        let timer;
        if (isCheckedIn && !isCheckedOut && status.checkinTime) {
            const calculateElapsed = () => {
                const [h, m, s] = status.checkinTime.split(':').map(Number);
                const checkinDate = new Date();
                checkinDate.setHours(h, m, s, 0);

                const now = new Date();
                const diffMs = Math.max(0, now - checkinDate);

                const hh = Math.floor(diffMs / 3600000);
                const mm = Math.floor((diffMs % 3600000) / 60000);
                const ss = Math.floor((diffMs % 60000) / 1000);

                const pad = (num) => num.toString().padStart(2, '0');
                setElapsedTime(`${pad(hh)}:${pad(mm)}:${pad(ss)}`);
            };

            calculateElapsed();
            timer = setInterval(calculateElapsed, 1000);
        } else {
            setElapsedTime('00:00:00');
        }
        return () => clearInterval(timer);
    }, [isCheckedIn, isCheckedOut, status?.checkinTime]);

    const renderButtonLabel = () => {
        if (loading) return 'Processing...';
        if (!isCheckedIn) return 'Check-In Today';
        if (!isCheckedOut) return 'Check-Out Now';
        return 'Checked Out';
    };

    const handleClick = () => {
        if (!isCheckedIn) {
            handleCheckIn();
        } else if (!isCheckedOut) {
            handleCheckout();
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={handleClick}
                disabled={loading || isCheckedOut}
                className={`w-full p-6 rounded-[2rem] font-black flex items-center justify-between transition-all active:scale-95 group shadow-xl ${isCheckedIn && !isCheckedOut
                    ? 'bg-slate-900 text-white hover:bg-red-600'
                    : isCheckedOut
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                    } disabled:opacity-50`}
            >
                <div className="flex items-center space-x-3">
                    <MapPin size={20} className={isCheckedIn && !isCheckedOut ? 'animate-pulse text-red-500' : ''} />
                    <div className="text-left">
                        <span className="block">{renderButtonLabel()}</span>
                        {isCheckedIn && !isCheckedOut && (
                            <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">
                                Active Shift
                            </span>
                        )}
                    </div>
                </div>
                {isCheckedIn && !isCheckedOut ? (
                    <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl font-mono text-lg">
                        <Clock size={16} />
                        <span>{elapsedTime}</span>
                    </div>
                ) : (
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                )}
            </button>

            {status && (
                <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Log</p>
                            <p className="text-xs font-bold text-slate-800 tabular-nums">
                                {status.checkinTime || '--:--'} <span className="text-slate-300 mx-2">→</span> {status.checkoutTime || '--:--'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Hours</p>
                            <p className="text-xs font-black text-indigo-600">
                                {status.workingHours != null ? `${Number(status.workingHours).toFixed(2)} Hrs` : 'Calculating...'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isCheckedIn && !isCheckedOut ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {isCheckedIn && !isCheckedOut ? 'Live Session Active' : isCheckedOut ? 'Session Concluded' : 'Awaiting Check-in'}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
                    {error}
                </div>
            )}
        </div>
    );
}

