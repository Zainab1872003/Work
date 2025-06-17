import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Import the correctly configured api instance

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state to prevent screen flicker
    const navigate = useNavigate();

    // This function will run ONCE when the app loads to check for an existing session cookie.
    useEffect(() => {
        const verifyUser = async () => {
            try {
                // The `/me` endpoint is now the source of truth for the user's logged-in state.
                // The `withCredentials: true` in axios.js ensures the cookie is sent.
                const response = await api.get('/auth/me');
                setCurrentUser(response.data.user);
            } catch (error) {
                // If this fails, it simply means the user is not logged in.
                setCurrentUser(null);
            } finally {
                // Stop loading once the check is complete.
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    const login = async (credentials) => {
        // 1. Call the login endpoint. Your backend will set the HttpOnly cookies. [1]
        await api.post('/auth/login', credentials);
        // 2. After successful login, get the user's data to update the app's state.
        const response = await api.get('/auth/me');
        setCurrentUser(response.data.user);
        // 3. Navigate the user to their dashboard.
        navigate('/dashboard');
    };

    const logout = async () => {
        // Call the backend logout endpoint to clear the HttpOnly cookies. [1]
        await api.post('/auth/logout');
        setCurrentUser(null);
        navigate('/login', { replace: true });
    };

    const value = {
        currentUser,
        setCurrentUser,
        login,
        logout,
        loading,
    };

    // While checking for the user, render nothing or a spinner.
    if (loading) {
        return null;
    }

    // Correctly return the Provider with the context value.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};






