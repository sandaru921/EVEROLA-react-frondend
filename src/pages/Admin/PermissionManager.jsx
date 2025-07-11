import React, { useEffect, useState } from "react";
import axios from "axios";
import {backendBaseURL} from "../../data/environment.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from "../../components/UserSidebar.jsx";

const PermissionManager = () => {
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingPermissions, setEditingPermissions] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
        fetchPermissions();
    }, []);

    // Fetch users with their permissions from backend
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${backendBaseURL}user/with-permissions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to fetch users.");
            console.error(err);
        }
    };

    // Fetch all available permissions
    const fetchPermissions = async () => {
        try {
            const res = await axios.get(`${backendBaseURL}permission/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPermissions(res.data);
        } catch (err) {
            toast.error("Failed to fetch permissions.");
            console.error(err);
        }
    };

    // Open modal and set current user and their permissions for editing
    const openEditModal = (user) => {
        setEditingUser(user);
        setEditingPermissions(user.permissions.map((p) => p.id));
    };

    const togglePermission = (permId) => {
        setEditingPermissions((prev) =>
            prev.includes(permId)
                ? prev.filter((id) => id !== permId)
                : [...prev, permId]
        );
    };

    // Save updated permissions to backend
    const savePermissions = async () => {
        try {
            await axios.put(
                `${backendBaseURL}permission/assign`,
                {
                    userId: editingUser.id,
                    permissionIds: editingPermissions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Permissions updated successfully.");
            setEditingUser(null);
            fetchUsers(); // Refresh users
        } catch (err) {
            console.error("Error saving permissions:", err);
            toast.error("Failed to save permissions.");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64">
                <UserSidebar />
            </div>

        <div className="flex-1 p-6 bg-cyan-700 overflow-auto">
            <h1 className="text-2xl font-bold mb-6 text-white">User Permissions Manager</h1>

            <div className="overflow-x-auto shadow rounded border border-gray-200 bg-indigo-50 ">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Permissions</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="border-t hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">
                                {user.permissions.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-gray-800">
                                        {user.permissions.map((p) => (
                                            <li key={p.id}>
                                                {p.displayName ||p.name || <span className="text-red-500 italic">Missing name</span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-500 italic">None</span>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => openEditModal(user)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Permissions: {editingUser.username}
                        </h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {permissions.map((perm) => (
                                <label key={perm.id} className="block">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={editingPermissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                    />
                                    <span>{perm.displayName || perm.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePermissions}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
            <ToastContainer />
        </div>
    );
};

export default PermissionManager;
