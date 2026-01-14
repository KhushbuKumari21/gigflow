import api from "../api/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../socket";

export default function GigDetails() {
  const { id } = useParams();

  const [bids, setBids] = useState([]);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [hiringLoading, setHiringLoading] = useState({});
  const [editingBidId, setEditingBidId] = useState(null);

  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/${id}`);
      setBids(res.data);
    } catch {
      toast.error("Failed to fetch bids");
    }
  };

  useEffect(() => {
    fetchBids();

    socket.on("hiredNotification", (data) => {
      if (data.gigId === id) {
        fetchBids();
        toast.info(data.message);
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

      if (editingBidId) {
        const res = await api.patch(`/bids/${editingBidId}`, { price, message });
        toast.success("Bid updated");

        setBids((prev) =>
          prev.map((b) =>
            b._id === editingBidId ? { ...b, ...res.data } : b
          )
        );
        setEditingBidId(null);
      } else {
        const res = await api.post("/bids", { gigId: id, price, message });
        toast.success("Bid placed");
        setBids((prev) => [...prev, res.data]);
      }

      setPrice("");
      setMessage("");
    } catch {
      setBidError("Failed to submit bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-4 py-12 overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600"
      >
        Gig Bids
      </motion.h1>

      {/* Bid Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl
        rounded-3xl shadow-2xl border border-purple-200
        px-6 sm:px-10 py-10 mb-16 overflow-hidden box-border"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {editingBidId ? "Edit Your Bid" : "Place Your Bid"}
        </h2>

        {bidError && (
          <p className="text-red-500 text-center mb-4">{bidError}</p>
        )}

        <div className="flex flex-col gap-6">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Your bid amount (₹)"
            className="w-full max-w-full min-w-0 h-14 px-4
            rounded-2xl border-2 border-purple-300 box-border
            focus:outline-none focus:ring-2 focus:ring-purple-500
            focus:ring-offset-0 focus:border-purple-500"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why should you be hired for this gig?"
            rows={4}
            className="w-full max-w-full min-w-0 px-4 py-3
            rounded-2xl border-2 border-purple-300 box-border
            resize-none focus:outline-none focus:ring-2
            focus:ring-purple-500 focus:ring-offset-0
            focus:border-purple-500"
          />

          <button
            onClick={submitBid}
            disabled={loading}
            className="w-full h-14 rounded-2xl font-bold text-white
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:opacity-90 transition-all"
          >
            {loading
              ? "Submitting..."
              : editingBidId
              ? "Update Bid"
              : "Submit Bid"}
          </button>
        </div>
      </motion.div>

      {/* Bids List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">All Bids</h2>

        <div className="grid gap-6">
          {bids.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl shadow-lg px-6 py-6
              flex flex-col md:flex-row justify-between
              border border-purple-200"
            >
              <div>
                <p className="font-medium">{b.message}</p>
                <p className="text-purple-600 font-bold">₹ {b.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
