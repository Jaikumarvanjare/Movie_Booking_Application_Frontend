import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { appRoutes } from "../../utils/routes";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.userRole === "ADMIN";
  const isAdminOrClient = isAdmin || user?.userRole === "CLIENT";

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`));

  const navLinkClass = (path: string) =>
    `transition-colors duration-200 ${
      isActive(path) ? "font-semibold text-brand" : "text-slate-300 hover:text-white"
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800/50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to={appRoutes.home} className="text-2xl font-extrabold text-gradient" onClick={closeMobile}>
          CineBook
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link to={appRoutes.movies} className={navLinkClass(appRoutes.movies)}>Movies</Link>
          <Link to={appRoutes.theatres} className={navLinkClass(appRoutes.theatres)}>Theatres</Link>
          <Link to={appRoutes.shows} className={navLinkClass(appRoutes.shows)}>Shows</Link>

          {isAuthenticated ? (
            <>
              <Link to={appRoutes.bookings} className={navLinkClass(appRoutes.bookings)}>Bookings</Link>
              <Link to={appRoutes.payments} className={navLinkClass(appRoutes.payments)}>Payments</Link>

              {isAdminOrClient && (
                <div className="group relative">
                  <button className="flex items-center gap-1 text-brand-400 hover:text-brand-300">
                    Admin
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full mt-2 hidden w-56 animate-fade-in-down rounded-xl border border-slate-700/50 bg-slate-900 p-1.5 shadow-2xl group-hover:block">
                    <Link to={appRoutes.adminMovies} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Manage Movies</Link>
                    <Link to={appRoutes.adminTheatres} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Manage Theatres</Link>
                    <Link to={appRoutes.adminShows} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Manage Shows</Link>
                    {isAdmin && (
                      <Link to={appRoutes.adminUsers} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Admin Users</Link>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-400">{user?.name}</span>
                <button
                  onClick={logout}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-red-600/20 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
              <Link to={appRoutes.signIn} className="text-slate-300 transition hover:text-white">Sign In</Link>
              <Link
                to={appRoutes.signUp}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:shadow-brand/40"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 md:hidden"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in-down border-t border-slate-800/50 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link to={appRoutes.movies} className={navLinkClass(appRoutes.movies)} onClick={closeMobile}>Movies</Link>
            <Link to={appRoutes.theatres} className={navLinkClass(appRoutes.theatres)} onClick={closeMobile}>Theatres</Link>
            <Link to={appRoutes.shows} className={navLinkClass(appRoutes.shows)} onClick={closeMobile}>Shows</Link>

            {isAuthenticated ? (
              <>
                <Link to={appRoutes.bookings} className={navLinkClass(appRoutes.bookings)} onClick={closeMobile}>Bookings</Link>
                <Link to={appRoutes.payments} className={navLinkClass(appRoutes.payments)} onClick={closeMobile}>Payments</Link>

                {isAdminOrClient && (
                  <div className="border-t border-slate-800 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Admin</p>
                    <Link to={appRoutes.adminMovies} className="block py-1.5 text-slate-400 hover:text-white" onClick={closeMobile}>Manage Movies</Link>
                    <Link to={appRoutes.adminTheatres} className="block py-1.5 text-slate-400 hover:text-white" onClick={closeMobile}>Manage Theatres</Link>
                    <Link to={appRoutes.adminShows} className="block py-1.5 text-slate-400 hover:text-white" onClick={closeMobile}>Manage Shows</Link>
                    {isAdmin && (
                      <Link to={appRoutes.adminUsers} className="block py-1.5 text-slate-400 hover:text-white" onClick={closeMobile}>Admin Users</Link>
                    )}
                  </div>
                )}

                <div className="border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{user?.name}</span>
                    <button
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                      className="rounded-lg bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-600/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-3 border-t border-slate-800 pt-3">
                <Link to={appRoutes.signIn} className="flex-1 rounded-xl border border-slate-700 py-2 text-center text-slate-300 transition hover:bg-slate-800" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to={appRoutes.signUp} className="flex-1 rounded-xl bg-gradient-to-r from-brand to-brand-500 py-2 text-center font-semibold text-white" onClick={closeMobile}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
