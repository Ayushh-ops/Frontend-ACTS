import React from 'react';
import MobileLayout from './MobileLayout';
import { useParams, useNavigate } from 'react-router-dom';

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // API Stub:
    // GET /api/issues/:id
    // PUT /api/issues/:id/status
    // Returns: { id, title, category, severity, status, gemini_insight, location, yolo_image_url }

    return (
        <MobileLayout
            title={`Ticket #${id || '4092'}`}
            headerClass="bg-acts-admin"
            icon={<span className="material-icons cursor-pointer" onClick={() => navigate(-1)}>arrow_back</span>}
        >
            <div className="flex flex-col h-full bg-white">
                {/* YOLO Box overlay on image */}
                <div
                    className="relative w-full h-[200px] bg-center bg-cover"
                    style={{ backgroundImage: `url('https://www.publicdomainpictures.net/pictures/30000/velka/pothole-in-road.jpg')` }}
                >
                    <div className="absolute top-[40%] left-[30%] w-[120px] h-[60px] border-2 border-[#00e676] bg-[rgba(0,230,118,0.15)]">
                        <div className="absolute -top-[20px] -left-[2px] bg-[#00e676] text-black text-[11px] font-bold px-[6px] py-[2px]">
                            pothole 0.92
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white flex-1 border-t border-[#cfd8dc]">
                    <div className="flex items-center mb-4">
                        <div className="w-[50px] h-[50px] rounded-full bg-acts-critical text-white text-[22px] font-bold flex items-center justify-center mr-4 shrink-0">
                            9
                        </div>
                        <div>
                            <h2 className="m-0 text-[18px] text-[#263238]">Deep Road Pothole</h2>
                            <div className="text-[#546e7a] text-[13px]">Category: Civil / Roads</div>
                        </div>
                    </div>

                    {/* Gemini AI Reasoning */}
                    <div className="bg-[#f3e5f5] border-l-4 border-[#9c27b0] p-3 rounded-r-lg mb-5 text-[13px] text-[#4a148c]">
                        <strong>Gemini Triage Insight:</strong><br />
                        Detected a severe hazard on main thoroughfare. Proximity to high-traffic gate increases accident risk. Immediate crew dispatch recommended.
                    </div>

                    <div className="mb-6 text-[14px] text-[#37474f] flex items-center">
                        <span className="material-icons text-[16px] mr-1">location_on</span> Campus Gate 2, Main Drive
                    </div>

                    {/* Status Toggle */}
                    <div className="bg-white border border-[#cfd8dc] rounded-lg p-3 flex justify-between items-center shadow-sm">
                        <span className="font-medium text-[14px]">Current Status:</span>
                        <select className="p-2 rounded-md border border-[#b0bec5] font-bold text-[#37474f] bg-[#eceff1] outline-none">
                            <option>Needs Action</option>
                            <option>Crew Dispatched</option>
                            <option>Work in Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
};

export default IssueDetail;
