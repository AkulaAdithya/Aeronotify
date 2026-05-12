import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Admin auth (JWT)
  const [token, setToken] = useState(localStorage.getItem("aeronotify_token"));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("aeronotify_admin");
    return stored ? JSON.parse(stored) : null;
  });

  // Passenger auth (session-based, no JWT yet)
  const [passenger, setPassenger] = useState(() => {
    const stored = localStorage.getItem("aeronotify_passenger");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;          // admin logged in
  const isPassengerLoggedIn = !!passenger;  // passenger logged in
  const isAnyUserLoggedIn = isAuthenticated || isPassengerLoggedIn;

  // Admin login
  const login = (tokenValue, adminData) => {
    localStorage.setItem("aeronotify_token", tokenValue);
    localStorage.setItem("aeronotify_admin", JSON.stringify(adminData));
    setToken(tokenValue);
    setAdmin(adminData);
  };

  // Passenger login
  const passengerLogin = (passengerData) => {
    localStorage.setItem("aeronotify_passenger", JSON.stringify(passengerData));
    setPassenger(passengerData);
  };

  // Universal logout — clears both admin and passenger sessions
  const logout = () => {
    localStorage.removeItem("aeronotify_token");
    localStorage.removeItem("aeronotify_admin");
    localStorage.removeItem("aeronotify_passenger");
    setToken(null);
    setAdmin(null);
    setPassenger(null);
  };

  // Check admin token expiry on mount
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      token, admin, passenger,
      isAuthenticated, isPassengerLoggedIn, isAnyUserLoggedIn,
      login, passengerLogin, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
