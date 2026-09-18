import React, { useState } from 'react';
import MobileLayout from './MobileLayout';

const mapIssues = [
    { id: 1, lat: 25, lng: 30, severity: 10, title: 'Burst Pipe', loc: 'Academic Block A', distance: '120m away', type: 'critical' },
    { id: 2, lat: 60, lng: 70, severity: 7, title: 'Exposed Wire', loc: 'Hostel 3 Corridor', distance: '340m away', type: 'high' }
];

const MapView = () => {
    const [selectedIssue, setSelectedIssue] = useState(mapIssues[0]);

    // API Stub:
    // GET /api/map/issues
    // Returns: [{ id, lat, lng, severity, title, location, distance }]

    return (
        <MobileLayout title="Live ACTS Map" headerClass="bg-acts-teal">
            <div className="map-bg-pattern h-full relative w-full overflow-hidden">

                {/* User/Admin Blue Dot */}
                <div className="absolute top-[40%] left-[50%] w-4 h-4 bg-[#2196f3] rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(33,150,243,0.5)]"></div>

                {/* Map Pins */}
                {mapIssues.map((issue) => (
                    <div
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                        style={{ top: `${issue.lat}%`, left: `${issue.lng}%` }}
                    >
                        <div className={`w-7 h-7 rounded-full text-white font-bold text-[13px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-2 border-white ${issue.severity >= 9 ? 'bg-acts-critical' : 'bg-acts-high'}`}>
                            {issue.severity}
                        </div>
                        <div
                            className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[2px]"
                            style={{ borderTopColor: issue.severity >= 9 ? '#d32f2f' : '#f57c00' }}
                        ></div>
                    </div>
                ))}

                {/* Tap Card Preview */}
                {selectedIssue && (
                    <div className="absolute bottom-[16px] left-[16px] right-[16px] bg-white rounded-xl p-4 shadow-[0_8px_16px_rgba(0,0,0,0.2)] flex items-center cursor-pointer">
                        <div className="relative mr-4 -top-1 flex flex-col items-center shrink-0">
                            <div className={`w-7 h-7 rounded-full text-white font-bold text-[13px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-2 border-white ${selectedIssue.severity >= 9 ? 'bg-acts-critical' : 'bg-acts-high'}`}>
                                {selectedIssue.severity}
                            </div>
                            <div
                                className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[2px]"
                                style={{ borderTopColor: selectedIssue.severity >= 9 ? '#d32f2f' : '#f57c00' }}
                            ></div>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[15px] text-[#263238]">
                                {selectedIssue.severity >= 9 ? 'Critical: ' : ''}{selectedIssue.title}
                            </div>
                            <div className="text-[12px] text-[#78909c]">{selectedIssue.loc} • {selectedIssue.distance}</div>
                        </div>
                        <span className="material-icons text-acts-teal">chevron_right</span>
                    </div>
                )}
            </div>
        </MobileLayout>
    );
};

export default MapView;
