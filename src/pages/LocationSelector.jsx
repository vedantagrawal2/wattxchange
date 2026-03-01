import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { INDIA_DATA, STATES } from "../data/india_data";
import StepIndicator from "../components/StepIndicator";
import useCustomCursor from "../hooks/useCustomCursor";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const STEPS = ["Location", "DISCOM"];

/* Popular cities with their states */
const POPULAR_CITIES = [
  { city: "Indore",   state: "Madhya Pradesh" },
  { city: "Bhopal",   state: "Madhya Pradesh" },
  { city: "Mumbai",   state: "Maharashtra"    },
  { city: "Delhi",    state: "Delhi"          },
  { city: "Gurugram", state: "Haryana"        },
  { city: "Pune",     state: "Maharashtra"    },
  { city: "Bangalore", state: "Karnataka"     },
  { city: "Hyderabad", state: "Telangana"     },
];

/* Build a flat city → state lookup from all india_data */
const buildCityIndex = () => {
  const index = [];
  Object.entries(INDIA_DATA).forEach(([stateName, stateData]) => {
    (stateData.cities || []).forEach((city) => {
      index.push({ city, state: stateName });
    });
  });
  return index;
};

const CITY_INDEX = buildCityIndex();

const LocationSelector = () => {
  const navigate   = useNavigate();
  const { type }   = useParams();
  const { hoverProps } = useCustomCursor();
  const { user }   = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [step, setStep]     = useState(0); // 0=location, 1=discom
  const [state, setState]   = useState(null);
  const [city, setCity]     = useState(null);
  const [discom, setDiscom] = useState(null);

  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const inputRef                = useRef(null);

  const isBuy   = type === "buy";
  const accent  = isBuy ? "#f59e0b" : "#fb8500";
  const accentBg = isBuy ? "rgba(245,158,11,0.08)" : "rgba(251,133,0,0.08)";

  /* Search logic */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    const filtered = CITY_INDEX.filter(
      ({ city: c, state: s }) =>
        c.toLowerCase().includes(q) || s.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(filtered);
  }, [query]);

  const selectCity = (c, s) => {
    setCity(c);
    setState(s);
    setQuery("");
    setResults([]);
    setStep(1);
  };

  const pickDiscom = (d) => {
    setDiscom(d);
    navigate(`/trade/${type}/pricing`, {
      state: { selectedState: state, selectedCity: city, selectedDiscom: d },
    });
  };

  const goBack = () => {
    if (step === 0) navigate("/market");
    else { setStep(0); setState(null); setCity(null); }
  };

  const discoms = state ? (INDIA_DATA[state]?.discoms || []) : [];

  /* Auth gate */
  if (!user) {
    return (
      <div
        className="relative min-h-screen pt-[72px] flex items-center justify-center"
        style={{ background: "#f9fafb" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="text-center px-8 max-w-md"
        >
          <div className="text-6xl mb-6">{isBuy ? "☀️" : "⚡"}</div>
          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: accent, letterSpacing: "0.04em" }}
            className="mb-4"
          >
            Sign In to {isBuy ? "Buy" : "Sell"} Energy
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
            Create a free account to start trading energy on WattXchange. It takes under 2 minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 8px 32px ${accent}44` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAuth(true)}
            className="btn-clip px-10 py-4 font-bold text-sm tracking-widest uppercase cursor-none"
            style={{ background: `linear-gradient(135deg,${accent},#fb8500)`, color: "#fff" }}
          >
            Register / Sign In →
          </motion.button>
          <button
            onClick={() => navigate("/market")}
            className="block mx-auto mt-5 text-xs cursor-none"
            style={{ color: "#9ca3af" }}
          >
            ← Back to Market
          </button>
        </motion.div>
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} intent={type} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen pt-[72px] overflow-hidden"
      style={{ background: "#f9fafb" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Bloom */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          top: -120, right: -120,
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          onClick={goBack}
          {...hoverProps}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8 cursor-none outline-none transition-colors"
          style={{ color: "#9ca3af" }}
        >
          ← Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: accent }}
          >
            {isBuy ? "☀️ Buy Energy" : "⚡ Sell Energy"} — Location Setup
          </p>
          <h1
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,6vw,4rem)", color: "#0f172a", letterSpacing: "0.02em" }}
            className="mb-2"
          >
            {step === 0 ? "Select Your City" : "Select Your DISCOM"}
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            {step === 0
              ? "Search for your city or choose from popular locations"
              : `Distribution company servicing ${city}, ${state}`}
          </p>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} current={step} />

        {/* Selected pills */}
        {(state || city) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-2 flex-wrap justify-center mb-6"
          >
            {city && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
              >
                🏙️ {city}
              </span>
            )}
            {state && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(0,0,0,0.05)", color: "#6b7280", border: "1px solid rgba(0,0,0,0.08)" }}
              >
                📍 {state}
              </span>
            )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 0: CITY SEARCH ── */}
          {step === 0 && (
            <motion.div
              key="location-step"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Search bar */}
              <div className="relative mb-6">
                <div
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${query ? accent : "rgba(0,0,0,0.1)"}`,
                    boxShadow: query ? `0 4px 24px ${accent}20` : "0 2px 12px rgba(0,0,0,0.04)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span style={{ color: "#9ca3af", fontSize: "1.1rem" }}>🔍</span>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search city or state..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 outline-none text-sm bg-transparent cursor-none"
                    style={{ color: "#111827", fontFamily: "'DM Sans', sans-serif" }}
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(""); setResults([]); }}
                      className="cursor-none text-xs"
                      style={{ color: "#9ca3af" }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Search results dropdown */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
                      }}
                    >
                      {results.map(({ city: c, state: s }, i) => (
                        <motion.button
                          key={`${c}-${s}`}
                          onClick={() => selectCity(c, s)}
                          {...hoverProps}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ background: accentBg }}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-none outline-none transition-colors"
                          style={{ borderBottom: i < results.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                        >
                          <div className="flex items-center gap-3">
                            <span style={{ color: "#9ca3af" }}>🏙️</span>
                            <span className="text-sm font-medium" style={{ color: "#111827" }}>{c}</span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ color: "#6b7280", background: "rgba(0,0,0,0.05)" }}
                          >
                            {s}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Popular cities */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#9ca3af" }}>
                  Popular Cities
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {POPULAR_CITIES.map(({ city: c, state: s }, i) => (
                    <motion.button
                      key={c}
                      onClick={() => selectCity(c, s)}
                      {...hoverProps}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      whileHover={{ y: -3, boxShadow: `0 8px 28px ${accent}22` }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-1 px-3 py-5 rounded-2xl cursor-none outline-none transition-all"
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.07)",
                      }}
                    >
                      <span className="text-2xl">🏙️</span>
                      <span className="text-sm font-semibold" style={{ color: "#111827" }}>{c}</span>
                      <span className="text-xs" style={{ color: "#9ca3af" }}>{s}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: DISCOM ── */}
          {step === 1 && (
            <motion.div
              key="discom-step"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              {discoms.map((d, i) => (
                <motion.button
                  key={d.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -2, boxShadow: `0 8px 40px ${accent}22` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => pickDiscom(d)}
                  className="w-full text-left p-6 rounded-2xl cursor-none outline-none"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: accent, letterSpacing: "0.05em" }}
                      >
                        {d.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{d.fullName}</div>
                    </div>

                    {/* Rate badges */}
                    <div className="flex gap-3 shrink-0">
                      <div
                        className="text-center px-4 py-2 rounded-xl"
                        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}
                      >
                        <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>
                          {isBuy ? "DISCOM Rate" : "DISCOM Buys At"}
                        </div>
                        <div
                          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#f59e0b", letterSpacing: "0.05em" }}
                        >
                          ₹{isBuy ? d.buyRate.toFixed(2) : d.sellRate.toFixed(2)}
                        </div>
                        <div className="text-xs" style={{ color: "#9ca3af" }}>/kWh</div>
                      </div>
                      <div
                        className="text-center px-4 py-2 rounded-xl"
                        style={{ background: "rgba(251,133,0,0.08)", border: "1px solid rgba(251,133,0,0.12)" }}
                      >
                        <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#9ca3af" }}>WattX Rate</div>
                        <div
                          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fb8500", letterSpacing: "0.05em" }}
                        >
                          ₹{isBuy ? d.wattxBuyRate.toFixed(2) : d.wattxSellRate.toFixed(2)}
                        </div>
                        <div className="text-xs" style={{ color: "#9ca3af" }}>/kWh</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: isBuy ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                        color: isBuy ? "#16a34a" : "#f59e0b",
                      }}
                    >
                      {isBuy
                        ? `💰 Save ₹${(d.buyRate - d.wattxBuyRate).toFixed(2)}/kWh vs DISCOM`
                        : `📈 Earn ₹${(d.wattxSellRate - d.sellRate).toFixed(2)}/kWh more than DISCOM`}
                    </span>
                    <span className="text-xs" style={{ color: "#d1d5db" }}>Select to continue →</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocationSelector;
