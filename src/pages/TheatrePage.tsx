import { useEffect, useState } from "react";
import { getTheatres } from "../api/theatreApi";
import Loader from "../components/common/Loader";
import { Theatre } from "../types/theatre";

const TheatresPage = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await getTheatres();
        setTheatres(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch theatres", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Theatres</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {theatres.map((theatre) => (
          <div
            key={theatre.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <h2 className="mb-2 text-xl font-semibold text-white">{theatre.name}</h2>
            <p className="mb-2 text-slate-400">{theatre.description || "No description available"}</p>
            <div className="text-sm text-slate-500">
              <p>{theatre.address}</p>
              <p>{theatre.city} - {theatre.pincode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatresPage;