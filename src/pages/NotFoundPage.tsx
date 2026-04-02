import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="mb-6 text-8xl animate-float">🎬</div>
      <h1 className="mb-3 text-6xl font-extrabold text-gradient">404</h1>
      <p className="mb-8 text-xl text-slate-400">This page doesn't exist in our reel</p>
      <Link to="/">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;