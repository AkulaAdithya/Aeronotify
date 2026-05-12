import { useState, useEffect } from "react";
import { getAllFlights, trackFlight, untrackFlight } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FlightCard from "../components/FlightCard";
import toast from "react-hot-toast";
import { HiSearch, HiX } from "react-icons/hi";
import { IoAirplaneSharp } from "react-icons/io5";

const PassengerPortal = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { passenger } = useAuth();

  const statuses = ["All", "On Time", "Delayed", "Cancelled", "Boarding", "Departed", "Landed"];

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await getAllFlights();
      setFlights(res.data);
    } catch (error) {
      toast.error("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || flight.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Check if the logged-in passenger's email is in the flight's subscribers array
  const isFlightTracked = (flight) => {
    if (!passenger?.email) return false;
    return (flight.subscribers || []).includes(passenger.email.toLowerCase());
  };

  const handleTrack = async (flight) => {
    if (!passenger?.email) {
      toast.error("Please log in to track flights");
      return;
    }

    const alreadyTracked = isFlightTracked(flight);

    try {
      if (alreadyTracked) {
        await untrackFlight(flight._id, passenger.email);
        // Update local state — remove email from subscribers
        setFlights((prev) =>
          prev.map((f) =>
            f._id === flight._id
              ? { ...f, subscribers: f.subscribers.filter((e) => e !== passenger.email.toLowerCase()) }
              : f
          )
        );
        toast.success(`Stopped tracking ${flight.flightNumber}`);
      } else {
        await trackFlight(flight._id, passenger.email);
        // Update local state — add email to subscribers
        setFlights((prev) =>
          prev.map((f) =>
            f._id === flight._id
              ? { ...f, subscribers: [...(f.subscribers || []), passenger.email.toLowerCase()] }
              : f
          )
        );
        toast.success(`Now tracking ${flight.flightNumber}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update tracking";
      toast.error(msg);
    }
  };

  // Count tracked flights
  const trackedCount = flights.filter((f) => isFlightTracked(f)).length;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 gradient-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Flight <span className="text-gradient">Board</span>
          </h1>
          <p className="text-dark-400 max-w-lg mx-auto">
            Search for your flight and click Track to start monitoring it for gate changes and delays.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="glass rounded-2xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Search by flight number, airline, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors cursor-pointer"
                >
                  <HiX size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    filterStatus === status
                      ? "gradient-primary text-white shadow-lg shadow-primary-500/20"
                      : "bg-dark-800/50 text-dark-400 hover:text-white hover:bg-dark-700/50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-dark-400 text-sm">
            Showing <span className="text-white font-semibold">{filteredFlights.length}</span> flight{filteredFlights.length !== 1 ? "s" : ""}
          </p>
          {trackedCount > 0 && (
            <p className="text-success-400 text-sm">
              Tracking <span className="font-semibold">{trackedCount}</span> flight{trackedCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Flight Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : filteredFlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights.map((flight) => (
              <FlightCard
                key={flight._id}
                flight={flight}
                onTrack={handleTrack}
                isTracked={isFlightTracked(flight)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
              <IoAirplaneSharp className="text-dark-500 text-2xl" />
            </div>
            <p className="text-dark-400 text-lg mb-1">No flights found</p>
            <p className="text-dark-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerPortal;
