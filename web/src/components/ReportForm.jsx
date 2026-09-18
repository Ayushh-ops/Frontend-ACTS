import React, { useState } from 'react';
import MobileLayout from './MobileLayout';

const ReportForm = () => {
    const [description, setDescription] = useState('');

    // API Stub: 
    // POST /api/issues
    // Payload: { image: File, description: string, lat: number, lng: number }

    return (
        <MobileLayout title="Report Civic Issue" headerClass="bg-acts-citizen">
            <div className="p-4">
                <div className="h-[160px] bg-[#e0e0e0] border-2 border-dashed border-[#9e9e9e] rounded-xl flex flex-col items-center justify-center text-[#616161] mb-4 cursor-pointer hover:bg-gray-200 transition-colors">
                    <span className="material-icons text-[40px] mb-2">add_a_photo</span>
                    <span>Capture Defect Photo</span>
                </div>

                <textarea
                    className="w-full p-3 border border-[#cfd8dc] rounded-lg font-inherit text-[14px] resize-none box-border mb-4 outline-none focus:border-acts-citizen"
                    rows="4"
                    placeholder="Describe the issue... (e.g., Deep pothole causing traffic hazard)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="bg-[#e3f2fd] p-3 rounded-lg flex items-center text-[#1565c0] mb-6 text-[13px] font-medium">
                    <span className="material-icons mr-2">my_location</span>
                    <span>28.6291° N, 77.4468° E (Auto-captured)</span>
                </div>

                <button className="bg-acts-citizen text-white border-none py-[14px] rounded-[10px] w-full text-[15px] font-bold cursor-pointer hover:opacity-90 transition-opacity">
                    Submit to AI Pipeline
                </button>
            </div>
        </MobileLayout>
    );
};

export default ReportForm;
