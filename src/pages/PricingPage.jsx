import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useCustomCursor from "../hooks/useCustomCursor";

/* ── Animated rate comparison row ── */
const RateRow = ({ label, rate, highlight, delay, isSavings }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center justify-between py-4 px-5 rounded-xl"
    style={{
      background: highlight ? "rgba(255,183,3,0.1)" : "rgba(253,246,227,0.04)",
      border: `1.5px solid ${highlight ? "rgba(255,183,3,0.3)" : "rgba(255,183,3,0.08)"}`,
    }}
  >
    <div>
      <div
        className="text-xs tracking-widest uppercase font-semibold mb-0.5"
        style={{ color: highlight ? "#ffb703" : "rgba(253,246,227,0.45)" }}
      >
        {label}
      </div>
    </div>
    <div className="text-right">
      <span
        className="font-display text-3xl"
        style={{ color: highlight ? "#ffb703" : "#fdf6e3", letterSpacing: "0.04em" }}
      >
        ₹{rate.toFixed(2)}
      </span>
      <span className="text-xs ml-1" style={{ color: "rgba(253,246,227,0.4)" }}>/kWh</span>
    </div>
  </motion.div>
);

/* ── Main Pricing Page ── */
const PricingPage = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { type }    = useParams();
  const { hoverProps } = useCustomCursor();

  const { selectedState, selectedCity, selectedDiscom } = location.state || {};
  const isBuy   = type === "buy";
  const accent  = isBuy ? "#ffb703" : "#fb8500";
  const discom  = selectedDiscom;

  const [units, setUnits]       = useState("");
  const [calculated, setCalc]   = useState(false);

  // If no data passed, redirect back
  useEffect(() => {
    if (!discom) navigate("/market");
  }, [discom, navigate]);

  if (!discom) return null;

  const discomRate  = isBuy ? discom.buyRate   : discom.sellRate;
  const wattxRate   = isBuy ? discom.wattxBuyRate : discom.wattxSellRate;
  const diff        = Math.abs(discomRate - wattxRate);

  const unitNum     = parseFloat(units) || 0;
  const totalWattx  = (unitNum * wattxRate).toFixed(2);
  const totalDiscom = (unitNum * discomRate).toFixed(2);
  const savings     = (Math.abs(parseFloat(totalDiscom) - parseFloat(totalWattx))).toFixed(2);

  const handleCalculate = () => {
    if (unitNum > 0) setCalc(true);
  };

  const handlePayment = () => {
    navigate(`/trade/${type}/payment`, {
      state: {
        selectedState,
        selectedCity,
        selectedDiscom: discom,
        units: unitNum,
        totalAmount: parseFloat(totalWattx),
        wattxRate,
      },
    });
  };

  return (
    <div
      className="relative min-h-screen pt-[72px] overflow-hidden"
      style={{ background: isBuy ? "#023047" : "#1f2937" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,183,3,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,183,3,0.03) 1px,transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
          filter: "blur(80px)",
          bottom: -200, left: -150,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/trade/${type}`)}
          {...hoverProps}
          whileHover={{ x: -4, color: accent }}
          className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8 cursor-none outline-none transition-colors"
          style={{ color: "rgba(253,246,227,0.4)" }}
        >
          ← Change DISCOM
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: accent }}
          >
            {isBuy ? "☀️ Buy Energy" : "⚡ Sell Energy"} — Pricing Details
          </p>
          <h1
            className="font-display mb-2"
            style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: "#fdf6e3" }}
          >
            {isBuy ? "Your Energy Cost" : "Your Earnings"}
          </h1>

          {/* Location breadcrumb */}
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {[selectedState, selectedCity, discom.name].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: "rgba(255,183,3,0.3)" }}>›</span>}
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {item}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Rate comparison cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p
            className="text-xs tracking-widest uppercase mb-3 font-semibold"
            style={{ color: "rgba(253,246,227,0.38)" }}
          >
            Rate Comparison
          </p>
          <div className="flex flex-col gap-3">
            <RateRow
              label={isBuy ? `DISCOM Selling Rate (${discom.name})` : `DISCOM Buying Rate (${discom.name})`}
              rate={discomRate}
              highlight={false}
              delay={0.25}
            />
            <div className="flex items-center gap-3 px-2">
              <div className="flex-1 h-px" style={{ background: "rgba(255,183,3,0.12)" }} />
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: isBuy ? "rgba(34,197,94,0.15)" : "rgba(255,183,3,0.15)",
                  color:      isBuy ? "#4ade80"               : "#ffb703",
                }}
              >
                {isBuy ? `💰 WattXchange saves you ₹${diff.toFixed(2)}/kWh` : `📈 WattXchange pays ₹${diff.toFixed(2)}/kWh more`}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,183,3,0.12)" }} />
            </div>
            <RateRow
              label="WattXchange Rate"
              rate={wattxRate}
              highlight={true}
              delay={0.35}
            />
          </div>
        </motion.div>

        {/* Units input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6"
        >
          <p
            className="text-xs tracking-widest uppercase mb-3 font-semibold"
            style={{ color: "rgba(253,246,227,0.38)" }}
          >
            {isBuy ? "How many units do you want to buy?" : "How many units do you want to sell?"}
          </p>

          <div
            className="relative flex items-center rounded-xl overflow-hidden"
            style={{ border: `1.5px solid ${calculated ? accent : "rgba(255,183,3,0.2)"}` }}
          >
            <input
              type="number"
              min="1"
              value={units}
              onChange={(e) => { setUnits(e.target.value); setCalc(false); }}
              placeholder="Enter units (kWh)..."
              className="flex-1 bg-transparent px-5 py-4 text-lg font-medium outline-none cursor-text"
              style={{ color: "#fdf6e3" }}
            />
            <div
              className="px-5 py-4 text-sm font-bold tracking-widest"
              style={{ color: "rgba(253,246,227,0.4)", borderLeft: "1px solid rgba(255,183,3,0.12)" }}
            >
              kWh
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 6px 28px ${accent}44` }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCalculate}
            {...hoverProps}
            disabled={!units || parseFloat(units) <= 0}
            className="w-full mt-3 py-4 font-display text-xl tracking-widest cursor-none btn-clip-sm transition-all duration-300"
            style={{
              background: units && parseFloat(units) > 0 ? `linear-gradient(135deg,${accent},#fb8500)` : "rgba(255,183,3,0.1)",
              color:      units && parseFloat(units) > 0 ? "#023047"                                      : "rgba(253,246,227,0.3)",
            }}
          >
            Calculate {isBuy ? "Cost" : "Earnings"}
          </motion.button>
        </motion.div>

        {/* Calculated result */}
        <AnimatePresence>
          {calculated && unitNum > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${accent}44` }}
            >
              {/* Result header */}
              <div
                className="px-6 py-4"
                style={{ background: `linear-gradient(135deg,${accent}18,rgba(251,133,0,0.08))` }}
              >
                <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: accent }}>
                  {isBuy ? "Your Total Cost" : "Your Total Earnings"}
                </p>
              </div>

              {/* Breakdown */}
              <div className="px-6 py-5 flex flex-col gap-4">
                {/* DISCOM cost */}
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: "rgba(253,246,227,0.5)" }}>
                    {discom.name} would charge/pay
                  </span>
                  <span className="font-display text-2xl line-through" style={{ color: "rgba(253,246,227,0.3)", letterSpacing: "0.04em" }}>
                    ₹{totalDiscom}
                  </span>
                </div>

                {/* WattXchange total */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#fdf6e3" }}>
                    WattXchange rate ({unitNum} kWh × ₹{wattxRate})
                  </span>
                  <span className="font-display text-4xl" style={{ color: accent, letterSpacing: "0.04em" }}>
                    ₹{totalWattx}
                  </span>
                </div>

                <div className="h-px" style={{ background: "rgba(255,183,3,0.1)" }} />

                {/* Savings */}
                <div
                  className="flex justify-between items-center px-4 py-3 rounded-lg"
                  style={{ background: isBuy ? "rgba(34,197,94,0.1)" : "rgba(255,183,3,0.1)" }}
                >
                  <span className="text-sm font-bold" style={{ color: isBuy ? "#4ade80" : "#ffb703" }}>
                    {isBuy ? "💰 You save" : "📈 Extra earnings vs DISCOM"}
                  </span>
                  <span className="font-display text-2xl" style={{ color: isBuy ? "#4ade80" : "#ffb703" }}>
                    ₹{savings}
                  </span>
                </div>
              </div>

              {/* Proceed button — only for buyer */}
              {isBuy && (
                <motion.button
                  whileHover={{ boxShadow: "0 8px 40px rgba(255,183,3,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  {...hoverProps}
                  className="w-full py-5 font-display text-2xl tracking-widest cursor-none"
                  style={{
                    background: "linear-gradient(135deg,#ffb703,#fb8500)",
                    color: "#023047",
                  }}
                >
                  Proceed to Payment →
                </motion.button>
              )}

              {/* For seller — confirm listing */}
              {!isBuy && (
                <motion.button
                  whileHover={{ boxShadow: "0 8px 40px rgba(251,133,0,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/market")}
                  {...hoverProps}
                  className="w-full py-5 font-display text-2xl tracking-widest cursor-none"
                  style={{
                    background: "linear-gradient(135deg,#fb8500,#ffb703)",
                    color: "#1f2937",
                  }}
                >
                  Confirm Listing ✓
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PricingPage;
