import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const InputField = ({ label, type = "text", placeholder, value, onChange, icon }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase font-semibold mb-2"
      style={{ color: "rgba(253,246,227,0.45)" }}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
          style={{ color: "rgba(255,183,3,0.5)" }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent rounded-xl py-3.5 text-sm outline-none transition-all duration-300 cursor-text"
        style={{
          paddingLeft: icon ? "2.8rem" : "1.2rem",
          paddingRight: "1.2rem",
          border: "1.5px solid rgba(255,183,3,0.18)",
          color: "#fdf6e3",
        }}
        onFocus={e => e.target.style.borderColor = "#ffb703"}
        onBlur={e  => e.target.style.borderColor = "rgba(255,183,3,0.18)"}
      />
    </div>
  </div>
);

const AuthModal = ({ onClose, onSuccess, intent = null }) => {
  const { login, register } = useAuth();
  const [mode, setMode]           = useState("login"); // login | signup
  const [loginMethod, setMethod]  = useState("email"); // email | phone
  const [step, setStep]           = useState(1);       // signup: 1=creds, 2=details
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  // Form state
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [mobile,   setMobile]   = useState("");
  const [otp,      setOtp]      = useState("");
  const [otpSent,  setOtpSent]  = useState(false);

  const accentGold   = "#ffb703";
  const accentOrange = "#fb8500";

  const handleLogin = async () => {
    setError("");
    if (!email && !phone) { setError("Please enter email or phone number"); return; }
    setLoading(true);
    setTimeout(() => {
      login({ name: "User", email: email || `${phone}@wx.in`, mobile: phone || "", avatar: "U" });
      setLoading(false);
      onSuccess?.();
      onClose();
    }, 1000);
  };

  const handleSignupStep1 = () => {
    setError("");
    if (!email) { setError("Email is required"); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setStep(2);
  };

  const handleSignupComplete = () => {
    setError("");
    if (!name.trim()) { setError("Full name is required"); return; }
    if (!mobile || mobile.length < 10) { setError("Valid 10-digit mobile number required"); return; }
    setLoading(true);
    setTimeout(() => {
      register({ name: name.trim(), email, mobile, password });
      setLoading(false);
      onSuccess?.();
      onClose();
    }, 1000);
  };

  const sendOtp = () => {
    if (!phone || phone.length < 10) { setError("Enter a valid 10-digit number"); return; }
    setOtpSent(true);
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[800] flex items-center justify-center px-4"
      style={{ background: "rgba(2,48,71,0.92)", backdropFilter: "blur(16px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1,   y: 0,  opacity: 1 }}
        exit={{   scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#0a2535", border: "1.5px solid rgba(255,183,3,0.2)" }}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(255,183,3,0.1)" }}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-none"
            style={{ background: "rgba(255,183,3,0.1)", color: "rgba(253,246,227,0.5)" }}
          >✕</button>

          <div className="font-display text-3xl mb-1" style={{ color: accentGold }}>
            {mode === "login" ? "Welcome Back" : "Join WattXchange"}
          </div>
          <p className="text-sm" style={{ color: "rgba(253,246,227,0.45)" }}>
            {mode === "login"
              ? "Sign in to continue trading energy"
              : step === 1 ? "Create your account" : "Almost there — tell us about you"}
          </p>

          {intent && (
            <div className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(255,183,3,0.1)", color: accentGold }}>
              ⚡ Sign in to {intent === "buy" ? "buy" : "sell"} energy
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex px-8 pt-6 gap-3 mb-5">
          {["login","signup"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setStep(1); setError(""); }}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase cursor-none transition-all duration-300"
              style={{
                background: mode === m ? `linear-gradient(135deg,${accentGold},${accentOrange})` : "rgba(255,183,3,0.07)",
                color:      mode === m ? "#023047" : "rgba(253,246,227,0.45)",
              }}
            >{m === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            {/* ── LOGIN ── */}
            {mode === "login" && (
              <motion.div key="login"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Method toggle */}
                <div className="flex rounded-lg overflow-hidden" style={{ border:"1px solid rgba(255,183,3,0.15)" }}>
                  {["email","phone"].map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider cursor-none transition-all"
                      style={{
                        background: loginMethod === m ? "rgba(255,183,3,0.15)" : "transparent",
                        color:      loginMethod === m ? accentGold : "rgba(253,246,227,0.38)",
                      }}>
                      {m === "email" ? "📧 Email" : "📱 Phone"}
                    </button>
                  ))}
                </div>

                {loginMethod === "email" ? (
                  <>
                    <InputField label="Email" type="email" placeholder="you@example.com" icon="📧"
                      value={email} onChange={e => setEmail(e.target.value)} />
                    <InputField label="Password" type="password" placeholder="••••••••" icon="🔒"
                      value={password} onChange={e => setPassword(e.target.value)} />
                  </>
                ) : (
                  <>
                    <InputField label="Mobile Number" type="tel" placeholder="10-digit mobile" icon="📱"
                      value={phone} onChange={e => setPhone(e.target.value.replace(/\D/,"").slice(0,10))} />
                    {!otpSent ? (
                      <button onClick={sendOtp}
                        className="py-3 rounded-xl text-sm font-bold cursor-none transition-all"
                        style={{ background:"rgba(255,183,3,0.12)", color:accentGold, border:"1px solid rgba(255,183,3,0.2)" }}>
                        Send OTP
                      </button>
                    ) : (
                      <InputField label="Enter OTP" placeholder="6-digit OTP" icon="🔑"
                        value={otp} onChange={e => setOtp(e.target.value.slice(0,6))} />
                    )}
                  </>
                )}

                {error && <p className="text-xs font-semibold" style={{ color:"#f87171" }}>⚠ {error}</p>}

                <motion.button onClick={handleLogin} disabled={loading}
                  whileHover={!loading ? { scale:1.02 } : {}} whileTap={!loading ? { scale:0.97 } : {}}
                  className="mt-2 w-full py-4 rounded-xl font-display text-xl tracking-widest cursor-none"
                  style={{ background:`linear-gradient(135deg,${accentGold},${accentOrange})`, color:"#023047" }}>
                  {loading ? "Signing In..." : "Sign In →"}
                </motion.button>
              </motion.div>
            )}

            {/* ── SIGNUP STEP 1 ── */}
            {mode === "signup" && step === 1 && (
              <motion.div key="signup1"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.3 }}
                className="flex flex-col gap-4"
              >
                <InputField label="Email Address" type="email" placeholder="you@example.com" icon="📧"
                  value={email} onChange={e => setEmail(e.target.value)} />
                <InputField label="Password" type="password" placeholder="Min 6 characters" icon="🔒"
                  value={password} onChange={e => setPassword(e.target.value)} />

                {error && <p className="text-xs font-semibold" style={{ color:"#f87171" }}>⚠ {error}</p>}

                <motion.button onClick={handleSignupStep1}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="mt-2 w-full py-4 rounded-xl font-display text-xl tracking-widest cursor-none"
                  style={{ background:`linear-gradient(135deg,${accentGold},${accentOrange})`, color:"#023047" }}>
                  Continue →
                </motion.button>
              </motion.div>
            )}

            {/* ── SIGNUP STEP 2 ── */}
            {mode === "signup" && step === 2 && (
              <motion.div key="signup2"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.3 }}
                className="flex flex-col gap-4"
              >
                <InputField label="Full Name" placeholder="Your full name" icon="👤"
                  value={name} onChange={e => setName(e.target.value)} />
                <InputField label="Mobile Number" type="tel" placeholder="10-digit mobile number" icon="📱"
                  value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/,"").slice(0,10))} />

                <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background:"rgba(255,183,3,0.08)", color:"rgba(253,246,227,0.5)" }}>
                  📧 Registered: <span style={{ color:accentGold }}>{email}</span>
                </div>

                {error && <p className="text-xs font-semibold" style={{ color:"#f87171" }}>⚠ {error}</p>}

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold cursor-none"
                    style={{ background:"rgba(255,183,3,0.08)", color:"rgba(253,246,227,0.55)", border:"1px solid rgba(255,183,3,0.15)" }}>
                    ← Back
                  </button>
                  <motion.button onClick={handleSignupComplete} disabled={loading}
                    whileHover={!loading ? { scale:1.02 } : {}} whileTap={!loading ? { scale:0.97 } : {}}
                    className="flex-[2] py-3 rounded-xl font-display text-lg tracking-widest cursor-none"
                    style={{ background:`linear-gradient(135deg,${accentGold},${accentOrange})`, color:"#023047" }}>
                    {loading ? "Creating..." : "Create Account ✓"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
