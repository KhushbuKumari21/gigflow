import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import PostGig from "./pages/PostGig";
import GigDetails from "./pages/GigDetails";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6">
        <Routes>
          <Route path="/" element={<Gigs />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/post-gig"
            element={
              <ProtectedRoute>
                <PostGig />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gig/:id"
            element={
              <ProtectedRoute>
                <GigDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
