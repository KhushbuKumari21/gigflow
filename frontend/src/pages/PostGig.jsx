import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostGig() {
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
      const res = await api.post("/gigs", gig);
      toast.success("Gig posted successfully!");

      // Clear form
      setGig({ title: "", description: "", budget: "" });

      // Navigate to homepage or gigs list
      navigate("/");

      // Optionally, you can pass new gig as state to home page
      // navigate("/", { state: { newGig: res.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to post gig");
      toast.error(err.response?.data?.msg || "Failed to post gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-4 pt-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md w-full max-w-lg rounded-3xl shadow-2xl border border-purple-200 px-6 sm:px-12 py-10 flex flex-col gap-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          Post a New Gig
        </h1>
        {error && <p className="text-red-500 text-center mb-2 font-medium">{error}</p>}

        <input
          type="text"
          placeholder="Gig Title (e.g. Build a React Website)"
          value={gig.title}
          onChange={(e) => setGig({ ...gig, title: e.target.value })}
          className="w-full h-14 px-5 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:shadow-md transition-all duration-200"
        />
        <textarea
          placeholder="Describe the gig requirements"
          rows={5}
          value={gig.description}
          onChange={(e) => setGig({ ...gig, description: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 resize-none focus:border-purple-500 shadow-sm hover:shadow-md transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Budget (₹)"
          value={gig.budget}
          onChange={(e) => setGig({ ...gig, budget: e.target.value })}
          className="w-full h-14 px-5 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:shadow-md transition-all duration-200"
        />
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full h-14 rounded-xl text-white font-bold text-lg transition-all duration-200 ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 hover:shadow-lg"
          }`}
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </motion.div>
    </div>
  );
}
