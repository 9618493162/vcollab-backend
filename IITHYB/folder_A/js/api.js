// API Configuration
const API_URL = 'https://vcollab-backend-production.up.railway.app/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('authToken');

// Helper function to set auth token
const setToken = (token) => localStorage.setItem('authToken', token);

// Helper function to remove auth token
const removeToken = () => localStorage.removeItem('authToken');

// Helper function to set user data
const setUserData = (user) => localStorage.setItem('userData', JSON.stringify(user));

// Helper function to get user data
const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

// API Service
const API = {
    // Auth APIs
    auth: {
        register: async (fullName, email, password) => {
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName, email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    setToken(data.accessToken); // Changed from data.token
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }
                    setUserData(data.user);
                }
                
                return data;
            } catch (error) {
                console.error('Register API error:', error);
                return { success: false, message: 'Network error. Please try again.' };
            }
        },

        login: async (email, password) => {
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    setToken(data.accessToken); // Changed from data.token
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }
                    setUserData(data.user);
                }
                
                return data;
            } catch (error) {
                console.error('Login API error:', error);
                return { success: false, message: 'Network error. Please try again.' };
            }
        },

        logout: () => {
            removeToken();
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        },

        getProfile: async () => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch(`${API_URL}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                return await response.json();
            } catch (error) {
                console.error('Get profile error:', error);
                return { success: false, message: 'Failed to get profile' };
            }
        }
    },

    // Meeting APIs
    meetings: {
        create: async (title, description, date, time, type, passcode = '') => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch(`${API_URL}/meetings/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, date, time, type, passcode })
                });
                
                return await response.json();
            } catch (error) {
                console.error('Create meeting error:', error);
                return { success: false, message: 'Failed to create meeting' };
            }
        },

        join: async (meetingId, passcode = '') => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch(`${API_URL}/meetings/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ meetingId, passcode })
                });
                
                return await response.json();
            } catch (error) {
                console.error('Join meeting error:', error);
                return { success: false, message: 'Failed to join meeting' };
            }
        },

        getAll: async () => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch(`${API_URL}/meetings/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                return await response.json();
            } catch (error) {
                console.error('Get meetings error:', error);
                return { success: false, message: 'Failed to get meetings' };
            }
        },

        getById: async (meetingId) => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                return await response.json();
            } catch (error) {
                console.error('Get meeting error:', error);
                return { success: false, message: 'Failed to get meeting' };
            }
        }
    }
};

// Check if user is authenticated
const isAuthenticated = () => {
    return !!getToken();
};

// Redirect to login if not authenticated
const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};
