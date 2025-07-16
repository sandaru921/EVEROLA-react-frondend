import React from "react";

const LogOutButton = ({ onLogout }) => (
    <button onClick={onLogout} className="flex items-center justify-center w-full p-2 rounded-lg bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-400 transition-all duration-200">
        Log Out
    </button>
);

export default LogOutButton;