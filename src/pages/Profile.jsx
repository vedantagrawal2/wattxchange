import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Animated bar chart ── */
const BarChart = ({ data }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...data.map(d => d.value));

  return (
    <div ref={ref} className="flex items-end gap-2 h-20">
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t"
            style={{ background: d.color || "#f59e0b", minHeight: 4 }}
            initial={{ height: 0 }}
            animate={inView ? { height: `${(d.value / max) * 72}px` } : { height: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-xs" style={{ color: "#9ca3af", fontSize: "0.6rem" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Line spark ── */
const SparkLine = ({ data, color = "#f59e0b" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const W = 200, H = 40;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min + 1)) * H;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 40 }}>
      <defs>
        <clipPath id={`spark-${color.replace("#","")}`}>
          <motion.rect x="0" y="0" height={H}
            initial={{ width: 0 }} animate={inView ? { width: W } : {}}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
        </clipPath>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinejoin="round" clipPath={`url(#spark-${color.replace("#","")})`} />
    </svg>
  );
};

const MOCK_TXN = [
  { id:"TXN001", type:"buy",  units:120, amount:726.00,  discom:"BESCOM",   city:"Bengaluru", state:"Karnataka",   date:"15 Jan 2025", status:"Completed", savings:156 },
  { id:"TXN002", type:"sell", units:80,  amount:328.00,  discom:"MSEDCL",   city:"Pune",      state:"Maharashtra", date:"12 Jan 2025", status:"Completed", earnings:72 },
  { id:"TXN003", type:"buy",  units:200, amount:1200.00, discom:"TPDDL",    city:"Delhi",     state:"Delhi",       date:"8 Jan 2025",  status:"Completed", savings:280 },
  { id:"TXN004", type:"sell", units:60,  amount:246.00,  discom:"TANGEDCO", city:"Chennai",   state:"Tamil Nadu",  date:"3 Jan 2025",  status:"Completed", earnings:54 },
  { id:"TXN005", type:"buy",  units:50,  amount:285.00,  discom:"PSPCL",    city:"Amritsar",  state:"Punjab",      date:"28 Dec 2024", status:"Completed", savings:70 },
  { id:"TXN006", type:"sell", units:95,  amount:390.00,  discom:"WBSEDCL",  city:"Kolkata",   state:"West Bengal", date:"22 Dec 2024", status:"Completed", earnings:88 },
];

const MOCK_ACTIVE = [
  { id:"ORD001", type:"buy",  units:150, placed:"Today 10:32 AM",  status:"Matching",  progress:35, city:"Indore",  discom:"MPWZ" },
  { id:"ORD002", type:"sell", units:80,  placed:"Today 09:15 AM",  status:"In Transit", progress:72, city:"Bhopal",  discom:"MPEZ" },
  { id:"ORD003", type:"buy",  units:60,  placed:"Yesterday 4:50 PM",status:"Confirming",progress:88, city:"Mumbai",  discom:"MSEDCL" },
];

const MOCK_SHARING = [
  { id:"ES001", partner:"Rahul Sharma", units:45, direction:"sent",     date:"14 Jan", rate:5.90 },
  { id:"ES002", partner:"Priya Patel",  units:30, direction:"received", date:"10 Jan", rate:6.40 },
  { id:"ES003", partner:"Amit Kumar",   units:100,direction:"sent",     date:"5 Jan",  rate:5.70 },
];

const TabBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase cursor-none transition-all duration-300"
    style={{ background:active?"linear-gradient(135deg,#f59e0b,#fb8500)":"rgba(0,0,0,0.05)", color:active?"#fff":"#6b7280" }}>
    {label}
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, transactions, logout } = useAuth();
  const [tab, setTab] = useState("overview");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#f8f9fa" }}>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center px-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"3rem",color:"#f59e0b",letterSpacing:"0.04em" }} className="mb-4">Sign In Required</h2>
          <p className="mb-6 text-sm" style={{ color:"#6b7280" }}>Please sign in to view your profile and transaction history</p>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate("/")}
            className="btn-clip px-10 py-4 font-bold text-sm tracking-widest uppercase cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            Go to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const allTxns    = [...transactions, ...MOCK_TXN];
  const buyTxns    = allTxns.filter(t => t.type === "buy");
  const sellTxns   = allTxns.filter(t => t.type === "sell");
  const totalBought  = buyTxns.reduce((a,t) => a+(t.units||0), 0);
  const totalSold    = sellTxns.reduce((a,t) => a+(t.units||0), 0);
  const totalSpent   = buyTxns.reduce((a,t) => a+(t.amount||0), 0);
  const totalEarned  = sellTxns.reduce((a,t) => a+(t.amount||0), 0);
  const totalSavings = buyTxns.reduce((a,t) => a+(t.savings||0), 0);

  const monthlyData = [
    { label:"Aug", value:42, color:"#f59e0b" },
    { label:"Sep", value:65, color:"#f59e0b" },
    { label:"Oct", value:51, color:"#f59e0b" },
    { label:"Nov", value:78, color:"#f59e0b" },
    { label:"Dec", value:60, color:"#f59e0b" },
    { label:"Jan", value:92, color:"#fb8500" },
  ];

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width:500,height:500,top:-100,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

        {/* Profile Header */}
        <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="flex items-center gap-6 mb-8 p-6 rounded-2xl"
          style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",boxShadow:"0 2px 16px rgba(0,0,0,0.04)" }}>
          <div className="w-18 h-18 rounded-full flex items-center justify-center font-bold text-3xl shrink-0"
            style={{ width:72,height:72,background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            {user.avatar || user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#0f172a",letterSpacing:"0.04em" }}>{user.name}</h1>
            <div className="flex gap-4 flex-wrap mt-1">
              <span className="text-sm" style={{ color:"#6b7280" }}>📧 {user.email}</span>
              {user.mobile && <span className="text-sm" style={{ color:"#6b7280" }}>📱 {user.mobile}</span>}
              <span className="text-sm" style={{ color:"#6b7280" }}>📅 Joined {user.joinDate || "2025"}</span>
            </div>
            <div className="mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold pulse-glow"
                style={{ background:"rgba(245,158,11,0.12)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.25)" }}>
                ⚡ Verified Trader
              </span>
            </div>
          </div>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            onClick={() => { logout(); navigate("/"); }}
            className="px-4 py-2 rounded-lg text-xs font-bold cursor-none"
            style={{ background:"rgba(239,68,68,0.08)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)" }}>
            Sign Out
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id:"overview",  label:"Overview" },
            { id:"active",    label:"Active Orders" },
            { id:"buying",    label:"Buy History" },
            { id:"selling",   label:"Sell History" },
            { id:"energy",    label:"P2P Sharing" },
          ].map(t => (
            <TabBtn key={t.id} label={t.label} active={tab===t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon:"⚡", label:"Total Bought",  value:`${totalBought} kWh`,         color:"#f59e0b" },
                  { icon:"☀️", label:"Total Sold",    value:`${totalSold} kWh`,            color:"#fb8500" },
                  { icon:"💰", label:"Total Savings", value:`₹${totalSavings}`,            color:"#16a34a" },
                  { icon:"💳", label:"Total Spent",   value:`₹${totalSpent.toFixed(0)}`,   color:"#374151" },
                  { icon:"📈", label:"Total Earned",  value:`₹${totalEarned.toFixed(0)}`,  color:"#374151" },
                  { icon:"🔄", label:"Transactions",  value:allTxns.length,                color:"#f59e0b" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
                    transition={{ delay:0.1+i*0.07 }}
                    className="rounded-xl p-5" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
                    <div className="text-xl mb-2">{s.icon}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:s.color,letterSpacing:"0.04em",lineHeight:1 }}>{s.value}</div>
                    <div className="text-xs tracking-widest uppercase mt-1" style={{ color:"#9ca3af" }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#9ca3af" }}>Monthly Volume (kWh)</p>
                  <div className="flex items-end justify-between mb-3">
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#f59e0b" }}>92 kWh</span>
                    <span className="text-xs font-bold" style={{ color:"#16a34a" }}>↑ 53% vs last month</span>
                  </div>
                  <BarChart data={monthlyData} />
                </div>

                <div className="p-6 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#9ca3af" }}>Rate Trend (₹/kWh)</p>
                  <div className="flex items-end justify-between mb-2">
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#fb8500" }}>₹5.85</span>
                    <span className="text-xs font-bold" style={{ color:"#16a34a" }}>↑ Best rate this week</span>
                  </div>
                  <SparkLine data={[4.2,4.8,4.5,5.1,4.9,5.4,5.2,5.6,5.3,5.7,5.5,5.85]} color="#fb8500" />
                  <div className="flex justify-between text-xs mt-1" style={{ color:"#d1d5db" }}>
                    <span>30 days ago</span><span>Today</span>
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#0f172a",letterSpacing:"0.04em",marginBottom:"1rem" }}>
                Recent Activity
              </h3>
              <div className="flex flex-col gap-3">
                {allTxns.slice(0,5).map((txn,i) => (
                  <motion.div key={txn.id} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }}
                    transition={{ delay:0.4+i*0.07 }}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{txn.type==="buy"?"☀️":"⚡"}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color:"#111827" }}>
                          {txn.type==="buy"?"Bought":"Sold"} {txn.units} kWh
                        </div>
                        <div className="text-xs" style={{ color:"#9ca3af" }}>
                          {txn.city}, {txn.state} · {txn.discom} · {txn.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",color:txn.type==="buy"?"#f59e0b":"#fb8500" }}>
                        ₹{typeof txn.amount==="number"?txn.amount.toFixed(2):txn.amount}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background:"rgba(34,197,94,0.1)",color:"#16a34a" }}>
                        ✓ {txn.status||"Completed"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ACTIVE ORDERS ── */}
          {tab === "active" && (
            <motion.div key="active" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#0f172a",letterSpacing:"0.04em" }}>
                  Active Orders
                </h3>
                <span className="text-xs px-3 py-1 rounded-full font-bold pulse-glow"
                  style={{ background:"rgba(34,197,94,0.12)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.25)" }}>
                  🟢 {MOCK_ACTIVE.length} Live
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {MOCK_ACTIVE.map((order, i) => {
                  const isBuy = order.type === "buy";
                  const accent = isBuy ? "#f59e0b" : "#fb8500";
                  const statusColors = {
                    "Matching":    { bg:"rgba(245,158,11,0.1)",  color:"#f59e0b" },
                    "In Transit":  { bg:"rgba(59,130,246,0.1)",  color:"#3b82f6" },
                    "Confirming":  { bg:"rgba(34,197,94,0.1)",   color:"#16a34a" },
                  };
                  const sc = statusColors[order.status] || { bg:"rgba(0,0,0,0.05)",color:"#6b7280" };

                  return (
                    <motion.div key={order.id}
                      initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
                      transition={{ delay:i*0.1 }}
                      className="p-6 rounded-2xl"
                      style={{ background:"#fff",border:`1.5px solid ${accent}22`,boxShadow:`0 2px 16px ${accent}10` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{isBuy?"☀️":"⚡"}</span>
                            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:accent,letterSpacing:"0.04em" }}>
                              {order.units} kWh — {isBuy?"Buy":"Sell"} Order
                            </span>
                          </div>
                          <div className="text-xs" style={{ color:"#9ca3af" }}>
                            #{order.id} · {order.city} · {order.discom} · Placed {order.placed}
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background:sc.bg,color:sc.color,border:`1px solid ${sc.color}33` }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color:"#9ca3af" }}>Progress</span>
                          <span style={{ color:accent,fontWeight:600 }}>{order.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(0,0,0,0.06)" }}>
                          <motion.div className="h-full rounded-full"
                            style={{ background:`linear-gradient(90deg,${accent},${isBuy?"#fb8500":"#f59e0b"})` }}
                            initial={{ width:0 }} animate={{ width:`${order.progress}%` }}
                            transition={{ delay:0.3+i*0.1,duration:1,ease:[0.22,1,0.36,1] }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1.5" style={{ color:"#d1d5db" }}>
                          <span>Order Placed</span><span>Matching</span><span>In Transit</span><span>Delivered</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {MOCK_ACTIVE.length === 0 && (
                  <div className="text-center py-16" style={{ color:"#9ca3af" }}>
                    No active orders right now.
                    <button onClick={() => navigate("/market")}
                      className="block mx-auto mt-4 text-sm cursor-none" style={{ color:"#f59e0b" }}>
                      Go to Market →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── BUY HISTORY ── */}
          {tab === "buying" && (
            <motion.div key="buying" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              {buyTxns.length === 0 ? (
                <div className="text-center py-16" style={{ color:"#9ca3af" }}>
                  No purchase history yet.
                  <button onClick={() => navigate("/trade/buy")} className="block mx-auto mt-4 text-sm cursor-none" style={{ color:"#f59e0b" }}>Buy energy →</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {buyTxns.map((txn, i) => (
                    <motion.div key={txn.id} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
                      transition={{ delay:i*0.07 }} className="p-5 rounded-xl"
                      style={{ background:"#fff",border:"1.5px solid rgba(245,158,11,0.18)",boxShadow:"0 2px 12px rgba(245,158,11,0.06)" }}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",color:"#f59e0b",letterSpacing:"0.04em" }}>☀️ {txn.units} kWh</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"rgba(34,197,94,0.1)",color:"#16a34a" }}>✓ {txn.status||"Completed"}</span>
                          </div>
                          <div className="text-xs" style={{ color:"#9ca3af" }}>#{txn.id} · {txn.discom} · {txn.city}, {txn.state}</div>
                        </div>
                        <div className="text-right">
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#f59e0b" }}>
                            ₹{typeof txn.amount==="number"?txn.amount.toFixed(2):txn.amount}
                          </div>
                          <div className="text-xs" style={{ color:"#9ca3af" }}>{txn.date}</div>
                        </div>
                      </div>
                      {txn.savings > 0 && (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background:"rgba(34,197,94,0.1)",color:"#16a34a" }}>
                          💰 Saved ₹{txn.savings} vs DISCOM
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── SELL HISTORY ── */}
          {tab === "selling" && (
            <motion.div key="selling" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              {sellTxns.length === 0 ? (
                <div className="text-center py-16" style={{ color:"#9ca3af" }}>
                  No selling history yet.
                  <button onClick={() => navigate("/trade/sell")} className="block mx-auto mt-4 text-sm cursor-none" style={{ color:"#fb8500" }}>Start selling →</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {sellTxns.map((txn, i) => (
                    <motion.div key={txn.id} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
                      transition={{ delay:i*0.07 }} className="p-5 rounded-xl"
                      style={{ background:"#fff",border:"1.5px solid rgba(251,133,0,0.18)",boxShadow:"0 2px 12px rgba(251,133,0,0.06)" }}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",color:"#fb8500",letterSpacing:"0.04em" }}>⚡ {txn.units} kWh</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"rgba(34,197,94,0.1)",color:"#16a34a" }}>✓ {txn.status||"Completed"}</span>
                          </div>
                          <div className="text-xs" style={{ color:"#9ca3af" }}>#{txn.id} · {txn.discom} · {txn.city}, {txn.state}</div>
                        </div>
                        <div className="text-right">
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#fb8500" }}>
                            ₹{typeof txn.amount==="number"?txn.amount.toFixed(2):txn.amount}
                          </div>
                          <div className="text-xs" style={{ color:"#9ca3af" }}>{txn.date}</div>
                        </div>
                      </div>
                      {txn.earnings > 0 && (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background:"rgba(245,158,11,0.1)",color:"#f59e0b" }}>
                          📈 Earned ₹{txn.earnings} extra vs DISCOM
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── P2P SHARING ── */}
          {tab === "energy" && (
            <motion.div key="energy" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              <p className="text-sm mb-6" style={{ color:"#6b7280" }}>Peer-to-peer energy sharing history with other WattXchange users</p>
              <div className="flex flex-col gap-4">
                {MOCK_SHARING.map((es, i) => (
                  <motion.div key={es.id} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
                    transition={{ delay:i*0.08 }}
                    className="flex items-center justify-between p-5 rounded-xl"
                    style={{ background:"#fff",border:`1.5px solid ${es.direction==="sent"?"rgba(251,133,0,0.18)":"rgba(245,158,11,0.18)"}` }}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{es.direction==="sent"?"📤":"📥"}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color:"#111827" }}>
                          {es.direction==="sent"?"Shared with":"Received from"} {es.partner}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color:"#9ca3af" }}>
                          {es.units} kWh · ₹{es.rate}/kWh · {es.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",color:es.direction==="sent"?"#fb8500":"#f59e0b" }}>
                        {es.direction==="sent"?"-":"+"}{es.units} kWh
                      </div>
                      <div className="text-xs font-bold" style={{ color:es.direction==="sent"?"#fb8500":"#16a34a" }}>
                        ₹{(es.units*es.rate).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
