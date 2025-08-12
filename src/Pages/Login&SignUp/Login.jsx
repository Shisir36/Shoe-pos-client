import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShoePrints } from "react-icons/fa";
import Swal from "sweetalert2";
import { Authcontext } from "../../Provider/AuthContext";

const Login = () => {
  const { signIn } = useContext(Authcontext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);

      const res = await fetch(
        `https://shoes-pos-server.vercel.app/api/users/${email}`
      );
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();

      if (data?.role === "admin") {
        localStorage.setItem("role", "admin");
        Swal.fire("Welcome!", "Login Successful! Welcome Admin!", "success");
        navigate(from, { replace: true });
      } else {
        localStorage.removeItem("role");
        Swal.fire(
          "Access Denied",
          "You are not authorized to access the admin panel.",
          "error"
        );
        setError("You do not have admin access.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background sneaker image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sneaker Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 grid md:grid-cols-2 overflow-hidden">
        {/* Left Section - Brand */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-yellow-400 to-orange-500 relative">
          <FaShoePrints className="text-white text-7xl mb-4" />
          <h2 className="text-white text-4xl font-extrabold tracking-wide">
            Sneaker POS
          </h2>
          <p className="text-white/90 mt-4 text-center text-lg">
            Manage your shoe store like a pro — track inventory, sales, and more!
          </p>
          <img
            src="https://images.unsplash.com/photo-1584734484941-1ff360f3e3c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Sneaker"
            className="w-72 mt-8 drop-shadow-2xl animate-bounce"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6">Login to Your Store</h2>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-300 p-4 rounded-xl text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/80 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-5 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold shadow-lg transform hover:scale-[1.02] transition"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p className="text-white/60 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 hover:underline font-bold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
