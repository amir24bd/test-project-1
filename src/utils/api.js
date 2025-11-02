const API_BASE = 'http://127.0.0.1:8000/api';

export function authHeaders() {
  const token = localStorage.getItem('access');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : {'Content-Type':'application/json'};
}

export default API_BASE;
