import { Link } from "react-router-dom";
import { IoAirplaneSharp } from "react-icons/io5";
import { HiOutlineUser, HiOutlineShieldCheck, HiArrowRight } from "react-icons/hi";
import { MdFlightTakeoff, MdAdminPanelSettings } from "react-icons/md";

const RoleSelection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/20 animate-float">
            <IoAirplaneSharp className="text-white text-xl -rotate-45" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Welcome to <span className="text-gradient">AeroNotify</span>
          </h1>
          <p className="text-dark-400 text-base max-w-md mx-auto">
            Choose how you'd like to continue. Are you a passenger tracking a flight or an admin managing the system?
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {/* Passenger Card */}
          <Link
            to="/passenger/register"
            className="group glass rounded-2xl p-8 hover:glow transition-all duration-500 hover:-translate-y-2 cursor-pointer block"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-6 shadow-xl shadow-accent-500/20 group-hover:scale-110 group-hover:shadow-accent-500/30 transition-all duration-500">
                <MdFlightTakeoff className="text-white text-3xl" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors duration-300">
                Passenger
              </h2>
              <p className="text-dark-400 text-sm leading-relaxed mb-6">
                Track your flights, subscribe to gate change alerts, and receive delay notifications via email.
              </p>

              {/* Features list */}
              <div className="w-full space-y-2.5 mb-6">
                {["Search & track flights", "Get email alerts", "Gate change notifications"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-dark-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-accent-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                Continue as Passenger
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link
            to="/admin/login"
            className="group glass rounded-2xl p-8 hover:glow transition-all duration-500 hover:-translate-y-2 cursor-pointer block"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20 group-hover:scale-110 group-hover:shadow-primary-500/30 transition-all duration-500">
                <MdAdminPanelSettings className="text-white text-3xl" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                Admin
              </h2>
              <p className="text-dark-400 text-sm leading-relaxed mb-6">
                Access the flight control dashboard to manage flights, update statuses, and trigger passenger alerts.
              </p>

              {/* Features list */}
              <div className="w-full space-y-2.5 mb-6">
                {["Manage flight schedules", "Update gates & statuses", "Automated email alerts"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-dark-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                Continue as Admin
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/" className="text-dark-500 text-sm hover:text-dark-300 transition-colors duration-300">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
