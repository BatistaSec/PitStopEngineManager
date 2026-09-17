export const API_BASE_URL = 'http://localhost:8080/api/v1';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pitstop_jwt_token');
  }
  return null;
}

export function setAuthToken(token: string, username: string, role: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pitstop_jwt_token', token);
    localStorage.setItem('pitstop_username', username);
    localStorage.setItem('pitstop_role', role);
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pitstop_jwt_token');
    localStorage.removeItem('pitstop_username');
    localStorage.removeItem('pitstop_role');
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP Error ${response.status}`);
  }

  // Handle 204 No Content (e.g. DELETE responses)
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

// ---- Teams CRUD ----
export const createTeam = (data: Record<string, unknown>) =>
  apiFetch('/teams', { method: 'POST', body: JSON.stringify(data) });

export const updateTeam = (id: number, data: Record<string, unknown>) =>
  apiFetch(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTeam = (id: number) =>
  apiFetch(`/teams/${id}`, { method: 'DELETE' });

// ---- Drivers CRUD ----
export const createDriver = (data: Record<string, unknown>) =>
  apiFetch('/drivers', { method: 'POST', body: JSON.stringify(data) });

export const updateDriver = (id: number, data: Record<string, unknown>) =>
  apiFetch(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteDriver = (id: number) =>
  apiFetch(`/drivers/${id}`, { method: 'DELETE' });
