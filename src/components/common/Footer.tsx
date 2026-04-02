import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-gradient">
              CineBook
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Your premium movie booking experience. Browse movies, explore theatres,
              and book shows instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/movies" className="transition hover:text-white">Movies</Link></li>
              <li><Link to="/theatres" className="transition hover:text-white">Theatres</Link></li>
              <li><Link to="/shows" className="transition hover:text-white">Shows</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/bookings" className="transition hover:text-white">My Bookings</Link></li>
              <li><Link to="/payments" className="transition hover:text-white">Payments</Link></li>
              <li><Link to="/signin" className="transition hover:text-white">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/50 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CineBook. Built with ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;
