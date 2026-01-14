import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { FiLogIn, FiLogOut, FiPlus } from "react-icons/fi";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation(); // to highlight active link

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white/20 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-purple-700 tracking-wider hover:scale-105 transition-transform"
        >
          GigFlow
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Post Gig button (only if user logged in) */}
          {user && (
            <Link
              to="/post-gig"
              className="flex items-center gap-2 text-purple-700 font-medium px-5 py-2 rounded-full hover:bg-purple-700 hover:text-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <FiPlus size={18} /> Post Gig
            </Link>
          )}

          {/* Login/Register (if no user) */}
          {!user ? (
            <div className="flex items-center gap-16">
              {" "}
              {/* gap-6 adds space between Login and Register */}
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-2 text-purple-700 font-medium rounded-md transition-colors hover:text-purple-900 ${
                  isActive("/login") ? "text-purple-900 font-semibold" : ""
                }`}
              >
                <FiLogIn size={18} /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-purple-700 text-white font-medium px-5 py-2 rounded-full shadow-lg hover:bg-purple-800 hover:scale-105 hover:shadow-xl transition-transform"
              >
                Register
              </Link>
            </div>
          ) : (
            // Logout button if user is logged in
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 bg-purple-700 text-white font-medium px-5 py-2 rounded-full shadow-lg hover:bg-purple-800 hover:scale-105 hover:shadow-xl transition-transform"
            >
              <FiLogOut size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
