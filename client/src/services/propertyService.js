import api from './api';

export const getProperties = () => api.get('/properties');
export const searchProperties = (params) => api.get('/properties/search', { params });
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updatePropertyStatus = (id, status) =>
  api.patch(`/properties/${id}/status`, { status });
export const getAllPropertiesAdmin = (status) =>
  api.get('/properties/admin/all', { params: status ? { status } : {} });