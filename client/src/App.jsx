import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import PassengerRegister from "./pages/PassengerRegister";
import PassengerLogin from "./pages/PassengerLogin";
import PassengerPortal from "./pages/PassengerPortal";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/role" element={<RoleSelection />} />

          {/* Passenger auth flow */}
          <Route path="/passenger/register" element={<PassengerRegister />} />
          <Route path="/passenger/login" element={<PassengerLogin />} />
          <Route path="/flights" element={<PassengerPortal />} />

          {/* Admin auth flow */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#f1f5f9" } },
            error: { iconTheme: { primary: "#f43f5e", secondary: "#f1f5f9" } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
