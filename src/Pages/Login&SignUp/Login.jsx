import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Authcontext } from "../../Provider/AuthContext";

const Login = () => {
  const { signIn } = useContext(Authcontext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();

      if (data?.role === "admin") {
        localStorage.setItem("role", "admin"); // ✅ save role
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome Admin!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      } else {
        localStorage.removeItem("role"); // clean up just in case
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not authorized to access the admin panel.",
          timer: 2000,
          showConfirmButton: false,
        });
        setError("You do not have admin access.");
      }
      if (data?.role === "admin") {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome Admin!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true }); // redirect to previous or /home
      } else {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not authorized to access the admin panel.",
          timer: 2000,
          showConfirmButton: false,
        });
        setError("You do not have admin access.");
      }
    } catch (err) {
      setError(
        "Invalid email or password." + (err.message ? `: ${err.message}` : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 border rounded"
          disabled={loading}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded"
            disabled={loading}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 w-full rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
