import React, { useEffect, useState, useRef } from 'react';
import MobileLayout from './MobileLayout';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getComplaint } from '../api/complaints';
import { getStatusDisplay, getStatusClasses } from '../utils/status';

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Image sizing logic for YOLO bounds
    const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const data = await getComplaint(id);
                setComplaint(data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load issue details');
            } finally {
                setLoading(false);
            }
        };
        fetchIssue();
    }, [id]);

    const handleImageLoad = (e) => {
        setImgDims({
            w: e.target.naturalWidth,
            h: e.target.naturalHeight
        });
    };

    const handleBack = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate('/admin');
        }
    };

    return (
        <MobileLayout
            title={`Ticket #${id?.split('-')[0] || ''}`}
            headerClass="bg-acts-admin"
            icon={<span className="material-icons cursor-pointer" onClick={handleBack}>arrow_back</span>}
        >
            <div className="flex flex-col min-h-full bg-white relative">
                {loading && <div className="absolute inset-0 bg-white z-50 flex items-center justify-center text-acts-admin">Loading issue details...</div>}
                {error && <div className="absolute inset-0 bg-white z-50 flex items-center justify-center p-4 text-red-500 text-center">{error}</div>}

                {!loading && !error && complaint && (
                    <>
                        {/* Image Preview with YOLO Boxes */}
                        <div className="relative w-full h-[200px] bg-[#e0e0e0] flex items-center justify-center overflow-hidden shrink-0 border-b-2 border-[#cfd8dc]">
                            {complaint.image || complaint.compressed_image ? (
                                <>
                                    <img
                                        src={complaint.image || complaint.compressed_image}
                                        alt="Defect"
                                        className="w-full h-full object-cover"
                                        onLoad={handleImageLoad}
                                    />
                                    {imgDims.w > 0 && complaint.yolo_detections?.status === 'success' && complaint.yolo_detections?.detections?.map((det, idx) => {
                                        const [x1, y1, x2, y2] = det.bbox;
                                        const top = (y1 / imgDims.h) * 100;
                                        const left = (x1 / imgDims.w) * 100;
                                        const w = ((x2 - x1) / imgDims.w) * 100;
                                        const h = ((y2 - y1) / imgDims.h) * 100;
                                        return (
                                            <div
                                                key={idx}
                                                className="absolute border-2 border-[#00e676] bg-[rgba(0,230,118,0.15)]"
                                                style={{ top: `${top}%`, left: `${left}%`, width: `${w}%`, height: `${h}%` }}
                                            >
                                                <div className="absolute -top-[20px] -left-[2px] bg-[#00e676] text-black text-[11px] font-bold px-[6px] py-[2px] whitespace-nowrap">
                                                    {det.label} {det.confidence ? det.confidence.toFixed(2) : ''}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div className="text-gray-500">No Image Provided</div>
                            )}
                        </div>

                        <div className="p-4 bg-white flex-1 flex flex-col">
                            <div className="flex items-center mb-4">
                                <div className="w-[50px] h-[50px] rounded-full bg-acts-critical text-white text-[22px] font-bold flex items-center justify-center mr-4 shrink-0 transition-all">
                                    {Math.round(complaint.initial_severity || 0)}
                                </div>
                                <div>
                                    <h2 className="m-0 text-[18px] text-[#263238] uppercase font-black">{complaint.gemini_analysis?.title || 'Reported Issue'}</h2>
                                    <div className="text-[#546e7a] text-[13px] font-bold mt-1">
                                        C: {complaint.gemini_analysis?.category || 'General'} | D: {complaint.department || 'GENERAL'}
                                    </div>
                                </div>
                            </div>

                            {/* Gemini AI Reasoning */}
                            {complaint.gemini_analysis && (
                                <div className="bg-[#f3e5f5] border-l-4 border-[#9c27b0] p-3 rounded-r-lg mb-5 text-[13px] text-[#4a148c] shadow-sm">
                                    <div className="mb-2 uppercase text-[11px] tracking-wider font-extrabold flex items-center justify-between">
                                        <span><span className="material-icons text-[14px] align-text-bottom mr-1">auto_awesome</span> Gemini Triage Insight</span>
                                        <span className="bg-[#9c27b0] text-white px-2 py-1 rounded">{complaint.gemini_analysis?.urgency || 'N/A'}</span>
                                    </div>
                                    <strong>Summary:</strong> {complaint.gemini_analysis?.summary || 'No summary available.'}<br />
                                    <div className="mt-2 text-[#6a1b9a] border-t border-[#ce93d8] pt-2">
                                        <strong>Recommended Action:</strong> {complaint.gemini_analysis?.recommended_action || 'Pending admin review.'}
                                    </div>
                                </div>
                            )}

                            {/* Basic Description Fallback */}
                            {!complaint.gemini_analysis && complaint.raw_text && (
                                <div className="mb-4 text-gray-700 bg-gray-100 p-3 rounded text-[13px] italic border-l-4 border-gray-300">
                                    "{complaint.raw_text}"
                                </div>
                            )}

                            {/* Meta Data */}
                            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2 rounded text-[12px] border border-slate-200">
                                <div><strong>Zone:</strong> {complaint.campus_zone}</div>
                                <div><strong>Crowd Reports:</strong> {complaint.cluster_details?.report_count || 1}</div>
                                <div><strong>Address:</strong> {complaint.address || 'N/A'}</div>
                                <div><strong>GPS:</strong> {parseFloat(complaint.latitude || 0).toFixed(4)}, {parseFloat(complaint.longitude || 0).toFixed(4)}</div>
                            </div>

                            {/* Crew & Admin Notes (if available) */}
                            {complaint.crew_details && (
                                <div className="mb-4 text-[#1565c0] bg-blue-50 p-2 rounded text-[13px] border border-blue-200 flex items-center font-medium">
                                    <span className="material-icons mr-2">engineering</span> Assigned to: {complaint.crew_details.name}
                                </div>
                            )}

                            {complaint.admin_notes && (
                                <div className="mb-4 text-orange-900 bg-orange-50 p-2 rounded text-[13px] border border-orange-200 font-medium">
                                    <strong>Admin Notes:</strong> {complaint.admin_notes}
                                </div>
                            )}

                            {/* Status Section (Read Only) */}
                            <div className="bg-white border border-[#cfd8dc] rounded-lg p-3 flex justify-between items-center shadow-sm mt-auto">
                                <span className="font-medium text-[14px]">Current Status:</span>
                                <span className={`px-3 py-1.5 rounded-md font-bold text-[13px] ${getStatusClasses(complaint.status)}`}>
                                    {getStatusDisplay(complaint.status)}
                                </span>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </MobileLayout>
    );
};

export default IssueDetail;
