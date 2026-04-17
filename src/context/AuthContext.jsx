import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/Context";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user } = useContext(DataContext);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token") || "";
    const message = "";
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    return { token, user, message };
  });
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Debug: Monitor auth state changes
  useEffect(() => {
    console.log("Auth state updated:", auth);
  }, [auth]);

  function getUserData() {
    const data = localStorage.getItem("fareData");
    return data ? JSON.parse(data) : [];
  }

  const generateSecureToken = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };

  const login = async (user) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, user);

      // Format userData to match response structure
      const userData = {
        username: res.data.data?.username,
        email: res.data.data?.email,
        preferences: res.data.data?.preferences || {
          notifications: {
            email: true,
            routeAlerts: true,
            productUpdates: true,
          },
          privacy: {
            showProfile: true,
            shareActivity: false,
          },
          theme: "dark",
        },
        contribution: res.data.data?.contribution || 0,
        profileUrl: res.data.data?.profileUrl || "",
        points: res.data.data?.points || 0,
        totalSpent: res.data.data?.totalSpent || 0,
        id: res.data.data?.id,
        token: res.data.data?.token,
        _id: res.data.data?._id,
      };

      setAuth({
        token: res.data.data?._id,
        user: userData,
        message: res.data.message,
      });
      localStorage.setItem("token", res.data.data?._id);
      // localStorage.setItem("userData", JSON.stringify(userData));

      return navigate("/");
    } catch (err) {
      console.error("Error response:", err.response);
      setAuth({
        token: null,
        user: null,
        message: err.response.data.message || "Login failed. Please try again.",
      });
    }
  };

  const signup = async (user) => {
    try {
      const token = generateSecureToken(16);

      const userData = {
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
          theme: "dark",
        },
        contribution: 0,
        profileUrl: "",
        token: token,
        points: 0,
        totalSpent: 0,
        ...user,
      };

      const res = await axios.post(
        `${BASE_URL}/auth/signup`,
        userData,
      );

      // Format userData to match response structure
      const formattedUserData = {
        username: res.data.data?.username,
        email: res.data.data?.email,
        preferences: res.data.data?.preferences || {
          notifications: {
            email: true,
            routeAlerts: true,
            productUpdates: true,
          },
          privacy: {
            showProfile: true,
            shareActivity: false,
          },
          theme: "dark",
        },
        contribution: res.data.data?.contribution || 0,
        profileUrl: res.data.data?.profileUrl || "",
        points: res.data.data?.points || 0,
        totalSpent: res.data.data?.totalSpent || 0,
        id: res.data.data?.id,
        token: res.data.data?.token,
        _id: res.data.data?._id,
      };

      setAuth({
        token: res.data.data?.token,
        user: userData,
        message: res.data.message,
      });
      localStorage.setItem("token", res.data.data?.token);

      return navigate("/dashboard");
    } catch (error) {
      console.error("Error response:", err.response);
      setAuth({
        token: null,
        user: null,
        message:
          err.response.data.message || "Signup failed. Please try again.",
      });
    }
  };

  const updateUser = async (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };

    const payload = { updatedUser };
    const res = await axios.post(`${BASE_URL}/user/update`, payload);
    setAuth({ token: auth?.token, user: res });
    return res;
  };

  const updatePassword = async (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };

    const payload = { updatedUser };
    const res = await axios.post(`${BASE_URL}/user/update`, payload);
    return res;
  };

  const deleteAccount = async () => {
    localStorage.removeItem("token");

    const payload = { user };

    const res = await axios.post(`${BASE_URL}/user/delete`, payload);
    setAuth({ token: null, user: null });
    console.log(res);
    return navigate("/auth?mode=signup");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
    return navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        signup,
        logout,
        updateUser,
        updatePassword,
        deleteAccount,
        getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
