// src/utils/auth.js
export function saveAuth(data) {
  if (data.access) localStorage.setItem('access', data.access);
  if (data.refresh) localStorage.setItem('refresh', data.refresh);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearAuth() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('access');
}
