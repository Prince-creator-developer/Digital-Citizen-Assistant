import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Voice endpoints
  sendAudioSTT: async (audioBlob, languageCode = 'hi-IN') => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_query.wav');
    formData.append('language_code', languageCode);

    const response = await axios.post(`${API_BASE_URL}/voice/stt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getTTS: async (text, languageCode = 'hi-IN') => {
    const response = await apiClient.post('/voice/tts', { text, language_code: languageCode });
    return response.data;
  },

  // Scheme endpoints
  getSchemes: async (category = 'ALL') => {
    const response = await apiClient.get(`/schemes/?category=${category}`);
    return response.data;
  },

  searchSchemes: async (query, category = 'ALL', citizenProfile = null) => {
    const response = await apiClient.post('/schemes/search', {
      query,
      category,
      citizen_profile: citizenProfile,
    });
    return response.data;
  },

  getRecommendations: async (citizenId = 1) => {
    const response = await apiClient.get(`/schemes/recommendations/${citizenId}`);
    return response.data;
  },

  // Eligibility
  checkEligibility: async (payload) => {
    const response = await apiClient.post('/eligibility/check', payload);
    return response.data;
  },

  // Application
  submitApplication: async (citizenId, schemeId, documentsUrl) => {
    const response = await apiClient.post('/application/apply', {
      citizen_id: citizenId,
      scheme_id: schemeId,
      documents_url: documentsUrl,
    });
    return response.data;
  },

  getApplicationStatus: async (trackingCode) => {
    const response = await apiClient.get(`/application/status/${trackingCode}`);
    return response.data;
  },
};

export default apiService;
