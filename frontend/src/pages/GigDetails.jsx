import api from "../api/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000");

export default function GigDetails() {
  const { id } = useParams();
  const [bids, setBids] = useState([]);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [hiringLoading, setHiringLoading] = useState({});

  // Fetch all bids for this gig
  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/${id}`);
      setBids(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch bids");
    }
  };

  useEffect(() => {
    fetchBids();

    socket.on("hiredNotification", (data) => {
      if (data.gigId === id) {
        fetchBids();
        toast.info(`Real-time Notification: ${data.message}`);
      }
    });

    return () => socket.off("hiredNotification");
  }, [id]);

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

  const hire = async (bidId) => {
    setHiringLoading((prev) => ({ ...prev, [bidId]: true }));
    try {
      await api.patch(`/bids/${bidId}/hire`);
      socket.emit("hireGig", { bidId, gigId: id });
      toast.success("Freelancer hired successfully");
      fetchBids();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiringLoading((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-6 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600"
      >
        Gig Details & Bids
      </motion.h1>

      {/* Bid Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200 px-8 py-10 mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Place Your Bid
        </h2>
        {bidError && (
          <p className="text-red-500 text-center mb-4 font-medium">{bidError}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setBidError(""); }}
            placeholder="Bid Amount (₹)"
            className="w-full h-14 px-5 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setBidError(""); }}
            placeholder="Why should you be hired for this gig?"
            rows={3}
            className="w-full px-5 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <button
            onClick={submitBid}
            disabled={loading}
            className={`w-full h-14 rounded-xl font-bold text-white ${
              loading ? "bg-purple-300 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            {loading ? "Posting..." : "Submit Bid"}
          </button>
        </div>
      </motion.div>

      {/* Bids List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          All Bids
        </h2>
        {bids.length === 0 && (
          <p className="text-gray-500 text-center text-lg animate-pulse">
            No bids yet
          </p>
        )}

        <div className="grid gap-6">
          {bids.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-purple-200"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="text-gray-800 font-medium mb-2 line-clamp-4">{b.message}</p>
                <p className="text-purple-600 font-bold mb-1">₹ {b.price}</p>
                {b.freelancerName && <p className="text-gray-500 text-sm">Freelancer: {b.freelancerName}</p>}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  b.status === "hired" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {b.status}
                </span>
              </div>
              <button
                onClick={() => hire(b._id)}
                disabled={b.status !== "pending" || hiringLoading[b._id]}
                className={`px-6 py-2 rounded-xl font-semibold text-white ${
                  b.status === "pending" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
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
