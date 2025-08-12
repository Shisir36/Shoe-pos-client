import React, { useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Authcontext } from "../Provider/AuthContext"; // Adjust path if needed

const PrivateRoute = ({ children }) => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [userRole, setUserRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // This effect runs when the Firebase user state changes.
    if (!authLoading) {
      if (user) {
        // User is logged in according to Firebase.
        // Now, fetch their role from our backend to verify.
        axios
          .get(`https://shoes-pos-server.vercel.app/api/users/${user.email}`)
          .then((res) => {
            // Store the role from the database in our state.
            setUserRole(res.data.role);
            setIsRoleLoading(false);
          })
          .catch((err) => {
            // Handle cases where the user might be in Firebase but not in our DB.
            console.error("Failed to fetch user role from database:", err);
            setUserRole(null); // Set role to null if fetch fails.
            setIsRoleLoading(false);
          });
      } else {
        // No user is logged in, so we can stop the loading state.
        setIsRoleLoading(false);
      }
    }
  }, [user, authLoading]); // Re-run this check if the user or authLoading state changes.

  // Show a loading spinner while we check Firebase auth AND our database role.
  if (authLoading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  // Once all loading is done, check for access.
  if (user && userRole === "admin") {
    // If the user is logged in AND their role from the DB is 'admin', show the page.
    return children;
  }

  // If the user is logged in but not an admin, show an error and redirect.
  if (user) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You do not have permission to view this page.",
      timer: 2500,
      showConfirmButton: false,
    });
    // Redirect to the login page to break the potential redirect loop.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there is no user at all, redirect to the login page.
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
