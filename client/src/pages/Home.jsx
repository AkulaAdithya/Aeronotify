import { Link } from "react-router-dom";
import { IoAirplaneSharp } from "react-icons/io5";
import { HiOutlineBell, HiOutlineLocationMarker, HiOutlineClock, HiArrowRight } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";

const features = [
  {
    icon: <MdSpeed className="text-2xl" />,
    title: "Real-Time Tracking",
    description: "Monitor flight statuses instantly with live updates from the control center.",
    gradient: "from-primary-500 to-primary-700",
  },
  {
    icon: <HiOutlineBell className="text-2xl" />,
    title: "Instant Alerts",
    description: "Receive immediate email notifications when your flight status changes.",
    gradient: "from-accent-500 to-accent-700",
  },
  {
    icon: <HiOutlineLocationMarker className="text-2xl" />,
    title: "Gate Updates",
    description: "Never miss a gate change — get notified before you even check the board.",
    gradient: "from-success-500 to-success-700",
  },
  {
    icon: <HiOutlineClock className="text-2xl" />,
    title: "Delay Warnings",
    description: "Know about delays as soon as they happen so you can plan accordingly.",
    gradient: "from-warning-500 to-warning-700",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/3 rounded-full blur-3xl" />
        </div>

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-primary-300 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            Live Flight Tracking System
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            <span className="text-white">Never Miss a</span>
            <br />
            <span className="text-gradient">Flight Update</span>
          </h1>

          <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            Subscribe to real-time flight alerts. Get instant email notifications for gate changes, delays, and status updates.
          </p>

          {/* CTA Button — Routes to Role Selection */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/role"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl gradient-primary text-white text-lg font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started
              <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-slide-up" style={{ animationDelay: "0.45s" }}>
            {[
              { value: "Real-Time", label: "Updates" },
              { value: "Instant", label: "Email Alerts" },
              { value: "24/7", label: "Monitoring" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-dark-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-dark-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 gradient-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay Informed, <span className="text-gradient">Stay Ahead</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              AeroNotify keeps you connected to your flight at every step of your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group glass rounded-2xl p-6 hover:glow transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-float shadow-lg shadow-primary-500/20">
              <IoAirplaneSharp className="text-white text-2xl -rotate-45" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Track Your Flight?
            </h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Create your free account in seconds and start receiving instant flight alerts.
            </p>
            <Link
              to="/role"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started
              <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <IoAirplaneSharp className="text-white text-xs -rotate-45" />
            </div>
            <span className="text-sm font-semibold text-gradient">AeroNotify</span>
          </div>
          <p className="text-dark-500 text-xs">
            © {new Date().getFullYear()} AeroNotify. Real-time flight tracking & alerts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
