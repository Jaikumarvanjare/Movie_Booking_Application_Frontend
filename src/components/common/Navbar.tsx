import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-rose-600">
          CineBook
        </Link>

        <div className="flex items-center gap-6 text-sm text-slate-200">
          <Link to="/movies" className="hover:text-white">Movies</Link>
          <Link to="/theatres" className="hover:text-white">Theatres</Link>
          <Link to="/shows" className="hover:text-white">Shows</Link>

          {isAuthenticated ? (
            <>
              <Link to="/bookings" className="hover:text-white">Bookings</Link>
              <Link to="/payments" className="hover:text-white">Payments</Link>
              <span className="text-slate-400">{user?.name}</span>
              <button
                onClick={logout}
                className="rounded bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-white">Sign In</Link>
              <Link 
                to="/signup" 
                className="rounded bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;