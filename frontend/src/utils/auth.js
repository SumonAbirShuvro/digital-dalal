// Save token to localStorage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Remove token (logout)
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Save user data
export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Get user data
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Remove user data
export const removeUser = () => {
    localStorage.removeItem('user');
};

// Logout (clear everything)
export const logout = () => {
    removeToken();
    removeUser();
    window.location.href = '/login';
};