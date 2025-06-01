import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSearchBar = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    const handleSearch = (e) => {
        e.preventDefault();

        // Normalize the query for flexibility
        const normalizedQuery = query.trim().toLowerCase();

        if (permissions.includes("admin") && normalizedQuery === "permission-manager") {
            navigate("/permission-manager");
        } else {
            alert("You either lack permission or entered an invalid command.");
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search admin command..."
                className="border px-3 py-1 rounded-md"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md">
                Go
            </button>
        </form>
    );
};

export default AdminSearchBar;
