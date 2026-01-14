import api from "../api/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start
                    bg-gradient-to-br from-purple-200 via-purple-100 to-white
                    px-4 pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md
                   bg-white/80 backdrop-blur-md
                   rounded-3xl shadow-2xl border border-purple-200
                   px-6 sm:px-10 py-10
                   box-border"
      >
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold
                       text-center text-purple-700 mb-8
                       bg-clip-text text-transparent
                       bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          Create Account
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-5 font-medium">{error}</p>
        )}

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full h-14 mb-4 px-5 rounded-2xl border border-purple-300
                     bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500
                     focus:border-purple-500 shadow-sm hover:shadow-md
                     transition-all duration-200 box-border placeholder-purple-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full h-14 mb-4 px-5 rounded-2xl border border-purple-300
                     bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500
                     focus:border-purple-500 shadow-sm hover:shadow-md
                     transition-all duration-200 box-border placeholder-purple-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full h-14 mb-6 px-5 rounded-2xl border border-purple-300
                     bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500
                     focus:border-purple-500 shadow-sm hover:shadow-md
                     transition-all duration-200 box-border placeholder-purple-400"
        />

        {/* Register Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full h-14 rounded-2xl text-white font-bold text-lg transition-all duration-200 ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : `bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg shadow-md`
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-700 font-semibold hover:text-purple-900 transition-colors"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
