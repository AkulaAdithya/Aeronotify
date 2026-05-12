import { HiPencil, HiTrash } from "react-icons/hi";

const statusConfig = {
  "On Time":   { bg: "bg-success-500/15", text: "text-success-400" },
  "Delayed":   { bg: "bg-warning-500/15", text: "text-warning-400" },
  "Cancelled": { bg: "bg-danger-500/15",  text: "text-danger-400" },
  "Boarding":  { bg: "bg-primary-500/15", text: "text-primary-400" },
  "Departed":  { bg: "bg-accent-500/15",  text: "text-accent-400" },
  "Landed":    { bg: "bg-success-500/15", text: "text-success-400" },
};

const FlightTable = ({ flights, onEdit, onDelete }) => {
  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-400 text-lg">No flights found</p>
        <p className="text-dark-500 text-sm mt-1">Create your first flight to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-700/50">
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Flight</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Airline</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Route</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Departure</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Arrival</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Gate</th>
            <th className="text-left py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-dark-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => {
            const status = statusConfig[flight.status] || statusConfig["On Time"];
            return (
              <tr
                key={flight._id}
                className="border-b border-dark-800/50 hover:bg-white/[0.02] transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-4 text-white font-bold tracking-wide">{flight.flightNumber}</td>
                <td className="py-3 px-4 text-dark-300">{flight.airline}</td>
                <td className="py-3 px-4 text-dark-300">
                  {flight.origin} → {flight.destination}
                </td>
                <td className="py-3 px-4 text-dark-300">{formatDateTime(flight.departureTime)}</td>
                <td className="py-3 px-4 text-dark-300">{formatDateTime(flight.arrivalTime)}</td>
                <td className="py-3 px-4 text-white font-semibold">{flight.gate}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                    {flight.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(flight)}
                      className="p-2 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-all duration-200 cursor-pointer"
                      title="Edit flight"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(flight)}
                      className="p-2 rounded-lg text-danger-400 hover:bg-danger-500/10 transition-all duration-200 cursor-pointer"
                      title="Delete flight"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
