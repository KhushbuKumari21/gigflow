import api from "../api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/gigs?search=${search}`)
      .then((res) => setGigs(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white px-6 py-16">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16
                   text-transparent bg-clip-text
                   bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700"
      >
        Discover Freelance Gigs
      </motion.h1>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full mx-auto mb-16"
      >
        <input
          type="text"
          placeholder="Search by title, skill, or keyword"
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 px-6 rounded-full border border-gray-300
                     bg-white shadow-lg placeholder-gray-400 text-gray-700
                     font-medium text-lg focus:outline-none focus:ring-2
                     focus:ring-purple-500 hover:shadow-2xl transition-all duration-300
                     box-border"
        />
      </motion.div>

      {/* Loading / Empty */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse text-lg">
          Loading gigs...
        </p>
      )}
      {!loading && gigs.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No gigs found
        </p>
      )}

      {/* Gig Cards */}
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {gigs.map((g, i) => (
          <motion.div
            key={g._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/gig/${g._id}`}>
              <div className="group relative bg-white rounded-3xl p-8 h-full
                              shadow-lg hover:shadow-2xl border border-gray-100
                              overflow-hidden transition-all duration-300
                              transform hover:-translate-y-2 hover:scale-105">

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-25
                                transition-all duration-300
                                bg-gradient-to-br from-purple-100 via-transparent to-indigo-100
                                rounded-3xl"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3
                                 group-hover:text-purple-700 transition-all duration-300">
                    {g.title}
                  </h2>

                  <p className="text-gray-600 text-sm md:text-base leading-relaxed
                                line-clamp-3 mb-8">
                    {g.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-purple-600 font-bold text-lg md:text-xl">
                      ₹ {g.budget}
                    </span>

                    <span className="px-4 py-1.5 text-xs md:text-sm font-semibold
                                     text-green-700 bg-green-100 rounded-full
                                     shadow-sm">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
