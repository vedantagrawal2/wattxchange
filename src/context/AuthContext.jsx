import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);
const MOCK_USERS = {};

// Mock active orders for logged-in users
const MOCK_ACTIVE_ORDERS = [
  { id:"ORD001", type:"buy",  units:150, placed:"Today 10:32 AM",  status:"Matching",   progress:35, city:"Indore",   discom:"MPWZ",   amount:660,  source:"market" },
  { id:"ORD002", type:"sell", units:80,  placed:"Today 09:15 AM",  status:"In Transit", progress:72, city:"Bhopal",   discom:"MPEZ",   amount:328,  source:"market" },
  { id:"ORD003", type:"buy",  units:60,  placed:"Yesterday 4:50 PM",status:"Confirming",progress:88, city:"Mumbai",   discom:"MSEDCL", amount:264,  source:"product" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { const s = sessionStorage.getItem("wx_user"); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const [transactions, setTransactions] = useState(() => {
    try { const s = sessionStorage.getItem("wx_txns"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [activeOrders, setActiveOrders] = useState(() => {
    try { const s = sessionStorage.getItem("wx_active"); return s ? JSON.parse(s) : MOCK_ACTIVE_ORDERS; }
    catch { return MOCK_ACTIVE_ORDERS; }
  });

  const login = useCallback((userData) => {
    const enriched = { ...userData, loginTime: Date.now() };
    setUser(enriched);
    sessionStorage.setItem("wx_user", JSON.stringify(enriched));
    return { success: true };
  }, []);

  const register = useCallback((formData) => {
    const newUser = {
      id: `wx_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      avatar: formData.name.charAt(0).toUpperCase(),
      joinDate: new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }),
      totalBought: 0, totalSold: 0, savedAmount: 0,
    };
    MOCK_USERS[formData.email] = newUser;
    setUser(newUser);
    sessionStorage.setItem("wx_user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("wx_user");
  }, []);

  const addTransaction = useCallback((txn) => {
    const newTxn = { id:`TXN${Date.now()}`, timestamp: new Date().toLocaleString("en-IN"), ...txn };
    // Also add as active order initially
    const newOrder = {
      id: `ORD${Date.now()}`,
      type: txn.type,
      units: txn.units,
      placed: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }) + " Today",
      status: "Matching",
      progress: 10,
      city: txn.city || "—",
      discom: txn.discom || "—",
      amount: txn.amount || 0,
      source: txn.source || "market",
    };
    setActiveOrders(prev => {
      const updated = [newOrder, ...prev];
      sessionStorage.setItem("wx_active", JSON.stringify(updated));
      return updated;
    });
    setTransactions(prev => {
      const updated = [newTxn, ...prev];
      sessionStorage.setItem("wx_txns", JSON.stringify(updated));
      return updated;
    });
    setUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        totalBought: txn.type==="buy"  ? (prev.totalBought||0)+txn.units : (prev.totalBought||0),
        totalSold:   txn.type==="sell" ? (prev.totalSold||0)+txn.units   : (prev.totalSold||0),
        savedAmount: txn.type==="buy"  ? (prev.savedAmount||0)+(txn.savings||0) : (prev.savedAmount||0),
      };
      sessionStorage.setItem("wx_user", JSON.stringify(updated));
      return updated;
    });
    return newTxn;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, transactions, addTransaction, activeOrders, setActiveOrders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
