import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getShows } from "../api/showApi";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { Show } from "../types/show";

const ShowsPage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

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
              <span className="text-lg font-semibold text-white">{show.timing}</span>
              <span className="text-rose-600 font-bold">₹{show.price}</span>
            </div>
            
            <div className="mb-4 space-y-1 text-sm text-slate-400">
              <p>Seats Available: {show.noOfSeats}</p>
              {show.format && <p>Format: {show.format}</p>}
            </div>

            <Link to="/bookings">
              <Button className="w-full">Book Now</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowsPage;