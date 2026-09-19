import React, { useEffect, useState, useRef } from 'react';
import MobileLayout from './MobileLayout';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getComplaint } from '../api/complaints';
import { updateClusterStatus } from '../api/admin';
import { getStatusDisplay, getCitizenStatusDisplay, getStatusClasses } from '../utils/status';
import { useRole } from '../context/RoleContext';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useRole();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

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
            navigate(role === 'citizen' ? '/report' : '/admin');
        }
    };

    const handleCompleteIssue = async () => {
        try {
            const targetId = complaint.cluster_details?.id || complaint.id;
            await updateClusterStatus(targetId, 'RESOLVED');
            setComplaint(prev => ({ ...prev, status: 'RESOLVED' }));
            setShowConfirmModal(false);
            setToastMessage("✓ Issue marked as completed");
            setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
            setShowConfirmModal(false);
            setToastMessage("Failed to update status");
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const renderTimeline = (status) => {
        const citizenStatus = getCitizenStatusDisplay(status);
        const steps = ['Pending', 'Work in Progress', 'Completed'];
        const activeIdx = steps.indexOf(citizenStatus) >= 0 ? steps.indexOf(citizenStatus) : 0;

        const isCompleted = citizenStatus === 'Completed';

        return (
            <div className="flex flex-col mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[12px] font-bold text-[#546e7a] mb-2 uppercase tracking-wide">Status Timeline</div>
                {steps.map((step, idx) => {
                    const isPassed = idx < activeIdx;
                    const isActive = idx === activeIdx;
                    return (
                        <div key={step} className="flex items-center mb-2 last:mb-0">
                            <div className={`mr-3 ${isPassed || isActive ? 'text-acts-teal' : 'text-gray-300'}`}>
                                {isPassed || (isActive && isCompleted) ? <CheckCircle size={16} /> : isActive ? <Clock size={16} /> : <Circle size={16} />}
                            </div>
                            <span className={`text-[13px] ${isActive ? 'font-bold text-[#263238]' : 'text-[#78909c]'}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <MobileLayout
            title={role === 'citizen' ? 'Issue Details' : `Ticket #${id?.split('-')[0] || ''}`}
            headerClass={role === 'citizen' ? 'bg-acts-citizen' : 'bg-acts-admin'}
            icon={<span className="material-icons cursor-pointer" onClick={handleBack}>arrow_back</span>}
        >
            <div className="flex flex-col min-h-full bg-white relative">

                {toastMessage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg z-50 font-medium text-sm flex items-center gap-2 animate-in fade-in duration-200">
                        {toastMessage}
                    </div>
                )}

                {showConfirmModal && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl relative animate-in zoom-in duration-200">
                            <h3 className="font-bold text-lg text-[#263238] m-0 mb-2">Mark as Completed?</h3>
                            <p className="text-[#546e7a] text-sm m-0 mb-6">Are you sure this issue has been resolved?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-sm font-bold text-[#546e7a] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCompleteIssue}
                                    className="px-4 py-2 text-sm font-bold text-white bg-acts-admin hover:bg-opacity-90 rounded-lg transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="absolute inset-0 bg-white z-40 flex items-center justify-center text-acts-admin">Loading issue details...</div>}
                {error && <div className="absolute inset-0 bg-white z-40 flex items-center justify-center p-4 text-red-500 text-center">{error}</div>}

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
                                    <div className="text-[#546e7a] text-[12px] font-bold mt-1 flex flex-col gap-0.5">
                                        <div>Category: <span className="font-normal">{complaint.gemini_analysis?.category || 'General'}</span></div>
                                        <div>Department: <span className="font-normal">{complaint.department || 'GENERAL'}</span></div>
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
                                <div className="col-span-2">
                                    <strong>Location:</strong>
                                    <div className="mt-1 flex items-center text-gray-700">
                                        📍 {complaint.campus_zone}
                                    </div>
                                </div>
                                <div><strong>Crowd Reports:</strong> {complaint.cluster_details?.report_count || 1}</div>
                                {role === 'admin' && (
                                    <>
                                        <div><strong>Reported By:</strong> {complaint.user_identifier || 'anonymous_user'}</div>
                                        <div className="col-span-2"><strong>GPS:</strong> {parseFloat(complaint.latitude || 0).toFixed(4)}, {parseFloat(complaint.longitude || 0).toFixed(4)}</div>
                                    </>
                                )}
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
                                <span className={`px-3 py-1.5 rounded-md font-bold text-[13px] ${getStatusClasses(complaint.status, role === 'citizen')}`}>
                                    {role === 'citizen' ? getCitizenStatusDisplay(complaint.status) : getStatusDisplay(complaint.status)}
                                </span>
                            </div>

                            {role === 'citizen' && renderTimeline(complaint.status)}

                            {role === 'admin' && complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    className="mt-4 w-full bg-acts-admin text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition"
                                >
                                    Mark as Completed
                                </button>
                            )}

                        </div>
                    </>
                )}
            </div>
        </MobileLayout>
    );
};

export default IssueDetail;
