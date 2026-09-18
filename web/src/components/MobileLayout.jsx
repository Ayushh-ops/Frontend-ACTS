import React from 'react';

const MobileLayout = ({ children, title, headerClass, icon }) => {
    return (
        <div className="w-[320px] h-[680px] bg-[#f8f9fa] rounded-[36px] shadow-2xl border-[10px] border-[#263238] overflow-hidden flex flex-col relative mx-auto">
            <div className={`text-white p-[20px] pb-[16px] px-[16px] flex items-center justify-between text-[18px] font-medium ${headerClass}`}>
                <div className="flex items-center gap-4">
                    {icon}
                    <span>{title}</span>
                </div>
                {title === 'Triage Inbox' && <span className="material-icons">sort</span>}
                {title === 'Live ACTS Map' && <span className="material-icons">filter_list</span>}
            </div>
            <div className="flex-1 overflow-y-auto relative">
                {children}
            </div>
        </div>
    );
};

export default MobileLayout;
