import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Component that guards routes, ensuring a user is authenticated before rendering the content.
 * If not authenticated, it redirects the user to the login path.
 */
const ProtectedRoute = ({ redirectPath = '/login' }) => {
    
    // Check local storage for the authentication flag set upon successful login.
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // CRITICAL CHECK: If the flag is not set to 'true', force a redirect.
    if (isAuthenticated !== 'true') { 
        // Redirects the user to the specified login page
        return <Navigate to={redirectPath} replace />;
    }

    // If isAuthenticated is 'true', render the nested route content (HomePage or Dashboard)
    // <Outlet /> is used when the component is rendered as a parent in the router setup.
    return <Outlet />; 
};

export default ProtectedRoute;