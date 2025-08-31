import React, { useEffect, useState, useContext, useRef } from "react";
import { FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { MdInventory, MdOutlineAddCircleOutline, MdSell } from "react-icons/md";
import shoesIcon from "../../assets/running-shoes.gif";
import { Authcontext } from "../../Provider/AuthContext"; // Adjust the path as needed

export default function Dashboard() {
  const { user, userRole, logout } = useContext(Authcontext); // Get user, role, and logout from context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userMenuRef = useRef(null); // Ref for the dropdown menu

  // Effect to show loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to handle clicks outside the user menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/login"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const navItems = [
    { name: "Home", path: "/", icon: <FiHome className="w-5 h-5 mr-3" /> },
    { name: "My Stock", path: "/stock-management", icon: <MdInventory className="w-5 h-5 mr-3" /> },
    { name: "Add Shoes", path: "/add-shoes-item", icon: <MdOutlineAddCircleOutline className="w-5 h-5 mr-3" /> },
    { name: "Sell History", path: "/sell-history", icon: <MdSell className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen font-sans antialiased relative bg-gray-50">
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <img src={shoesIcon} alt="Loading..." className="h-24 w-24" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-48 bg-gray-800 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out shadow-lg`}
      >
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 mt-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-green-400 to-blue-500 shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold ml-4 text-gray-800">Overview</h2>
          </div>

          {/* User Profile Section */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-gray-600 focus:outline-none md:ml-6"
            >
              <span className="mr-3  font-medium">{user?.displayName || "User"}</span>
              <img
                className="h-9 w-9 rounded-full object-cover border-2 border-gray-300"
                src={user?.photoURL || "https://placehold.co/32x32/cccccc/ffffff?text=U"}
                alt="User Avatar"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/32x32/cccccc/ffffff?text=U"; }}
              />
            </button>
            
            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-40 transition-all duration-300 transform origin-top-right animate-fadeIn">
                <div className="flex items-center p-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={user?.photoURL || "https://placehold.co/48x48/cccccc/ffffff?text=U"}
                    alt="User Avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/cccccc/ffffff?text=U"; }}
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{user?.displayName || "User"}</p>
                    <p className="text-[12px] text-gray-500 truncate">{user?.email}</p>
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{userRole || 'user'}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="#profile" className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FiUser className="w-4 h-4 mr-3 text-gray-500" />
                  View Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                >
                  <FiLogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
