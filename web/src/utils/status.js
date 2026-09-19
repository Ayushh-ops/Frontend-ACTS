export const STATUS_UI_MAPPING = {
    SUBMITTED: 'Needs Action',
    QUEUED: 'Needs Action',
    ASSIGNED: 'Crew Dispatched',
    IN_PROGRESS: 'Work in Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Resolved',
    REOPENED: 'Needs Action',
    REJECTED: 'Rejected'
};

export const getStatusDisplay = (status) => {
    return STATUS_UI_MAPPING[status] || status || 'Needs Action';
};

export const getStatusClasses = (status) => {
    const display = getStatusDisplay(status);
    switch (display) {
        case 'Needs Action':
            return 'bg-[#ffebee] text-[#c62828]';
        case 'Crew Dispatched':
        case 'Work in Progress':
            return 'bg-[#e3f2fd] text-[#1565c0]';
        case 'Resolved':
            return 'bg-green-100 text-green-800';
        case 'Rejected':
            return 'bg-gray-200 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
