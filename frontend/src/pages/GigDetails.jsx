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

  // Fetch all bids for this gig
  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/${id}`);
      setBids(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to fetch bids");
    }
  };

  useEffect(() => {
    fetchBids();

    // Listen for hire notifications
    socket.on("hiredNotification", (data) => {
      if (data.gigId === id) {
        fetchBids();
        toast.info(data.message);
      }
    });

    return () => socket.off("hiredNotification");
  }, [id]);

  // Submit or update bid
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
        toast.success("Bid updated successfully");

        setBids((prev) =>
          prev.map((b) =>
            b._id === editingBidId
              ? { ...b, price: res.data.price, message: res.data.message }
              : b
          )
        );
        setEditingBidId(null);
      } else {
        const res = await api.post("/bids", { gigId: id, price, message });
        toast.success("Bid placed successfully");
        setBids((prev) => [...prev, res.data]);
      }

      setPrice("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setBidError(err.response?.data?.msg || "Failed to submit bid");
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
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to hire freelancer");
    } finally {
      setHiringLoading((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  // Edit bid
  const editBid = (bid) => {
    setPrice(bid.price);
    setMessage(bid.message);
    setEditingBidId(bid._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete bid
  const deleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;

    try {
      await api.delete(`/bids/${bidId}`);
      toast.success("Bid deleted successfully");
      setBids((prev) => prev.filter((b) => b._id !== bidId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to delete bid");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-4 py-6 overflow-y-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-6
                   text-transparent bg-clip-text bg-gradient-to-r
                   from-purple-700 to-indigo-600"
      >
        Gig Bids
      </motion.h1>

      {/* Bid Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl
                   rounded-3xl shadow-2xl border border-purple-200
                   px-6 sm:px-10 py-8 mb-12 overflow-visible"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {editingBidId ? "Edit Your Bid" : "Place Your Bid"}
        </h2>

        {bidError && (
          <p className="text-red-500 text-center mb-4 font-medium">{bidError}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Your bid amount (₹)"
            className="w-full h-12 px-4 rounded-2xl border-2 border-purple-300
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       focus:border-purple-500 shadow-sm text-lg"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why should you be hired for this gig?"
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border-2 border-purple-300
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       focus:border-purple-500 shadow-sm text-lg resize-none"
          />

          <button
            onClick={submitBid}
            disabled={loading}
            className="w-full h-12 rounded-2xl font-bold text-white text-lg
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       hover:from-purple-700 hover:to-indigo-700 transition-all"
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

        {bids.length === 0 && (
          <p className="text-center text-gray-500">No bids yet</p>
        )}

        <div className="grid gap-4">
          {bids.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-md px-4 py-4
                         flex flex-col md:flex-row justify-between
                         border-2 border-purple-200 items-start md:items-center"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="text-lg font-medium mb-1">{b.message}</p>
                <p className="text-purple-600 font-bold">₹ {b.price}</p>
                <span className="text-sm capitalize">{b.status}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={b.status !== "pending" || hiringLoading[b._id]}
                  onClick={() => hire(b._id)}
                  className={`px-3 py-1 rounded-2xl text-white font-semibold ${
                    b.status === "pending"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {hiringLoading[b._id] ? "Hiring..." : "Hire"}
                </button>

                <button
                  onClick={() => editBid(b)}
                  className="px-3 py-1 rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBid(b._id)}
                  className="px-3 py-1 rounded-2xl bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
