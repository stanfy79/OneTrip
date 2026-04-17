import React, { useState, createContext, useEffect } from "react";
import { DataContext } from "./Context";
import axios from "axios";

export function DataProvider({ children }) {
  const [coordinates, setCoordinates] = useState([
    {
      current: null,
      destination: null,
    },
  ]);
  const [routeInfo, setRouteInfo] = useState();
  const [searchedData, setSearchedData] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [user, setUser] = useState(null);

  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/user`;

  async function newDataEntry(newEntry) {
    const res = await axios.post(`${BASE_URL}/submit-route`, newEntry);
    setSubmitStatus(res.success);
    return res.data.data;
  }

  async function getFareData() {
    try {
      const res = await axios.get(`${BASE_URL}/get-searched-routes`);
      setSearchedData(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.log("failed to fetched searched routes:", err);
      return [];
    }
  }

  async function newRouteEntry(newEntry) {
    if (!newEntry.routeDetails?.estimatedCost) {
      throw new Error(
        "Estimated cost is required for a route entry. Check the route location and try again.",
      );
    }

    const res = await axios.post(`${BASE_URL}/save-searched`, newEntry);
    return res.data.data;
  }

  async function getRouteData() {
    try {
      const res = await axios.get(`${BASE_URL}/get-submitted-routes`);
      setSubmittedData(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.log("failed to fetched submitted routes:", err);
      return [];
    }
  }

  const fetchCoordinates = async (current, destination) => {
    // const API_KEY = "f1e9581bd16d23351da332b38be51206";

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${current},lagos,nigeria&limit=1`,
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
        return null;
      });

    const destResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${destination},lagos,nigeria&limit=1`,
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
        return null;
      });
    setCoordinates({ current: response, destination: destResponse });
    console.log("Fetched coordinates:", coordinates);
    return { current: response, destination: destResponse };
  };

  const calculateCost = (distance) => {
    const ratePerKm = 90;

    // Formula: Base + (Distance * Rate)
    const total = distance * ratePerKm;

    return total;
  };

  const getRouteInfo = (distance, duration) => {
    const cost = calculateCost(distance);
    const info = {
      distance: distance.toString() + " KM",
      duration: duration.toString(),
      estimatedCost: cost,
    };
    setRouteInfo(info);
    console.log("distsance", JSON.stringify(routeInfo));
    return info;
  };

  const getUserInfo = async () => {
    const token = { _id: localStorage.getItem("token") };
    const res = await axios.post(`${BASE_URL}/details`, token);

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
    setUser(userData);
    return userData;
  };

  const setUserActivities = async () => {
    const name = user?.username;
    if (!name) return;

    const getContributions = (submittedData || []).filter(
      (entry) => entry.contributor === name,
    );
    const totalSpent = getContributions.reduce(
      (total, entry) => total + Number(entry.amount || 0),
      0,
    );
    const userContributions = getContributions.length;
    const UpdatePoint = userContributions * 10 * (totalSpent / 1000);
    const points = Math.round(UpdatePoint);
    const updatedUser = {
      ...user,
      contribution: userContributions,
      totalSpent,
      points,
    };
    const payload = { updatedUser };
    const res = await axios.post(`${BASE_URL}/update`, payload);
  };

  useEffect(() => {
    getFareData();
    getRouteData();
    setUserActivities();
    getUserInfo().catch((err) =>
      console.error("failed to fetch user info:", err),
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        getFareData,
        newDataEntry,
        fetchCoordinates,
        getRouteInfo,
        newRouteEntry,
        coordinates,
        routeInfo,
        submitStatus,
        searchedData,
        submittedData,
        getUserInfo,
        setUserActivities,
        user,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
