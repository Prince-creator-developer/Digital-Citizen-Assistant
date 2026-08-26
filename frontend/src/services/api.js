import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Single Unified Assistant Endpoint
  unifiedEvaluate: async (query, userProfile = null, categoryFilter = null, language = 'hi') => {
    const response = await apiClient.post('/assistant/evaluate', {
      query,
      user_profile: userProfile,
      category_filter: categoryFilter,
      language
    });
    return response.data;
  },

  // Schemes listing
  getSchemes: async (category = null) => {
    const params = category && category !== 'ALL' ? { category } : {};
    const response = await apiClient.get('/schemes/', { params });
    return response.data;
  },

  // Document OCR Upload
  uploadDocumentOCR: async (formData, token = null) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await axios.post(`${API_BASE_URL}/application/upload-document`, formData, { headers });
    return response.data;
  },

  // Citizen Document Vault
  getUserDocuments: async (token) => {
    const response = await apiClient.get('/auth/documents', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteUserDocument: async (docId, token) => {
    const response = await apiClient.delete(`/auth/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Aadhaar OTP e-KYC Endpoints
  generateAadhaarOTP: async (aadhaarNumber, citizenName = 'Citizen Applicant', mobileNumber = '') => {
    const response = await apiClient.post('/application/aadhaar/generate-otp', {
      aadhaar_number: aadhaarNumber,
      citizen_name: citizenName,
      mobile_number: mobileNumber
    });
    return response.data;
  },

  verifyAadhaarOTP: async (refId, otp, aadhaarNumber, citizenName = 'Citizen Applicant', mobileNumber = '') => {
    const response = await apiClient.post('/application/aadhaar/verify-otp', {
      ref_id: refId,
      otp,
      aadhaar_number: aadhaarNumber,
      citizen_name: citizenName,
      mobile_number: mobileNumber
    });
    return response.data;
  },

  // Voice STT
  sendAudioSTT: async (audioBlob, languageCode = 'hi-IN') => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_query.wav');
    formData.append('language_code', languageCode);

    const response = await axios.post(`${API_BASE_URL}/voice/stt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default apiService;
