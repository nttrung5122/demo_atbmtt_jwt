import React, { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Track the checking status

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      setAuthenticated(Boolean(accessToken));
    } catch (error) {
      console.error("Error accessing localStorage", error);

      setAuthenticated(false);
    } finally {
      setIsCheckingAuth(false); // Indicate that the check is complete
    }
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or provide a better loading state here
  }

  if (!authenticated) {
    alert("Vui lòng đăng nhập");
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <Sidebar />

      {/* Rest of the dashboard layout */}
    </div>
  );
};

export default Dashboard;
