import React from "react";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children, allowedRole}) => {
    const token = localStorage.getItem("token");

    let permissions = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("permissions"));
        if (parsed && Array.isArray(parsed.$values)) {
            permissions = parsed.$values;
        } else if (Array.isArray(parsed)) {
            permissions = parsed; // fallback if plain array
        }
    } catch (e) {
        console.warn("Failed to parse permissions from localStorage:", e);
    }

    //If no token found, user is not logged in
    if (!token) {
        return <Navigate to="/login"/>;
    }

    //If a specific role is required and not present in user's permissions
    if (allowedRole && !permissions.includes(allowedRole)) {
        return <Navigate to="/"/>;// or /unauthorized
    }

    // Allow access
    return children;
};

export default ProtectedRoute;
