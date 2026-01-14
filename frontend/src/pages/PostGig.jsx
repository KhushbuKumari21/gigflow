import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
      await api.post("/gigs", gig);
      alert("Gig posted successfully");
      navigate("/");
    } catch (err) {
      setError("Failed to post gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center
                    bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100
                    px-4 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md w-full max-w-lg
                   rounded-3xl shadow-2xl border border-gray-200
                   px-6 sm:px-12 py-10 flex flex-col items-stretch gap-6 box-border"
      >
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center
                       text-transparent bg-clip-text
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       mb-6">
          Post a New Gig
        </h1>

        {/* Subheading / Instruction */}
        <p className="text-gray-600 text-center mb-4">
          Add a new gig by filling out the form below
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-2">{error}</p>
        )}

        {/* Title Input */}
        <input
          type="text"
          placeholder="Gig title (e.g. Build a React Website)"
          value={gig.title}
          onChange={(e) => setGig({ ...gig, title: e.target.value })}
          className="w-full h-14 px-5 rounded-2xl border border-gray-300
                     bg-white shadow-md focus:outline-none focus:ring-2
                     focus:ring-purple-500 focus:border-purple-500
                     transition-all duration-300 hover:shadow-xl box-border"
        />

        {/* Description Input */}
        <textarea
          placeholder="Describe the gig requirements in detail"
          rows={5}
          value={gig.description}
          onChange={(e) => setGig({ ...gig, description: e.target.value })}
          className="w-full px-5 py-4 rounded-2xl border border-gray-300
                     bg-white shadow-md resize-none focus:outline-none
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                     transition-all duration-300 hover:shadow-xl box-border"
        />

        {/* Budget Input */}
        <input
          type="number"
          placeholder="Budget (₹)"
          value={gig.budget}
          onChange={(e) => setGig({ ...gig, budget: e.target.value })}
          className="w-full h-14 px-5 rounded-2xl border border-gray-300
                     bg-white shadow-md focus:outline-none focus:ring-2
                     focus:ring-purple-500 focus:border-purple-500
                     transition-all duration-300 hover:shadow-xl box-border"
        />

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full h-14 rounded-2xl text-white font-semibold text-lg
                      transition-all duration-300 transform
                      ${loading
                        ? "bg-purple-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:scale-105"
                      } box-border`}
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </motion.div>
    </div>
  );
}
