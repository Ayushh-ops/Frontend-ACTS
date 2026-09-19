import { fetchClient } from './client';

export const getAdminClusters = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchClient(`/admin/clusters/${query ? '?' + query : ''}`);
};

export const getMapMarkers = () => {
    return fetchClient(`/admin/map-markers/`);
};

export const getCampusHealth = () => {
    return fetchClient(`/admin/campus-health/`);
};

export const getCrews = () => {
    return fetchClient(`/admin/crews/`);
};

export const getConnectPortal = (department) => {
    return fetchClient(`/admin/connect/?department=${department}`);
};
