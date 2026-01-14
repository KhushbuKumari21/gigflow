import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostGig({ addGigToList }) {
  const navigate = useNavigate();
  const [gig, setGig] = useState({ title: "", description: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!gig.title || !gig.description || !gig.budget) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...gig, budget: Number(gig.budget) };
      const res = await api.post("/gigs", payload, { withCredentials: true });

      toast.success("Gig posted successfully!");
      setGig({ title: "", description: "", budget: "" });

      if (addGigToList) addGigToList(res.data);
      navigate("/gigs");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to post gig");
      toast.error(err.response?.data?.msg || "Failed to post gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-4 pt-12 overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md w-full max-w-lg rounded-3xl shadow-2xl
        border border-purple-200 px-5 sm:px-10 py-10 flex flex-col gap-6
        overflow-hidden box-border"
      >
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Post a New Gig
        </h1>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="Gig Title (e.g. Build a React Website)"
          value={gig.title}
          onChange={(e) => setGig({ ...gig, title: e.target.value })}
          className="w-full max-w-full min-w-0 h-14 px-4 rounded-xl
          border border-purple-300 box-border
          focus:ring-2 focus:ring-purple-500 focus:ring-offset-0
          focus:border-purple-500 outline-none
          transition-all"
        />

        {/* Description */}
        <textarea
          placeholder="Describe the gig requirements"
          rows={5}
          value={gig.description}
          onChange={(e) => setGig({ ...gig, description: e.target.value })}
          className="w-full max-w-full min-w-0 px-4 py-3 rounded-xl
          border border-purple-300 box-border resize-none
          focus:ring-2 focus:ring-purple-500 focus:ring-offset-0
          focus:border-purple-500 outline-none
          transition-all"
        />

        {/* Budget */}
        <input
          type="number"
          placeholder="Budget (₹)"
          value={gig.budget}
          onChange={(e) => setGig({ ...gig, budget: e.target.value })}
          className="w-full max-w-full min-w-0 h-14 px-4 rounded-xl
          border border-purple-300 box-border
          focus:ring-2 focus:ring-purple-500 focus:ring-offset-0
          focus:border-purple-500 outline-none
          transition-all"
        />

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full h-14 rounded-xl text-white font-bold text-lg
          transition-all ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
          }`}
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </motion.div>
    </div>
  );
}
