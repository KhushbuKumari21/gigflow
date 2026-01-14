import api from "../api/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Connect to Socket.io server
const socket = io("http://localhost:5000");

export default function GigDetails() {
  const { id } = useParams();
  const [bids, setBids] = useState([]);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [hiringLoading, setHiringLoading] = useState({});

  // Fetch bids
  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/${id}`);
      setBids(res.data);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      toast.error(err.response?.data?.message || "Failed to fetch bids");
    }
  };

  useEffect(() => {
    fetchBids();

    // Real-time notifications
    socket.on("hiredNotification", (data) => {
      if (data.gigId === id) {
        fetchBids();
        toast.info(`Real-time Notification: ${data.message}`);
      }
    });

    return () => socket.off("hiredNotification");
  }, [id]);

  // Submit a new bid
  const submitBid = async () => {
    if (!price || !message) {
      setBidError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setBidError("");
      await api.post("/bids", { gigId: id, price, message });
      setPrice("");
      setMessage("");
      toast.success("Bid placed successfully");
      fetchBids();
    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  // Hire freelancer
  const hire = async (bidId) => {
    setHiringLoading((prev) => ({ ...prev, [bidId]: true }));
    try {
      await api.patch(`/bids/${bidId}/hire`);
      socket.emit("hireGig", { bidId, gigId: id });
      toast.success("Freelancer hired successfully");

      setBids((prev) =>
        prev.map((b) =>
          b._id === bidId
            ? { ...b, status: "hired" }
            : { ...b, status: b.status === "pending" ? "rejected" : b.status }
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiringLoading((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-6 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-14
                   text-transparent bg-clip-text
                   bg-gradient-to-r from-purple-700 to-indigo-600 drop-shadow-lg"
      >
        Gig Details & Bids
      </motion.h1>

      {/* Bid Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl
                   rounded-3xl shadow-2xl border border-purple-200
                   px-10 py-12 mb-16 hover:shadow-purple-400 transition-all duration-500"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center tracking-wide">
          Place Your Bid
        </h2>

        {bidError && (
          <p className="text-red-500 text-center mb-6 font-medium animate-shake">
            {bidError}
          </p>
        )}

        {/* Inputs & Button */}
        <div className="flex flex-col gap-6">
          {/* Price Input */}
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder=" "
              className="peer w-full h-14 min-h-[56px] px-5 rounded-2xl border-2 border-purple-300
                         bg-white/95 focus:bg-white focus:outline-none focus:ring-2
                         focus:ring-purple-500 focus:border-purple-500 shadow-md
                         hover:shadow-lg transition-all duration-300 font-medium text-lg"
            />
            <label
              className={`absolute left-5 text-gray-400 text-lg transition-all duration-300
                          ${price ? "-top-3 text-purple-600 text-sm" : "top-1/2 -translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg"}`}
            >
              Your bid amount (₹)
            </label>
          </div>

          {/* Message Textarea with placeholder */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why should you be hired for this gig?"
            rows={3}
            className="w-full px-5 py-4 rounded-2xl border-2 border-purple-300
                       bg-white/95 focus:bg-white focus:outline-none focus:ring-2
                       focus:ring-purple-500 focus:border-purple-500 shadow-md
                       hover:shadow-lg transition-all duration-300 font-medium text-lg resize-none"
          />

          {/* Submit Button */}
          <button
            onClick={submitBid}
            disabled={loading}
            className="w-full h-14 rounded-2xl font-bold text-white text-lg
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       hover:from-purple-700 hover:to-indigo-700
                       shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                       transition-all duration-300"
          >
            {loading ? "Posting..." : "Submit Bid"}
          </button>
        </div>
      </motion.div>

      {/* Bids List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          All Bids
        </h2>

        {bids.length === 0 && (
          <p className="text-gray-500 text-center text-lg animate-pulse">
            No bids yet
          </p>
        )}

        <div className="grid gap-6">
          {bids.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl
                         px-6 py-6 flex flex-col md:flex-row justify-between
                         items-stretch transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 min-h-[120px]"
            >
              <div className="flex-1 mb-4 md:mb-0 max-w-md overflow-hidden">
                <p className="font-medium text-gray-800 mb-2 text-lg line-clamp-4">
                  {b.message}
                </p>
                <p className="text-purple-600 font-bold text-lg mb-1">₹ {b.price}</p>
                {b.freelancerName && (
                  <p className="text-gray-500 mb-2 text-sm">Freelancer: {b.freelancerName}</p>
                )}
                <span
                  className={`inline-block px-4 py-1.5 text-xs md:text-sm font-semibold rounded-full shadow-sm ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "hired"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <button
                disabled={b.status !== "pending" || hiringLoading[b._id]}
                onClick={() => hire(b._id)}
                className={`px-6 py-2 rounded-2xl font-semibold text-white
                            transition-all duration-300 ${
                              b.status === "pending"
                                ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
              >
                {hiringLoading[b._id] ? "Hiring..." : "Hire"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
