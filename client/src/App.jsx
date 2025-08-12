// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import "./index.css";
import { RefreshHandler } from "./RefreshHandler";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    // This effect ensures the `isAuthenticated` state is in sync with localStorage.
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth); // Listen for changes in localStorage
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const PublicRoute = ({ element }) => {
    return isAuthenticated ? <Navigate to="/home" /> : element;
  };

  return (
    <>
      <div className="App">
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;