import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [savedSchools, setSavedSchools] = useState([]);

    const fetchSavedSchools = async (currentToken) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/me/saved-schools', {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSavedSchools(data.map(school => school.id));
            }
        } catch (error) {
            console.error("Failed to fetch saved schools", error);
        }
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // In a real app we'd fetch the user profile here using the token
            // For now we'll just mock a decode or trust the token exists
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                setUser({ email: decoded.sub, first_name: "Student" });
                fetchSavedSchools(token);
            } catch (err) {
                console.error("Failed to decode token", err);
                logout();
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setSavedSchools([]);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Login failed");
            }

            const data = await response.json();
            setToken(data.access_token);
            setIsLoginModalOpen(false);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const register = async (email, password, firstName, lastName) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Registration failed");
            }

            // Auto login after register
            await login(email, password);
            setIsSignupModalOpen(false);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
    };

    const openLogin = () => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const openSignup = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(true);
    };

    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
    };

    const saveSchool = async (institutionId) => {
        if (!token) {
            openLogin();
            return false;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/me/saved-schools/${institutionId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSavedSchools(prev => [...prev, institutionId]);
                return true;
            }
        } catch (err) {
            console.error("Failed to save school", err);
        }
        return false;
    };

    const unsaveSchool = async (institutionId) => {
        if (!token) return false;
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/me/saved-schools/${institutionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSavedSchools(prev => prev.filter(id => id !== institutionId));
                return true;
            }
        } catch (err) {
            console.error("Failed to unsave school", err);
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, register, logout,
            isLoginModalOpen, isSignupModalOpen,
            openLogin, openSignup, closeModals,
            savedSchools, saveSchool, unsaveSchool
        }}>
            {children}
        </AuthContext.Provider>
    );
};
