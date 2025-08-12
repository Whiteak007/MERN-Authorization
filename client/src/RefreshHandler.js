// RefreshHandler.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for a token in localStorage
    const token = localStorage.getItem('token');
    const isAuth = !!token;

    // Update the authentication state
    setIsAuthenticated(isAuth);

    // If a token exists and the user is on a public route, redirect to home
    if (isAuth && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/home', { replace: true });
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}