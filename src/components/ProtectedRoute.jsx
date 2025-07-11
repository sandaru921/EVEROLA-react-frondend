import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    //If no token found, user is not logged in
    if (!token) {
        return <Navigate to="/login" />;
    }

    //If a specific role is required and not present in user's permissions
    if (allowedRole && !permissions.includes(allowedRole)) {
        return <Navigate to="/" />;// or /unauthorized
    }

    // Allow access
    return children;
};

export default ProtectedRoute;
