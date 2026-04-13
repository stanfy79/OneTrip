import React, { createContext, use, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider =  ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        return { token, user };
    });
    const navigate = useNavigate();

    function getUserData() {
        const data = localStorage.getItem('fareData');
        return data ? JSON.parse(data) : [];
    }

    const generateSecureToken = (length = 32) => {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);

        return Array.from(array, byte =>
            byte.toString(16).padStart(2, "0")
        ).join("");
    };
    

    const login = (user) => {
        if (auth?.user?.email === user.email && auth?.user?.password === user.password) {
            const token = generateSecureToken(16);
            setAuth({ token: token, user: auth.user });
            localStorage.setItem('token', token);
            return navigate("/dashboard");
        }
        return alert("Invalid email or password");
    }

    const signup = (user) => {
        if (!auth.token) {
            const token = generateSecureToken(16);
            localStorage.setItem('token', token);
        }

        const userWithPreferences = {
            preferences: {
                notifications: {
                    email: true,
                    routeAlerts: true,
                    productUpdates: true,
                },
                privacy: {
                    showProfile: true,
                    shareActivity: false,
                },
                theme: 'dark',
            },
            contribution: 0,
            profileUrl: '',
            ...user,
        };

        localStorage.setItem('user', JSON.stringify(userWithPreferences));
        setAuth({ token: auth?.token, user: userWithPreferences });
        return navigate('/dashboard');
    }

    const updateUser = (updatedFields) => {
        const existingUser = JSON.parse(localStorage.getItem('user')) || {};
        const nextUser = { ...existingUser, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(nextUser));
        setAuth({ token: auth?.token, user: nextUser });
        return nextUser;
    }

    const deleteAccount = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null });
        return navigate('/auth?mode=signup');
    }

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, "user": null });
        return navigate("/auth");
    }

    return (
        <AuthContext.Provider value={{ auth, login, signup, logout, updateUser, deleteAccount, getUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);