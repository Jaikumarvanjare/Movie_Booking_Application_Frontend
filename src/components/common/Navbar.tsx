import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const isAdminOrClient = user?.userRole === "ADMIN" || user?.userRole === "CLIENT";

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
              
              {/* Admin Menu */}
              {isAdminOrClient && (
                <div className="group relative">
                  <button className="text-rose-400 hover:text-rose-300">
                    Admin ▼
                  </button>
                  <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl group-hover:block">
                    <Link to="/admin/movies/create" className="block px-3 py-2 hover:bg-slate-800">Add Movie</Link>
                    <Link to="/admin/theatres/create" className="block px-3 py-2 hover:bg-slate-800">Add Theatre</Link>
                    <Link to="/admin/shows/create" className="block px-3 py-2 hover:bg-slate-800">Add Show</Link>
                  </div>
                </div>
              )}

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