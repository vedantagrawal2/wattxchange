import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import useCustomCursor from "../hooks/useCustomCursor";

const NAV_ITEMS = [
  { label: "About",    path: "/" },
  { label: "Market",   path: "/market" },
  { label: "Products", path: "/products" },
  { label: "Contact",  path: "/contact" },
];

/* ── Active Orders Dropdown ── */
const ActiveOrdersPanel = ({ orders, onClose, onNavigate }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const statusColor = { "Matching":"#f59e0b", "In Transit":"#3b82f6", "Confirming":"#16a34a", "Delivered":"#16a34a" };

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:8, scale:0.96 }} transition={{ duration:0.2 }}
      className="absolute right-0 top-12 rounded-2xl overflow-hidden"
      style={{ width:380, background:"#fff", border:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 20px 60px rgba(0,0,0,0.15)", zIndex:600 }}>
      
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
        <div>
          <div className="text-sm font-bold" style={{ color:"#111827" }}>Active Orders</div>
          <div className="text-xs" style={{ color:"#9ca3af" }}>{orders.length} live order{orders.length !== 1 ? "s" : ""}</div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background:"rgba(34,197,94,0.1)", color:"#16a34a" }}>🟢 Live</span>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-10" style={{ color:"#9ca3af" }}>
            <div className="text-3xl mb-2">📭</div>
            <div className="text-sm">No active orders right now</div>
            <button onClick={() => { onNavigate("/market"); onClose(); }}
              className="mt-3 text-xs font-bold cursor-none" style={{ color:"#f59e0b" }}>
              Go to Market →
            </button>
          </div>
        ) : orders.map((order, i) => {
          const isBuy = order.type === "buy";
          const accent = isBuy ? "#f59e0b" : "#fb8500";
          const sc = statusColor[order.status] || "#9ca3af";
          return (
            <div key={order.id} className="px-5 py-4" style={{ borderBottom: i < orders.length-1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{isBuy ? "☀️" : "⚡"}</span>
                  <div>
                    <div className="text-xs font-bold" style={{ color:"#111827" }}>
                      {isBuy?"Buy":"Sell"} {order.units} kWh
                    </div>
                    <div className="text-xs" style={{ color:"#9ca3af" }}>{order.city} · {order.discom}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color:accent }}>₹{order.amount}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full mt-0.5" style={{ background:`${sc}15`, color:sc }}>{order.status}</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(0,0,0,0.06)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background:`linear-gradient(90deg,${accent},${isBuy?"#fb8500":"#f59e0b"})`, width:`${order.progress}%` }}
                  initial={{ width:0 }} animate={{ width:`${order.progress}%` }}
                  transition={{ duration:0.8, delay:i*0.05 }}
                />
              </div>
              <div className="text-xs mt-1" style={{ color:"#d1d5db" }}>{order.placed}</div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3" style={{ borderTop:"1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={() => { onNavigate("/profile"); onClose(); }}
          className="w-full text-center text-xs font-bold cursor-none py-1" style={{ color:"#f59e0b" }}>
          View all in Profile →
        </button>
      </div>
    </motion.div>
  );
};

const Header = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout, activeOrders } = useAuth();
  const { hoverProps } = useCustomCursor();
  const [hovered,     setHovered]     = useState(null);
  const [showAuth,    setShowAuth]    = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const [showOrders,  setShowOrders]  = useState(false);
  const menuRef   = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const liveCount = activeOrders?.length || 0;

  return (
    <>
      <motion.header
        initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-12 h-[72px]"
        style={{ background:"rgba(248,249,250,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,0,0,0.07)" }}
      >
        {/* Logo */}
        <motion.button onClick={() => navigate("/")} {...hoverProps} whileHover={{ scale:1.02 }}
          className="cursor-none outline-none"
          style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.9rem", letterSpacing:"0.06em", color:"#f59e0b" }}>
          Watt<span style={{ color:"#fb8500" }}>X</span>change
        </motion.button>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button key={item.label}
                initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1+i*0.05 }}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => { setHovered(i); hoverProps.onMouseEnter(); }}
                onMouseLeave={() => { setHovered(null); hoverProps.onMouseLeave(); }}
                className="relative px-4 py-2 text-xs font-medium tracking-widest uppercase cursor-none outline-none transition-colors duration-300"
                style={{ color: isActive || hovered===i ? "#f59e0b" : "#374151" }}>
                <motion.span className="absolute inset-0 rounded"
                  initial={{ scaleX:0 }} animate={{ scaleX: hovered===i ? 1 : 0 }}
                  transition={{ duration:0.25, ease:[0.34,1.56,0.64,1] }}
                  style={{ background:"rgba(245,158,11,0.08)", transformOrigin:"left" }} />
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}

          {/* Active Orders Bell — shown only when logged in */}
          {user && (
            <div className="relative ml-1">
              <motion.button
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                onClick={() => { setShowOrders(!showOrders); setShowMenu(false); }}
                {...hoverProps}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase cursor-none"
                style={{ color:liveCount>0?"#f59e0b":"#9ca3af", border:`1px solid ${liveCount>0?"rgba(245,158,11,0.3)":"rgba(0,0,0,0.08)"}`, background:liveCount>0?"rgba(245,158,11,0.06)":"transparent" }}>
                <span className="text-sm">⚡</span>
                <span>Orders</span>
                {liveCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full text-white text-xs font-bold pulse-glow"
                    style={{ background:"#f59e0b", fontSize:"0.6rem" }}>
                    {liveCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showOrders && (
                  <ActiveOrdersPanel
                    orders={activeOrders || []}
                    onClose={() => setShowOrders(false)}
                    onNavigate={navigate}
                  />
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.button
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.45 }}
            onClick={() => navigate("/market")} {...hoverProps}
            whileHover={{ scale:1.04, boxShadow:"0 4px 24px rgba(245,158,11,0.4)" }} whileTap={{ scale:0.97 }}
            className="ml-2 px-5 py-2 text-xs font-bold tracking-widest uppercase rounded cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)", color:"#fff" }}>
            Explore
          </motion.button>

          {user ? (
            <div className="relative ml-2" ref={menuRef}>
              <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
                onClick={() => { setShowMenu(!showMenu); setShowOrders(false); }} {...hoverProps}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-none outline-none"
                style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)", color:"#fff", boxShadow:"0 0 0 2px rgba(245,158,11,0.3)" }}>
                {user.avatar || user.name?.charAt(0)?.toUpperCase() || "U"}
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity:0,y:8,scale:0.95 }} animate={{ opacity:1,y:0,scale:1 }}
                    exit={{ opacity:0,y:8,scale:0.95 }} transition={{ duration:0.2 }}
                    className="absolute right-0 top-12 w-52 rounded-xl overflow-hidden"
                    style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 16px 48px rgba(0,0,0,0.12)", zIndex:600 }}>
                    <div className="px-4 py-3" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                      <div className="text-sm font-semibold" style={{ color:"#111827" }}>{user.name}</div>
                      <div className="text-xs mt-0.5" style={{ color:"#9ca3af" }}>{user.email}</div>
                    </div>
                    {[{ label:"👤 My Profile", path:"/profile" }, { label:"📊 Transactions", path:"/profile" }].map(item => (
                      <button key={item.label} onClick={() => { navigate(item.path); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm cursor-none transition-colors hover:bg-gray-50"
                        style={{ color:"#374151" }}>{item.label}</button>
                    ))}
                    <button onClick={() => { logout(); setShowMenu(false); navigate("/"); }}
                      className="w-full text-left px-4 py-2.5 text-sm cursor-none transition-colors"
                      style={{ color:"#ef4444", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              onClick={() => setShowAuth(true)} {...hoverProps}
              whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}
              className="ml-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase cursor-none outline-none"
              style={{ border:"1.5px solid rgba(245,158,11,0.4)", color:"#f59e0b", background:"transparent" }}>
              Login / Signup
            </motion.button>
          )}
        </nav>
      </motion.header>

      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
