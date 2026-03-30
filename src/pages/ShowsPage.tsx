import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getShows } from "../api/showApi";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { Show } from "../types/show";

const ShowsPage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await getShows();
        setShows(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch shows", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Available Shows</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shows.map((show) => (
          <div
            key={show.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-white">
                {new Date(show.timing).toLocaleDateString()}
              </span>
              <span className="rounded bg-rose-600/20 px-2 py-1 text-sm font-bold text-rose-600">
                ₹{show.price}
              </span>
            </div>
            
            <p className="mb-1 text-sm text-slate-400">
              Time: {new Date(show.timing).toLocaleTimeString()}
            </p>
            <p className="mb-4 text-sm text-slate-400">
              Seats Available: {show.noOfSeats}
            </p>

            {isAuthenticated ? (
              <Link
                to={`/shows/${show.id}/book`}
                className="block w-full rounded-lg bg-rose-600 py-2 text-center font-medium text-white hover:bg-rose-700"
              >
                Book Now
              </Link>
            ) : (
              <Link
                to="/signin"
                className="block w-full rounded-lg bg-slate-700 py-2 text-center font-medium text-slate-300 hover:bg-slate-600"
              >
                Sign in to Book
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowsPage;