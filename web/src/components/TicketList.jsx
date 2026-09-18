import React from 'react';
import MobileLayout from './MobileLayout';
import { useNavigate } from 'react-router-dom';

const tickets = [
    { id: 1, severity: 10, title: 'Burst Water Main', loc: 'Academic Block A', status: 'Needs Action' },
    { id: 4092, severity: 9, title: 'Deep Road Pothole', loc: 'Campus Gate 2', status: 'Needs Action' },
    { id: 3, severity: 7, title: 'Exposed Electrical Wire', loc: 'Hostel 3 Corridor', status: 'Crew Dispatched' },
    { id: 4, severity: 5, title: 'Overflowing Garbage', loc: 'Cafeteria Rear', status: 'Needs Action' },
];

const TicketList = () => {
    const navigate = useNavigate();

    // API Stub:
    // GET /api/tickets
    // Returns: [{ id, severity, title, location, status }]

    const getSeverityClass = (score) => {
        if (score >= 9) return 'bg-acts-critical text-white';
        if (score >= 7) return 'bg-acts-high text-white';
        return 'bg-acts-medium text-[#333]';
    };

    const getStatusClass = (status) => {
        if (status === 'Needs Action') return 'bg-[#ffebee] text-[#c62828]';
        if (status === 'Crew Dispatched') return 'bg-[#e3f2fd] text-[#1565c0]';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <MobileLayout title="Triage Inbox" headerClass="bg-acts-admin">
            <div className="p-4">
                {tickets.map(ticket => (
                    <div
                        key={ticket.id}
                        onClick={() => navigate(`/issue/${ticket.id}`)}
                        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-[#cfd8dc] flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[18px] mr-[14px] shrink-0 ${getSeverityClass(ticket.severity)}`}>
                            {ticket.severity}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-[15px] m-0 mb-1 text-[#263238]">{ticket.title}</h4>
                            <p className="text-[#546e7a] text-[12px] m-0 mb-1 flex items-center">
                                <span className="material-icons text-[14px] mr-1">location_on</span> {ticket.loc}
                            </p>
                            <span className={`text-[11px] m-0 font-bold px-[6px] py-[2px] rounded inline-block ${getStatusClass(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>

                        <span className="material-icons text-[#b0bec5]">chevron_right</span>
                    </div>
                ))}
            </div>
        </MobileLayout>
    );
};

export default TicketList;
