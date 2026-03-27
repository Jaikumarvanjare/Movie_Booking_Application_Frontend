import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const HomePage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-5xl font-bold text-white">Welcome to CineBook</h1>
      <p className="mb-8 max-w-2xl text-slate-400">
        Browse movies, explore theatres, view shows, create bookings, and manage
        payments in one place.
      </p>
      <div className="flex gap-4">
        <Link to="/movies">
          <Button variant="primary">Explore Movies</Button>
        </Link>
        <Link to="/signup">
          <Button variant="secondary">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;