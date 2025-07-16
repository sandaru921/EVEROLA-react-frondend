
"use client"

import { useState, useEffect } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import AdminSidebar from "../../components/AdminSidebar"
import { Outlet } from "react-router-dom"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="pt-14">
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 p-6">
              <div className="flex justify-center items-center h-[80vh]">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#005B7C] border-r-transparent"></div>
                <p className="ml-2 text-xl">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <AdminNavbar />
    <div className="pt-14">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboard
