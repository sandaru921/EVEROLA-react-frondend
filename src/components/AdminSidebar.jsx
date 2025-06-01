"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaBriefcase, FaChartBar, FaNewspaper, FaQuestionCircle, FaSignOutAlt, FaComments } from "react-icons/fa"

const AdminSidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { name: "Jobs", icon: FaBriefcase, path: "/admin/jobs" },
    { name: "Quizzes", icon: FaQuestionCircle, path: "/admin/quizzes" },
    { name: "Blogs", icon: FaNewspaper, path: "/admin/blogs" },
    { name: "Results", icon: FaChartBar, path: "/admin/results" },
    { name: "Chats", icon: FaComments, path: "/admin/chats" },
    
  ]

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div
      className={`bg-[#004d66] text-white h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } fixed left-0 top-0 z-10`}
    >
      <div className="p-4">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full text-right text-white/70 hover:text-white">
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive(item.path) ? "bg-[#003d56] text-white" : "text-white/80 hover:bg-[#003d56] hover:text-white"
                }`}
              >
                <item.icon className={`text-xl ${collapsed ? "mx-auto" : "mr-3"}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Link
          to="/login"
          className="flex items-center p-3 text-white/80 hover:bg-[#003d56] hover:text-white rounded-md transition-colors"
        >
          <FaSignOutAlt className={`text-xl ${collapsed ? "mx-auto" : "mr-3"}`} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar
