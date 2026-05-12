import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPassenger } from "../services/api";
import toast from "react-hot-toast";
import { IoAirplaneSharp } from "react-icons/io5";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";

const PassengerRegister = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter your full name");
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (!form.phone.trim()) return toast.error("Please enter your phone number");
    if (!/^[+]?[\d\s()-]{7,15}$/.test(form.phone.trim())) return toast.error("Please enter a valid phone number");
    if (!form.email.trim()) return toast.error("Please enter your email address");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return toast.error("Please enter a valid email address");
    if (!form.password) return toast.error("Please enter a password");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await registerPassenger(form);
      toast.success("Account created successfully!");
      navigate("/passenger/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/20 animate-float">
              <IoAirplaneSharp className="text-white text-xl -rotate-45" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-dark-400 text-sm">Sign up to start tracking your flights</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="name" type="text" value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="John Doe" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-dark-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="phone" type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="passenger@email.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => onChange("password", e.target.value)} placeholder="Min. 6 characters" className="w-full pl-11 pr-11 py-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-dark-400 text-sm">
              Already have an account?{" "}
              <Link to="/passenger/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">Sign in</Link>
            </p>
            <Link to="/role" className="text-dark-500 text-xs hover:text-dark-300 transition-colors block">← Choose a different role</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerRegister;
