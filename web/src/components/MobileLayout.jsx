import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, List, Map as MapIcon } from 'lucide-react';

const MobileLayout = ({ children, title, headerClass, icon, showNav = false }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getNavColor = (path) => {
        return location.pathname === path ? 'text-acts-teal' : 'text-gray-400';
    };

    return (
        <div className="w-[320px] h-[680px] bg-[#f8f9fa] rounded-[36px] shadow-2xl border-[10px] border-[#263238] overflow-hidden flex flex-col relative mx-auto shrink-0">
            <div className={`text-white p-[20px] pb-[16px] px-[16px] flex items-center justify-between text-[18px] font-medium shrink-0 ${headerClass}`}>
                <div className="flex items-center gap-4">
                    {icon}
                    <span>{title}</span>
                </div>
                {title === 'Triage Inbox' && <span className="material-icons">sort</span>}
                {title === 'Live ACTS Map' && <span className="material-icons">filter_list</span>}
            </div>

            <div className="flex-1 overflow-y-auto relative flex flex-col">
                {children}
            </div>

            {showNav && (
                <div className="bg-white border-t border-[#cfd8dc] flex items-center justify-around py-3 shrink-0">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex flex-col items-center gap-1 ${getNavColor('/')} hover:text-acts-teal transition-colors`}
                    >
                        <Camera size={24} />
                        <span className="text-[10px] font-bold">Report</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin')}
                        className={`flex flex-col items-center gap-1 ${getNavColor('/admin')} hover:text-acts-teal transition-colors`}
                    >
                        <List size={24} />
                        <span className="text-[10px] font-bold">Tickets</span>
                    </button>
                    <button
                        onClick={() => navigate('/map')}
                        className={`flex flex-col items-center gap-1 ${getNavColor('/map')} hover:text-acts-teal transition-colors`}
                    >
                        <MapIcon size={24} />
                        <span className="text-[10px] font-bold">Map</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileLayout;
