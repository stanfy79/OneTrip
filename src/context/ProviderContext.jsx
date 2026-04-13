import React, { useState, createContext } from "react";
import { DataContext } from "./Context";

export function DataProvider({ children }) {
  const [coordinates, setCoordinates] = useState([{
    current: null,
    destination: null,
  }]);
  const [routeInfo, setRouteInfo] = useState();

  function newDataEntry(newEntry) {
    const existingData = getFareData();
    localStorage.setItem(
      "fareData",
      JSON.stringify([...existingData, newEntry]),
    );
  }
  
  function getFareData() {
    const data = localStorage.getItem("fareData");
    return data ? JSON.parse(data) : [];
  }


  function newRouteEntry(newEntry) {
    const existingData = getRouteData();
    if (!newEntry.routeDetails?.estimatedCost) {
      throw new Error("Estimated cost is required for a route entry. Check the route location and try again.");
    }
    localStorage.setItem(
      "routeData",
      JSON.stringify([...existingData, newEntry]),
    );
  }
  
  function getRouteData() {
    const data = localStorage.getItem("routeData");
    return data ? JSON.parse(data) : [];
  }

  const fetchCoordinates = async (current, destination) => {
    // const API_KEY = "f1e9581bd16d23351da332b38be51206";

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${current},lagos,nigeria&limit=1`
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
        return null;
      });
      
    const destResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${destination},lagos,nigeria&limit=1`)
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
      const ratePerKm = 100;

      // Formula: Base + (Distance * Rate)
      const total = distance * ratePerKm;

      return total;
    }

  const getRouteInfo = (distance, duration) => {
    const cost = calculateCost(distance);
    const info = {
      distance: distance.toString() + ' KM',
      duration: duration.toString(),
      estimatedCost: cost,
    };
    setRouteInfo(info);
    console.log('distsance', JSON.stringify(routeInfo))
    return info;
  }

  const getUserInfo = () => {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
  }

  const setUserActivities = () => {
    const user = getUserInfo();
    const name = user?.userName;
    const getContributions = getFareData().filter(entry => entry.contributor === name);
    const totalSpent = getContributions.reduce((total, entry) => total + Number(entry.amount), 0);
    const userContributions = getContributions.length;
    const points = userContributions * 10 * (totalSpent / 1000);
    const updatedUser = { ...user, contribution: userContributions, totalSpent: totalSpent, points: points };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  setUserActivities();
  
  

  return (
    <DataContext.Provider
      value={{ getFareData, newDataEntry, fetchCoordinates, getRouteInfo, newRouteEntry, getRouteData, coordinates, routeInfo, getUserInfo }}
    >
      {children}
    </DataContext.Provider>
  );
}
