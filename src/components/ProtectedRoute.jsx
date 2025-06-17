import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Add a new prop 'allowedRoles' which will be an array of strings
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    // 1. Check if user is logged in
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if the route requires a specific role and if the user has it
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // If the user's role is not allowed, redirect them to the dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // If all checks pass, render the child component
    return children;
};

export default ProtectedRoute;
