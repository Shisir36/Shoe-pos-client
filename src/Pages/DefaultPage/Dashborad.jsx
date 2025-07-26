import React, { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";
import { MdInventory, MdOutlineAddCircleOutline, MdSell } from "react-icons/md";
import shoesIcon from "../../assets/running-shoes.gif";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // initially true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 1 second por loading off

    return () => clearTimeout(timer); // cleanup
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <FiHome className="w-5 h-5 mr-3" />,
    },
    {
      name: "My Stock",
      path: "/stock-management",
      icon: <MdInventory className="w-5 h-5 mr-3" />,
    },
    {
      name: "Add Shoes",
      path: "/add-shoes-item",
      icon: <MdOutlineAddCircleOutline  className="w-5 h-5 mr-3" />  ,
    },
    {
      name: "Sell History",
      path: "/sell-history",
      icon: <MdSell className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <div className="flex h-screen font-sans antialiased relative">
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <img src={shoesIcon} alt="Loading..." className="h-24 w-24" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 mt-2 text-green-300 bg-gray-700 rounded-lg"
                  : "flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold ml-4">Overview</h2>
          </div>

          <div className="flex items-center">
            <button className="flex items-center text-gray-500 focus:outline-none md:ml-6">
              <span className="mr-2">John Doe</span>
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://placehold.co/32x32/cccccc/ffffff?text=JD"
                alt="User Avatar"
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
