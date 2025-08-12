import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../../public/Firebase/Firebase.config"; // Adjust path if needed
import { Authcontext } from "./AuthContext";

// Create the context

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // State to hold the user's role
  const [loading, setLoading] = useState(true);

  // Function to fetch user role from your database
  const fetchUserRole = async (email) => {
    try {
      const res = await axios.get(
        `https://shoes-pos-server.vercel.app/api/users/${email}`
      );
      const role = res.data.role;
      setUserRole(role); // Set the role in state
      localStorage.setItem("role", role); // Also keep it in localStorage for quick access
      return role;
    } catch (error) {
      console.error("Failed to fetch user role", error);
      setUserRole(null);
      localStorage.removeItem("role");
      return null;
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await fetchUserRole(email); // Fetch and set the role upon successful sign-in
    setLoading(false);
    return userCredential;
  };

  const logout = () => {
    setLoading(true);
    setUserRole(null); // Clear the role on logout
    localStorage.removeItem("role");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If user is logged in, fetch their role
        await fetchUserRole(currentUser.email);
      } else {
        // If no user, clear the role
        setUserRole(null);
        localStorage.removeItem("role");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    userRole, // Expose the role to the rest of the app
    createUser,
    updateUserProfile,
    signIn,
    logout,
    loading,
    setLoading,
  };

  return (
    <Authcontext.Provider value={authData}>{children}</Authcontext.Provider>
  );
};

export default AuthProvider;
