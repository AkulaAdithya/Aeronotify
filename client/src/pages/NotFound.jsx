import { Link } from "react-router-dom";
import { IoAirplaneSharp } from "react-icons/io5";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mx-auto mb-6 animate-float">
          <IoAirplaneSharp className="text-primary-400 text-3xl rotate-45" />
        </div>
        <h1 className="text-7xl font-extrabold text-gradient mb-4">404</h1>
        <p className="text-xl text-dark-300 mb-2">Flight Not Found</p>
        <p className="text-dark-500 text-sm mb-8 max-w-md mx-auto">
          The page you're looking for seems to have departed without you.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
