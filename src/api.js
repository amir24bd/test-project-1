import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api'; // adjust if needed (same as backend url)

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
});

// Helper to get token
function getToken() {
  return localStorage.getItem('access');
}

// Add token automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------- AUTH -------------------

async function login(data) {
  const payload = {
    email: data.email,
    username: data.email, // support backend expecting username
    password: data.password,
  };
  const res = await apiClient.post('/token/', payload);
  return res.data;
}

async function register(data) {
  const headers = {};
  if (data instanceof FormData) {
    // Let browser set content-type for multipart/form-data
    delete apiClient.defaults.headers.post['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }
  const res = await apiClient.post('/register/', data, { headers });
  return res.data;
}

// ------------------- PROFILES -------------------

async function profileDetail(id) {
  const res = await apiClient.get(`/profiles/${id}/`);
  return res.data;
}

async function updateProfile(data) {
  const headers = {};
  if (data instanceof FormData) {
    delete apiClient.defaults.headers.put['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }
  const res = await apiClient.put('/profile/update/', data, { headers });
  return res.data;
}

// ------------------- DONORS -------------------

async function listDonors(params = {}) {
  // params can include ?blood=, ?city=, ?available=
  const res = await apiClient.get('/donors/', { params });
  return res.data;
}

// ------------------- EXPORT -------------------

const api = {
  login,
  register,
  profileDetail,
  updateProfile,
  listDonors, // ✅ Added
};

export default api; // ✅ No eslint “anonymous export” warning
