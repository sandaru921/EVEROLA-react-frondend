import React from "react";

const LogOutButton = ({ onLogout }) => (
    <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition">
        Log Out
    </button>
);

export default LogOutButton;