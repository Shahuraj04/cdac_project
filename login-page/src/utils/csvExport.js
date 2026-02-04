export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

export const formatTime = (time) => {
    if (!time) return 'N/A';
    const date = new Date(`2000-01-01T${time}`);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const exportTimesheetToCSV = (timesheetData) => {
    if (!Array.isArray(timesheetData) || timesheetData.length === 0) return;

    const headers = [
        'Employee ID',
        'Employee Name',
        'Reporting HR',
        'Date',
        'Check-in Time',
        'Checkout Time',
        'Working Hours',
        'Status'
    ];

    const csvRows = [
        headers.join(','),
        ...timesheetData.map(row => [
            row.empId,
            row.empName,
            row.hrName || row.hrId || '',
            formatDate(row.date),
            formatTime(row.checkinTime),
            formatTime(row.checkoutTime),
            row.workingHours != null ? Number(row.workingHours).toFixed(2) : '0.00',
            row.status
        ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `timesheet_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

