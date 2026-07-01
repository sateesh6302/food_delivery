import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import AdminApp from "./admin_panel/AdminApp";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const { token } = useContext(StoreContext);
  return (
    <>
      <Routes>
        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* User Application */}
        <Route
          path="/*"
          element={
            <>
              <div className="app">
                <ToastContainer />
                <Navbar />
                <Routes>
                  <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
                  <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" replace />} />
                  <Route path="/order" element={token ? <PlaceOrder /> : <Navigate to="/login" replace />} />
                  <Route path="/verify" element={token ? <Verify /> : <Navigate to="/login" replace />} />
                  <Route path="/myorders" element={token ? <MyOrders /> : <Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
