import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomCursor from "../hooks/useCustomCursor";

/* ── Payment method button ── */
const PayMethod = ({ icon, label, selected, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-none outline-none transition-all duration-300"
    style={{
      background:   selected ? "rgba(255,183,3,0.14)" : "rgba(253,246,227,0.04)",
      border:       `1.5px solid ${selected ? "#ffb703" : "rgba(255,183,3,0.1)"}`,
      boxShadow:    selected ? "0 0 0 1px rgba(255,183,3,0.3), 0 4px 20px rgba(255,183,3,0.15)" : "none",
    }}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-semibold tracking-wide" style={{ color: selected ? "#ffb703" : "rgba(253,246,227,0.55)" }}>
      {label}
    </span>
  </motion.button>
);

/* ── Input field ── */
const Field = ({ label, placeholder, type = "text", maxLength, value, onChange }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase font-semibold mb-2" style={{ color: "rgba(253,246,227,0.45)" }}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 cursor-text"
      style={{
        border: "1.5px solid rgba(255,183,3,0.18)",
        color: "#fdf6e3",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#ffb703")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,183,3,0.18)")}
    />
  </div>
);

/* ── Success overlay ── */
const SuccessOverlay = ({ amount, units, onDone }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[999] flex items-center justify-center"
    style={{ background: "rgba(2,48,71,0.97)", backdropFilter: "blur(20px)" }}
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
      className="text-center px-8 max-w-md"
    >
      {/* Pulsing success ring */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center text-5xl"
        style={{ border: "3px solid #ffb703", background: "rgba(255,183,3,0.1)" }}
      >
        ✓
      </motion.div>

      <h2 className="font-display text-5xl mb-4" style={{ color: "#ffb703" }}>
        Payment Done!
      </h2>
      <p className="text-lg font-light mb-2" style={{ color: "#fdf6e3" }}>
        ₹{amount} paid successfully
      </p>
      <p className="text-sm mb-8" style={{ color: "rgba(253,246,227,0.5)" }}>
        {units} kWh will be delivered to your meter within 24 hours
      </p>

      {/* Confetti dots */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            background: i % 2 === 0 ? "#ffb703" : "#fb8500",
            top: "50%", left: "50%",
          }}
          animate={{
            x: Math.cos((i / 12) * Math.PI * 2) * (120 + Math.random() * 80),
            y: Math.sin((i / 12) * Math.PI * 2) * (120 + Math.random() * 80),
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 1.5, delay: 0.2 + i * 0.05, ease: "easeOut" }}
        />
      ))}

      <motion.button
        whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(255,183,3,0.5)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onDone}
        className="btn-clip px-12 py-4 font-display text-xl tracking-widest cursor-none"
        style={{ background: "linear-gradient(135deg,#ffb703,#fb8500)", color: "#023047" }}
      >
        Back to Market
      </motion.button>
    </motion.div>
  </motion.div>
);

/* ── Main Payment Page ── */
const PaymentGateway = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { hoverProps } = useCustomCursor();

  const { selectedState, selectedCity, selectedDiscom, units, totalAmount, wattxRate } = location.state || {};

  const [method, setMethod]       = useState("upi");
  const [upiId, setUpiId]         = useState("");
  const [cardNum, setCardNum]     = useState("");
  const [cardName, setCardName]   = useState("");
  const [expiry, setExpiry]       = useState("");
  const [cvv, setCvv]             = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess]     = useState(false);

  if (!totalAmount) {
    navigate("/market");
    return null;
  }

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2200);
  };

  const isValid = () => {
    if (method === "upi")   return upiId.includes("@");
    if (method === "card")  return cardNum.replace(/\s/g, "").length === 16 && cardName && expiry && cvv.length === 3;
    if (method === "netbanking") return true;
    if (method === "wallet") return true;
    return false;
  };

  const formatCard = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? clean.slice(0, 2) + "/" + clean.slice(2) : clean;
  };

  return (
    <div
      className="relative min-h-screen pt-[72px] overflow-hidden"
      style={{ background: "#023047" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,183,3,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,183,3,0.03) 1px,transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(255,183,3,0.12) 0%, transparent 65%)",
          filter: "blur(80px)",
          top: -100, right: -100,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          {...hoverProps}
          whileHover={{ x: -4, color: "#ffb703" }}
          className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8 cursor-none outline-none transition-colors"
          style={{ color: "rgba(253,246,227,0.4)" }}
        >
          ← Go Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: "#fb8500" }}>
            🔒 Secure Payment Gateway
          </p>
          <h1 className="font-display mb-1" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#fdf6e3" }}>
            Complete Your Purchase
          </h1>
          <p style={{ color: "rgba(253,246,227,0.45)", fontSize: "0.9rem" }}>
            {selectedCity}, {selectedState} · {selectedDiscom?.name}
          </p>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: "rgba(255,183,3,0.07)", border: "1.5px solid rgba(255,183,3,0.18)" }}
        >
          <p className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: "rgba(253,246,227,0.38)" }}>
            Order Summary
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: "rgba(253,246,227,0.55)" }}>Energy units</span>
              <span style={{ color: "#fdf6e3", fontWeight: 600 }}>{units} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "rgba(253,246,227,0.55)" }}>Rate per unit</span>
              <span style={{ color: "#fdf6e3", fontWeight: 600 }}>₹{wattxRate}/kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "rgba(253,246,227,0.55)" }}>DISCOM</span>
              <span style={{ color: "#fdf6e3", fontWeight: 600 }}>{selectedDiscom?.name}</span>
            </div>
            <div className="h-px" style={{ background: "rgba(255,183,3,0.12)" }} />
            <div className="flex justify-between items-center">
              <span className="font-semibold" style={{ color: "#fdf6e3" }}>Total Amount</span>
              <span className="font-display text-4xl" style={{ color: "#ffb703", letterSpacing: "0.04em" }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: "rgba(253,246,227,0.38)" }}>
            Choose Payment Method
          </p>
          <div className="grid grid-cols-4 gap-3">
            <PayMethod icon="📱" label="UPI"         selected={method === "upi"}        onClick={() => setMethod("upi")}        delay={0.35} />
            <PayMethod icon="💳" label="Card"        selected={method === "card"}       onClick={() => setMethod("card")}       delay={0.4}  />
            <PayMethod icon="🏦" label="Net Banking" selected={method === "netbanking"} onClick={() => setMethod("netbanking")} delay={0.45} />
            <PayMethod icon="👛" label="Wallet"      selected={method === "wallet"}     onClick={() => setMethod("wallet")}     delay={0.5}  />
          </div>
        </motion.div>

        {/* Payment form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 rounded-2xl p-6"
            style={{ background: "rgba(253,246,227,0.04)", border: "1.5px solid rgba(255,183,3,0.1)" }}
          >
            {method === "upi" && (
              <div className="flex flex-col gap-4">
                <Field
                  label="UPI ID"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <div
                  className="flex items-center gap-3 p-3 rounded-lg text-xs"
                  style={{ background: "rgba(255,183,3,0.08)", color: "rgba(253,246,227,0.5)" }}
                >
                  📲 Supports GPay, PhonePe, Paytm, BHIM, and all UPI apps
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="flex flex-col gap-4">
                <Field
                  label="Card Number"
                  placeholder="0000 0000 0000 0000"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCard(e.target.value))}
                />
                <Field
                  label="Cardholder Name"
                  placeholder="Name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                  <Field
                    label="CVV"
                    placeholder="•••"
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  />
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div className="grid grid-cols-3 gap-3">
                {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((bank, i) => (
                  <motion.button
                    key={bank}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="py-3 rounded-lg text-sm font-semibold cursor-none"
                    style={{
                      background: "rgba(255,183,3,0.08)",
                      border: "1.5px solid rgba(255,183,3,0.14)",
                      color: "#fdf6e3",
                    }}
                  >
                    {bank}
                  </motion.button>
                ))}
              </div>
            )}

            {method === "wallet" && (
              <div className="grid grid-cols-3 gap-3">
                {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge", "Airtel"].map((w, i) => (
                  <motion.button
                    key={w}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="py-3 rounded-lg text-xs font-semibold cursor-none"
                    style={{
                      background: "rgba(251,133,0,0.08)",
                      border: "1.5px solid rgba(251,133,0,0.14)",
                      color: "#fdf6e3",
                    }}
                  >
                    {w}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pay button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          whileHover={isValid() && !processing ? { scale: 1.02, boxShadow: "0 10px 48px rgba(255,183,3,0.55)" } : {}}
          whileTap={isValid() && !processing ? { scale: 0.98 } : {}}
          onClick={isValid() && !processing ? handlePay : undefined}
          {...hoverProps}
          className="w-full py-5 font-display text-2xl tracking-widest cursor-none transition-all duration-300 relative overflow-hidden btn-clip"
          style={{
            background: isValid() ? "linear-gradient(135deg,#ffb703,#fb8500)" : "rgba(255,183,3,0.1)",
            color:      isValid() ? "#023047"                                   : "rgba(253,246,227,0.25)",
          }}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
              Processing...
            </span>
          ) : (
            `Pay ₹${totalAmount.toFixed(2)} →`
          )}
        </motion.button>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-center text-xs mt-4"
          style={{ color: "rgba(253,246,227,0.25)" }}
        >
          🔒 256-bit SSL encrypted · PCI DSS compliant · RBI regulated
        </motion.p>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <SuccessOverlay
            amount={totalAmount.toFixed(2)}
            units={units}
            onDone={() => navigate("/market")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentGateway;
