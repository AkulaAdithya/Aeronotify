import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginPassenger as loginPassengerApi } from "../services/api";
import toast from "react-hot-toast";
import { IoAirplaneSharp } from "react-icons/io5";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const PassengerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { passengerLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email address");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return toast.error("Please enter a valid email");
    if (!password) return toast.error("Please enter your password");

    setLoading(true);
    try {
      const res = await loginPassengerApi(email.trim(), password);
      passengerLogin(res.data.passenger);
      toast.success("Welcome back!");
      navigate("/flights");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/20 animate-float">
              <IoAirplaneSharp className="text-white text-xl -rotate-45" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Passenger Login</h1>
            <p className="text-dark-400 text-sm">Sign in to track your flights</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="passenger@email.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-dark-400 text-sm">
              Don't have an account?{" "}
              <Link to="/passenger/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">Create one</Link>
            </p>
            <Link to="/role" className="text-dark-500 text-xs hover:text-dark-300 transition-colors block">← Choose a different role</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerLogin;
