import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold text-rose-600">404</h1>
      <p className="mb-8 text-xl text-slate-400">Page Not Found</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;