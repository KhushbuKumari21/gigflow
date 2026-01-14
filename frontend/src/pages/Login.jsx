import api from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      dispatch(setUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center
                    bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100
                    px-4 pt-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md
                   rounded-3xl shadow-2xl
                   px-6 sm:px-10 py-12
                   border border-gray-100
                   hover:shadow-purple-200 transition-shadow duration-300
                   box-border"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-extrabold text-center
                     text-transparent bg-clip-text
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     mb-10"
        >
          Welcome Back
        </motion.h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-5 font-medium">{error}</p>
        )}

        {/* Email */}
        <motion.input
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full h-14 px-4 sm:px-5 mb-5
                     border border-gray-300 rounded-2xl
                     bg-gray-50 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-all duration-200 hover:shadow-md
                     box-border"
        />

        {/* Password */}
        <motion.input
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full h-14 px-4 sm:px-5 mb-6
                     border border-gray-300 rounded-2xl
                     bg-gray-50 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-all duration-200 hover:shadow-md
                     box-border"
        />

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={submit}
          disabled={loading}
          className={`w-full h-14 rounded-2xl
                      text-white font-semibold tracking-wide text-lg
                      transition-all duration-200
                      ${
                        loading
                          ? "bg-purple-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 hover:shadow-lg"
                      }`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 mt-6"
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
