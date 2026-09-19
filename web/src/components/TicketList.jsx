import React, { useEffect, useState } from 'react';
import MobileLayout from './MobileLayout';
import { getAdminClusters } from '../api/admin';
import { getComplaints } from '../api/complaints';
import { getStatusDisplay, getStatusClasses } from '../utils/status';
import { resolveComplaintForCluster } from '../utils/complaintResolver';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const data = await getAdminClusters();
                // Assume data is an array based on standard API view, or data.results if paginated
                setClusters(data.results || data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };
        fetchClusters();
    }, []);

    const getSeverityClass = (score) => {
        const parsed = parseFloat(score);
        if (parsed >= 9) return 'bg-acts-critical text-white';
        if (parsed >= 7) return 'bg-acts-high text-white';
        return 'bg-acts-medium text-[#333]';
    };

    const handleTicketClick = async (cluster) => {
        try {
            // Find a complaint that belongs to this cluster to view in Issue Detail.
            const data = await getComplaints();
            const allComplaints = Array.isArray(data) ? data : (data.results || []);

            const related = resolveComplaintForCluster(cluster.id, allComplaints);

            if (related && related.id) {
                navigate(`/issue/${related.id}`, { state: { from: location.pathname } });
            } else {
                alert("This cluster has no directly viewable complaint detail associated yet.");
            }
        } catch (e) {
            console.error(e);
            alert("Error finding associated complaint.");
        }
    };

    return (
        <MobileLayout title="Triage Inbox" headerClass="bg-acts-admin" showNav={true}>
            <div className="p-4" style={{ minHeight: '100%' }}>
                {loading && <div className="text-center text-gray-500 py-4">Loading tickets...</div>}
                {error && <div className="text-center text-red-500 py-4">{error}</div>}

                {!loading && !error && clusters.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No active tickets found.</div>
                )}

                {clusters.map(cluster => (
                    <div
                        key={cluster.id}
                        onClick={() => handleTicketClick(cluster)}
                        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-[#cfd8dc] flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[18px] mr-[14px] shrink-0 ${getSeverityClass(cluster.computed_priority || cluster.base_severity)}`}>
                            {Math.round(cluster.computed_priority || cluster.base_severity || 0)}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-[15px] m-0 mb-1 text-[#263238]">{cluster.title || 'Civic Issue'}</h4>
                            <p className="text-[#546e7a] text-[12px] m-0 mb-1 flex items-center">
                                <span className="material-icons text-[14px] mr-1">location_on</span> {cluster.campus_zone || 'Unknown Region'}
                            </p>
                            <span className={`text-[11px] m-0 font-bold px-[6px] py-[2px] rounded inline-block ${getStatusClasses(cluster.status)}`}>
                                {getStatusDisplay(cluster.status)}
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
