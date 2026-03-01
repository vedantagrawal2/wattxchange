import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { INDIA_DATA } from "../data/india_data";
import useCustomCursor from "../hooks/useCustomCursor";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const CITY_INDEX = Object.entries(INDIA_DATA).flatMap(([state, d]) =>
  (d.cities || []).map(city => ({ city, state }))
);

const POPULAR = [
  { city:"Indore",    state:"Madhya Pradesh" },
  { city:"Bhopal",    state:"Madhya Pradesh" },
  { city:"Mumbai",    state:"Maharashtra"    },
  { city:"Delhi",     state:"Delhi"          },
  { city:"Gurugram",  state:"Haryana"        },
  { city:"Bengaluru", state:"Karnataka"      },
];

const ProductQuote = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAuth();
  const { hoverProps } = useCustomCursor();
  const [showAuth, setShowAuth] = useState(false);

  const product = location.state?.product;

  const [step, setStep]     = useState(0); // 0=location, 1=quote
  const [city,  setCity]    = useState(null);
  const [state, setState]   = useState(null);
  const [discom, setDiscom] = useState(null);
  const [query, setQuery]   = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    setResults(CITY_INDEX.filter(({ city:c, state:s }) =>
      c.toLowerCase().includes(q) || s.toLowerCase().includes(q)
    ).slice(0, 8));
  }, [query]);

  if (!product) {
    navigate("/products");
    return null;
  }

  const selectCity = (c, s) => {
    setCity(c); setState(s); setQuery(""); setResults([]);
    // Auto-pick first discom
    const d = INDIA_DATA[s]?.discoms?.[0];
    setDiscom(d);
    setStep(1);
  };

  const productPrice = product.price;
  const platformFee  = Math.round(productPrice * 0.025); // 2.5%
  const deliveryFee  = city === "Indore" || city === "Bhopal" ? 0 : Math.round(productPrice * 0.018);
  const gst          = Math.round((productPrice + platformFee + deliveryFee) * 0.18);
  const total        = productPrice + platformFee + deliveryFee + gst;

  const handleOrder = () => {
    if (!user) { setShowAuth(true); return; }
    alert(`Order placed for ${product.name} — ₹${total.toLocaleString("en-IN")} including all charges.`);
    navigate("/active-orders");
  };

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width:450,height:450,top:-120,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <motion.button onClick={() => step===0 ? navigate("/products") : setStep(0)} {...hoverProps}
          whileHover={{ x:-4 }} initial={{ opacity:0,x:-16 }} animate={{ opacity:1,x:0 }}
          className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8 cursor-none" style={{ color:"#9ca3af" }}>
          ← {step===0?"Back to Products":"Change Location"}
        </motion.button>

        {/* Product summary card */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="flex items-center gap-4 p-5 rounded-2xl mb-8"
          style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"rgba(245,158,11,0.1)" }}>{product.emoji}</div>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color:"#111827" }}>{product.name}</div>
            <div className="text-xs" style={{ color:"#9ca3af" }}>{product.category} · WattXchange Store</div>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#f59e0b",letterSpacing:"0.04em" }}>
            ₹{product.price.toLocaleString("en-IN")}
          </div>
        </motion.div>

        {/* Step header */}
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }} className="mb-7">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-1" style={{ color:"#f59e0b" }}>
            {step===0?"Step 1 of 2 — Location":"Step 2 of 2 — Your Quote"}
          </p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",color:"#0f172a",letterSpacing:"0.04em" }}>
            {step===0?"Select Your City":"Delivery Quote"}
          </h2>
          <p className="text-sm mt-1" style={{ color:"#9ca3af" }}>
            {step===0?"We'll calculate delivery charges based on your location.":
              `Delivering to ${city}, ${state}`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── STEP 0: CITY ── */}
          {step===0 && (
            <motion.div key="loc" initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-30 }}
              transition={{ duration:0.3 }}>
              {/* Search */}
              <div className="relative mb-6">
                <div className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                  style={{ background:"#fff",border:`1.5px solid ${query?"#f59e0b":"rgba(0,0,0,0.1)"}`,boxShadow:query?"0 4px 20px rgba(245,158,11,0.15)":"0 2px 8px rgba(0,0,0,0.04)",transition:"all 0.2s" }}>
                  <span style={{ color:"#9ca3af" }}>🔍</span>
                  <input type="text" placeholder="Search city or state..."
                    value={query} onChange={e => setQuery(e.target.value)}
                    className="flex-1 outline-none text-sm bg-transparent cursor-none"
                    style={{ color:"#111827",fontFamily:"'DM Sans',sans-serif" }} autoFocus />
                  {query && <button onClick={() => { setQuery(""); setResults([]); }} className="cursor-none text-xs" style={{ color:"#9ca3af" }}>✕</button>}
                </div>
                <AnimatePresence>
                  {results.length>0 && (
                    <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                      style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.08)",boxShadow:"0 8px 40px rgba(0,0,0,0.1)" }}>
                      {results.map(({ city:c, state:s }, i) => (
                        <button key={`${c}-${s}`} onClick={() => selectCity(c, s)} {...hoverProps}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-none hover:bg-amber-50 transition-colors"
                          style={{ borderBottom:i<results.length-1?"1px solid rgba(0,0,0,0.05)":"none" }}>
                          <div className="flex items-center gap-3">
                            <span style={{ color:"#9ca3af" }}>🏙️</span>
                            <span className="text-sm font-medium" style={{ color:"#111827" }}>{c}</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ color:"#6b7280",background:"rgba(0,0,0,0.05)" }}>{s}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Popular */}
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:"#9ca3af" }}>Popular Cities</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR.map(({ city:c, state:s }, i) => (
                  <motion.button key={c} onClick={() => selectCity(c, s)} {...hoverProps}
                    initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2+i*0.06 }}
                    whileHover={{ y:-3,boxShadow:"0 8px 24px rgba(245,158,11,0.2)" }} whileTap={{ scale:0.97 }}
                    className="flex flex-col items-center gap-1 px-3 py-5 rounded-2xl cursor-none"
                    style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
                    <span className="text-2xl">🏙️</span>
                    <span className="text-sm font-semibold" style={{ color:"#111827" }}>{c}</span>
                    <span className="text-xs" style={{ color:"#9ca3af" }}>{s}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: QUOTE ── */}
          {step===1 && (
            <motion.div key="quote" initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-30 }}
              transition={{ duration:0.3 }}>
              {/* Location pill */}
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background:"rgba(245,158,11,0.12)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.25)" }}>
                  🏙️ {city}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background:"rgba(0,0,0,0.05)",color:"#6b7280" }}>
                  📍 {state}
                </span>
                {discom && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(59,130,246,0.08)",color:"#3b82f6" }}>
                    ⚡ {discom.name}
                  </span>
                )}
              </div>

              {/* Charges breakdown */}
              <div className="rounded-2xl overflow-hidden mb-6"
                style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="px-6 py-4" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)",background:"rgba(245,158,11,0.04)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#9ca3af" }}>Price Breakdown</p>
                </div>
                {[
                  { label:"Product Price",        amount:productPrice, color:"#111827",  note:product.name },
                  { label:"Platform Fee (2.5%)",  amount:platformFee,  color:"#6b7280",  note:"WattXchange marketplace fee" },
                  { label:"Delivery & Logistics", amount:deliveryFee,  color:deliveryFee===0?"#16a34a":"#6b7280", note:deliveryFee===0?"Free — local delivery":"Based on distance from Indore hub" },
                  { label:"GST (18%)",             amount:gst,          color:"#6b7280",  note:"Government tax" },
                ].map((row, i) => (
                  <motion.div key={row.label}
                    initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.1+i*0.08 }}
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom:"1px solid rgba(0,0,0,0.05)" }}>
                    <div>
                      <div className="text-sm font-semibold" style={{ color:row.color }}>{row.label}</div>
                      <div className="text-xs" style={{ color:"#9ca3af" }}>{row.note}</div>
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",color:row.color,letterSpacing:"0.04em" }}>
                      {row.amount===0?"FREE":`₹${row.amount.toLocaleString("en-IN")}`}
                    </div>
                  </motion.div>
                ))}
                {/* Total */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                  className="flex items-center justify-between px-6 py-5"
                  style={{ background:"rgba(245,158,11,0.06)",borderTop:"2px solid rgba(245,158,11,0.2)" }}>
                  <div>
                    <div className="font-bold text-base" style={{ color:"#111827" }}>Total Amount</div>
                    <div className="text-xs" style={{ color:"#9ca3af" }}>All inclusive · No hidden charges</div>
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#f59e0b",letterSpacing:"0.04em" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </div>
                </motion.div>
              </div>

              {/* Delivery info */}
              <div className="p-4 rounded-xl mb-6 flex items-start gap-3"
                style={{ background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.15)" }}>
                <span className="text-lg">🚚</span>
                <div>
                  <div className="text-sm font-bold" style={{ color:"#16a34a" }}>
                    {deliveryFee===0?"Free Local Delivery":"Standard Delivery"}
                  </div>
                  <div className="text-xs" style={{ color:"#6b7280" }}>
                    Estimated delivery: 7–14 working days to {city}, {state}. Installation support available at extra cost.
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.button onClick={handleOrder} {...hoverProps}
                whileHover={{ scale:1.03,boxShadow:"0 12px 40px rgba(245,158,11,0.35)" }} whileTap={{ scale:0.97 }}
                className="w-full py-5 font-bold text-sm tracking-widest uppercase rounded-xl cursor-none"
                style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
                {user?"Confirm Order — ₹"+total.toLocaleString("en-IN"):"Sign In to Place Order"} →
              </motion.button>
              <p className="text-center text-xs mt-3" style={{ color:"#9ca3af" }}>
                Secure checkout · ISO 27001 certified · 30-day return policy
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} />}</AnimatePresence>
    </div>
  );
};

export default ProductQuote;
