import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../context/StoreContext.jsx";

const AdminApp = () => {
  const { admin, token, url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Silent redirect for guests
      navigate("/login", { state: { from: "/admin" } });
    } else if (!admin) {
      // Access denied only for logged-in non-admin users
      toast.error("Access Denied: You do not have Restaurant Admin permissions.");
      navigate("/login", { state: { from: "/admin" } });
    }
  }, [admin, token, navigate]);

  if (!token || !admin) {
    return null; 
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="add" replace />} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminApp;
