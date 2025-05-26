import React from "react";

const LogOutButton = ({ onLogout }) => (
    <button onClick={onLogout} className="btn-logout">
        Log Out
    </button>
);

export default LogOutButton;