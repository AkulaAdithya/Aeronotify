import { IoAirplaneSharp } from "react-icons/io5";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { HiOutlineClock, HiCheck } from "react-icons/hi";

const statusConfig = {
  "On Time":   { bg: "bg-success-500/15", text: "text-success-400", dot: "bg-success-400" },
  "Delayed":   { bg: "bg-warning-500/15", text: "text-warning-400", dot: "bg-warning-400" },
  "Cancelled": { bg: "bg-danger-500/15",  text: "text-danger-400",  dot: "bg-danger-400" },
  "Boarding":  { bg: "bg-primary-500/15", text: "text-primary-400", dot: "bg-primary-400" },
  "Departed":  { bg: "bg-accent-500/15",  text: "text-accent-400",  dot: "bg-accent-400" },
  "Landed":    { bg: "bg-success-500/15", text: "text-success-400", dot: "bg-success-400" },
};

const FlightCard = ({ flight, onTrack, isTracked }) => {
  const status = statusConfig[flight.status] || statusConfig["On Time"];

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group glass rounded-2xl p-5 hover:glow transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <IoAirplaneSharp className="text-white -rotate-45" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-wide">
              {flight.flightNumber}
            </h3>
            <p className="text-dark-400 text-xs">{flight.airline}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {flight.status}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 text-center">
          <MdFlightTakeoff className="text-primary-400 text-lg mx-auto mb-1" />
          <p className="text-white font-semibold text-sm">{flight.origin}</p>
          <p className="text-dark-400 text-xs mt-0.5">{formatTime(flight.departureTime)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex items-center gap-1">
            <div className="h-px flex-1 bg-dark-600" />
            <IoAirplaneSharp className="text-dark-400 text-xs" />
            <div className="h-px flex-1 bg-dark-600" />
          </div>
          <p className="text-dark-500 text-[10px] mt-1">{formatDate(flight.departureTime)}</p>
        </div>

        <div className="flex-1 text-center">
          <MdFlightLand className="text-accent-400 text-lg mx-auto mb-1" />
          <p className="text-white font-semibold text-sm">{flight.destination}</p>
          <p className="text-dark-400 text-xs mt-0.5">{formatTime(flight.arrivalTime)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
        <div className="flex items-center gap-1.5 text-dark-400">
          <HiOutlineClock className="text-sm" />
          <span className="text-xs">Gate: <span className="text-white font-semibold">{flight.gate}</span></span>
        </div>

        {onTrack && (
          <button
            onClick={() => onTrack(flight)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
              isTracked
                ? "bg-success-500/15 text-success-400 border border-success-500/30"
                : "gradient-primary text-white hover:opacity-90 hover:shadow-lg hover:shadow-primary-500/25"
            }`}
          >
            {isTracked ? (
              <>
                <HiCheck className="text-sm" />
                Tracking
              </>
            ) : (
              "Track"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
