import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Authcontext } from "../../Provider/AuthContext";

const Signup = () => {
  const { createUser, updateUserProfile } = useContext(Authcontext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = form.photo.value || "";

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photo);

      const userInfo = {
        name,
        email,
        photo,
        role: "user",
      };

      await fetch("https://shoes-pos-server.vercel.app/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "You have successfully signed up.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side image */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-black to-gray-900 items-center justify-center p-6">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
          alt="Shoes"
          className="max-w-md rounded-lg shadow-lg"
        />
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-6">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Step Into Style
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Create your account & start shopping
          </p>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <input
            type="text"
            name="photo"
            placeholder="Photo URL (optional)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="bg-black text-white p-3 w-full rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
