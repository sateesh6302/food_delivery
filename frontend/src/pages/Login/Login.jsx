import React, { useContext, useState, useEffect } from "react";
import "./Login.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Login = () => {
  const { url, token, setToken, setAdmin } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentState, setCurrentState] = useState("Login");
  const [selectedRole, setSelectedRole] = useState("user"); // "user" or "admin"
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Auto-select Admin tab if redirected from Admin panel
  useEffect(() => {
    if (location.state?.from === "/admin") {
      setSelectedRole("admin");
    }
  }, [location.state]);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (token) {
      const isAdmin = localStorage.getItem("admin") === "true";
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [token, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    // Include selected role when registering
    const requestData = {
      ...data,
      role: selectedRole
    };

    try {
      const response = await axios.post(newUrl, requestData);
      if (response.data.success) {
        if (currentState === "Sign Up") {
          // Registration successful: switch to Login screen
          toast.success("Account Created Successfully! Please Sign In.");
          setCurrentState("Login");
          setData(prev => ({ ...prev, password: "" })); // clear password field
        } else {
          // Login successful
          const isAdminUser = response.data.role === "admin";
          
          // Guard: If trying to log in as admin, but account is a standard user
          if (selectedRole === "admin" && !isAdminUser) {
            toast.error("Access Denied: This account is not a Restaurant Admin.");
            return;
          }

          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("phone", response.data.phone || "");
          setAdmin(isAdminUser);
          localStorage.setItem("admin", isAdminUser ? "true" : "false");
          
          toast.success("Login Successfully");
          
          if (isAdminUser) {
            navigate("/admin");
          } else {
            const from = location.state?.from || "/";
            navigate(from);
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.response?.data?.message || error.message || "Network Error");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <form onSubmit={onLogin} className="login-form">
          <div className="login-header">
            <h2>{currentState}</h2>
            <p className="login-subtitle">
              {currentState === "Login" 
                ? "Welcome back! Choose your role and enter your details." 
                : "Choose your role and create an account."}
            </p>
          </div>

          {/* Premium Role Selector Tabs */}
          <div className="role-selector">
            <button
              type="button"
              className={selectedRole === "user" ? "role-btn active" : "role-btn"}
              onClick={() => setSelectedRole("user")}
            >
              Customer
            </button>
            <button
              type="button"
              className={selectedRole === "admin" ? "role-btn active admin" : "role-btn"}
              onClick={() => setSelectedRole("admin")}
            >
              Restaurant Admin
            </button>
          </div>
          
          <div className="login-inputs">
            {currentState === "Sign Up" && (
              <>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <input
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="tel"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="input-group">
              <label>Email Address</label>
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
            </div>
          </div>

          <div className="terms-condition">
            <input type="checkbox" required />
            <p>I agree to the Terms of Use & Privacy Policy</p>
          </div>

          <button type="submit" className={`login-btn ${selectedRole === "admin" ? "admin-theme" : ""}`}>
            {currentState === "Login" ? "Sign In" : "Create Account"}
          </button>

          <div className="login-switch">
            {currentState === "Login" ? (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrentState("Login")}>Login</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
