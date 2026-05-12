import { useState, useEffect } from "react";
import { getAllFlights, createFlight, updateFlight, deleteFlight } from "../services/api";
import FlightTable from "../components/FlightTable";
import toast from "react-hot-toast";
import { HiPlus, HiX, HiOutlineRefresh } from "react-icons/hi";
import { IoAirplaneSharp } from "react-icons/io5";

const emptyForm = {
  flightNumber: "", airline: "", origin: "", destination: "",
  departureTime: "", arrivalTime: "", status: "On Time", gate: "--",
};

const statusOptions = ["On Time", "Delayed", "Cancelled", "Boarding", "Departed", "Landed"];

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => { fetchFlights(); }, []);

  const fetchFlights = async () => {
    try {
      const res = await getAllFlights();
      setFlights(res.data);
    } catch { toast.error("Failed to load flights"); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingFlight(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (flight) => {
    setEditingFlight(flight);
    setForm({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime?.slice(0, 16) || "",
      arrivalTime: flight.arrivalTime?.slice(0, 16) || "",
      status: flight.status,
      gate: flight.gate,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingFlight) {
        await updateFlight(editingFlight._id, form);
        toast.success("Flight updated — alerts dispatched to subscribers!");
      } else {
        await createFlight(form);
        toast.success("Flight created successfully!");
      }
      setShowModal(false);
      fetchFlights();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (flight) => {
    try {
      await deleteFlight(flight._id);
      toast.success("Flight deleted");
      setShowDeleteConfirm(null);
      fetchFlights();
    } catch { toast.error("Delete failed"); }
  };

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm";

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 gradient-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Flight <span className="text-gradient">Dashboard</span></h1>
            <p className="text-dark-400 text-sm mt-1">Manage flights and trigger passenger alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchFlights} className="p-2.5 rounded-xl glass text-dark-300 hover:text-white transition-all cursor-pointer" title="Refresh">
              <HiOutlineRefresh size={18} />
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <HiPlus size={18} /> Add Flight
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Flights", value: flights.length, color: "primary" },
            { label: "On Time", value: flights.filter((f) => f.status === "On Time").length, color: "success" },
            { label: "Delayed", value: flights.filter((f) => f.status === "Delayed").length, color: "warning" },
            { label: "Cancelled", value: flights.filter((f) => f.status === "Cancelled").length, color: "danger" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <p className="text-dark-400 text-xs font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass rounded-2xl p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <FlightTable flights={flights} onEdit={openEdit} onDelete={(f) => setShowDeleteConfirm(f)} />
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-dark-400 hover:text-white cursor-pointer"><HiX size={20} /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <IoAirplaneSharp className="text-white -rotate-45" />
              </div>
              <h3 className="text-xl font-bold text-white">{editingFlight ? "Edit Flight" : "Add New Flight"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Flight Number</label>
                  <input value={form.flightNumber} onChange={(e) => onChange("flightNumber", e.target.value)} placeholder="AA101" required className={inputClass} disabled={!!editingFlight} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Airline</label>
                  <input value={form.airline} onChange={(e) => onChange("airline", e.target.value)} placeholder="American Airlines" required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Origin</label>
                  <input value={form.origin} onChange={(e) => onChange("origin", e.target.value)} placeholder="New York (JFK)" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Destination</label>
                  <input value={form.destination} onChange={(e) => onChange("destination", e.target.value)} placeholder="Los Angeles (LAX)" required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Departure</label>
                  <input type="datetime-local" value={form.departureTime} onChange={(e) => onChange("departureTime", e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Arrival</label>
                  <input type="datetime-local" value={form.arrivalTime} onChange={(e) => onChange("arrivalTime", e.target.value)} required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => onChange("status", e.target.value)} className={inputClass}>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Gate</label>
                  <input value={form.gate} onChange={(e) => onChange("gate", e.target.value)} placeholder="A12" className={inputClass} />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2">
                {submitting ? "Saving..." : editingFlight ? "Update Flight" : "Create Flight"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm animate-slide-up text-center">
            <div className="w-12 h-12 rounded-xl bg-danger-500/15 flex items-center justify-center mx-auto mb-4">
              <IoAirplaneSharp className="text-danger-400 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Flight?</h3>
            <p className="text-dark-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{showDeleteConfirm.flightNumber}</span>? This will also remove all subscriber data.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl glass text-dark-300 font-medium hover:text-white transition-all cursor-pointer">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-danger-500 text-white font-medium hover:bg-danger-600 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
