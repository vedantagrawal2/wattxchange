import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { useState } from "react";
import useCustomCursor from "../hooks/useCustomCursor";

const statusMeta = {
  "Matching":   { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  icon:"🔍", step:1 },
  "In Transit": { color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  icon:"🔄", step:2 },
  "Confirming": { color:"#16a34a", bg:"rgba(34,197,94,0.1)",   icon:"✅", step:3 },
  "Delivered":  { color:"#16a34a", bg:"rgba(34,197,94,0.1)",   icon:"🎉", step:4 },
};
const STEPS = ["Order Placed","Matching","In Transit","Delivered"];

const ActiveOrders = () => {
  const navigate = useNavigate();
  const { user, activeOrders } = useAuth();
  const { hoverProps } = useCustomCursor();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#f8f9fa" }}>
        <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} className="text-center px-8 max-w-md">
          <div className="text-6xl mb-5">🔒</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.8rem",color:"#f59e0b",letterSpacing:"0.04em" }} className="mb-3">
            Sign In to View Orders
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color:"#6b7280" }}>
            Create a free account or sign in to track your active buy and sell orders in real-time.
          </p>
          <motion.button whileHover={{ scale:1.04,boxShadow:"0 8px 32px rgba(245,158,11,0.35)" }} whileTap={{ scale:0.97 }}
            onClick={() => setShowAuth(true)}
            className="btn-clip px-10 py-4 font-bold text-sm tracking-widest uppercase cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            Register / Sign In →
          </motion.button>
          <button onClick={() => navigate("/market")} className="block mx-auto mt-5 text-xs cursor-none" style={{ color:"#9ca3af" }}>
            ← Back to Market
          </button>
        </motion.div>
        <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} />}</AnimatePresence>
      </div>
    );
  }

  const orders = activeOrders || [];
  const buyOrders  = orders.filter(o => o.type === "buy");
  const sellOrders = orders.filter(o => o.type === "sell");

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width:500,height:500,top:-100,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="mb-8">
          <motion.button onClick={() => navigate(-1)} {...hoverProps} whileHover={{ x:-4 }}
            className="flex items-center gap-2 text-xs tracking-widest uppercase mb-6 cursor-none" style={{ color:"#9ca3af" }}>
            ← Back
          </motion.button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color:"#f59e0b" }}>Real-Time</p>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2rem,5vw,3.5rem)",color:"#0f172a",letterSpacing:"0.04em" }}>
                Active Orders
              </h1>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-4 py-2 rounded-xl" style={{ background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.2)" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#f59e0b" }}>{buyOrders.length}</div>
                <div className="text-xs" style={{ color:"#9ca3af" }}>Buy</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl" style={{ background:"rgba(251,133,0,0.1)",border:"1px solid rgba(251,133,0,0.2)" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#fb8500" }}>{sellOrders.length}</div>
                <div className="text-xs" style={{ color:"#9ca3af" }}>Sell</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl" style={{ background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#16a34a" }}>{orders.length}</div>
                <div className="text-xs" style={{ color:"#9ca3af" }}>Total</div>
              </div>
            </div>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#374151",letterSpacing:"0.04em" }}>No Active Orders</h3>
            <p className="text-sm mt-2 mb-8" style={{ color:"#9ca3af" }}>Place a buy or sell order to see it tracked here in real-time.</p>
            <motion.button onClick={() => navigate("/market")} {...hoverProps}
              whileHover={{ scale:1.04,boxShadow:"0 8px 32px rgba(245,158,11,0.3)" }} whileTap={{ scale:0.97 }}
              className="btn-clip px-10 py-4 font-bold text-sm tracking-widest uppercase cursor-none"
              style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
              Go to Market →
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order, i) => {
              const isBuy = order.type === "buy";
              const accent = isBuy ? "#f59e0b" : "#fb8500";
              const sm = statusMeta[order.status] || { color:"#9ca3af", bg:"rgba(0,0,0,0.05)", icon:"⏳", step:0 };
              const currentStep = sm.step;

              return (
                <motion.div key={order.id}
                  initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }}
                  transition={{ delay:i*0.08,duration:0.55,ease:[0.22,1,0.36,1] }}
                  className="p-6 rounded-2xl"
                  style={{ background:"#fff", border:`1.5px solid ${accent}22`, boxShadow:`0 2px 20px ${accent}0d` }}>

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background:isBuy?"rgba(245,158,11,0.1)":"rgba(251,133,0,0.1)" }}>
                        {isBuy ? "☀️" : "⚡"}
                      </div>
                      <div>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:accent,letterSpacing:"0.04em",lineHeight:1 }}>
                          {isBuy?"BUY":"SELL"} {order.units} kWh
                        </div>
                        <div className="text-xs mt-0.5" style={{ color:"#9ca3af" }}>
                          #{order.id} · {order.city} · {order.discom} · {order.placed}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",color:accent,letterSpacing:"0.04em" }}>
                        ₹{order.amount}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background:sm.bg,color:sm.color }}>
                        {sm.icon} {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress stepper */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      {STEPS.map((step, si) => (
                        <div key={step} className="flex-1 flex flex-col items-center gap-1 relative">
                          {si < STEPS.length - 1 && (
                            <div className="absolute top-2.5 left-1/2 w-full h-0.5"
                              style={{ background: si < currentStep ? accent : "rgba(0,0,0,0.08)" }} />
                          )}
                          <div className="w-5 h-5 rounded-full flex items-center justify-center z-10 text-xs font-bold"
                            style={{
                              background: si < currentStep ? accent : si === currentStep ? `${accent}30` : "rgba(0,0,0,0.06)",
                              color: si < currentStep ? "#fff" : si === currentStep ? accent : "#9ca3af",
                              border: si === currentStep ? `2px solid ${accent}` : "2px solid transparent",
                            }}>
                            {si < currentStep ? "✓" : si+1}
                          </div>
                          <span className="text-xs text-center leading-tight" style={{ color: si <= currentStep ? accent : "#9ca3af", fontSize:"0.6rem" }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background:"rgba(0,0,0,0.06)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background:`linear-gradient(90deg,${accent},${isBuy?"#fb8500":"#f59e0b"})` }}
                      initial={{ width:0 }} animate={{ width:`${order.progress}%` }}
                      transition={{ delay:0.3+i*0.08,duration:1.2,ease:[0.22,1,0.36,1] }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color:"#9ca3af" }}>Order progress</span>
                    <span className="text-xs font-bold" style={{ color:accent }}>{order.progress}% complete</span>
                  </div>

                  {/* Source badge */}
                  {order.source === "product" && (
                    <div className="mt-3 pt-3" style={{ borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"rgba(59,130,246,0.1)",color:"#3b82f6" }}>
                        🛒 From Product Quote
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveOrders;
