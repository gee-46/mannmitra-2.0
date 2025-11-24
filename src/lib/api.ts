const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const options = {
    method,
    headers
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API Error');
    }

    return result;
  } catch (err) {
    throw err;
  }
};

// Auth endpoints
export const authAPI = {
  signup: (username, password) => apiCall('/auth/signup', 'POST', { username, password }),
  login: (username, password) => apiCall('/auth/login', 'POST', { username, password })
};

// Data endpoints
export const dataAPI = {
  getMoods: () => apiCall('/moods', 'GET'),
  saveMood: (mood, intensity, notes) => apiCall('/moods', 'POST', { mood, intensity, notes }),
  getJournal: () => apiCall('/journal', 'GET'),
  saveJournalEntry: (title, content) => apiCall('/journal', 'POST', { title, content }),
  updateJournalEntry: (id, title, content) => apiCall(`/journal/${id}`, 'PUT', { title, content })
};

export default { apiCall, authAPI, dataAPI };
