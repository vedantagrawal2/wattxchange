import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useCustomCursor from "../hooks/useCustomCursor";

const MarketCard = ({ type, delay }) => {
  const navigate = useNavigate();
  const { hoverProps } = useCustomCursor();
  const [isHovered, setIsHovered] = useState(false);
  const isBuy = type === "buy";
  const accent = isBuy ? "#f59e0b" : "#fb8500";

  const data = isBuy
    ? {
        icon: "☀️",
        tag: "Energy Procurement",
        title: ["Buy", "Energy"],
        desc: "Access clean, renewable energy directly from certified producers. Get the best rates with real-time bidding and instant settlement.",
        cta: "Start Buying",
        tip: "🔋 Best buy price today: ₹4.2 / kWh",
        img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80",
        stats: [{ label:"Avg Rate", val:"₹4.2/kWh" },{ label:"Min Order", val:"50 kWh" },{ label:"Settlement", val:"< 24 hrs" }],
      }
    : {
        icon: "⚡",
        tag: "Energy Monetization",
        title: ["Sell", "Energy"],
        desc: "Convert your surplus renewable energy into revenue. List capacity, set your price, connect with thousands of verified buyers instantly.",
        cta: "Start Selling",
        tip: "💡 Avg payout this week: ₹5.8 / kWh",
        img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80",
        stats: [{ label:"Avg Rate", val:"₹5.8/kWh" },{ label:"Min List", val:"25 kWh" },{ label:"Payout", val:"24 hrs" }],
      };

  return (
    <motion.div
      className="relative overflow-hidden flex flex-col justify-end cursor-none"
      style={{ minHeight:520, border:`1px solid ${isHovered ? accent+"44" : "rgba(0,0,0,0.07)"}`, borderRadius:20, transition:"border-color 0.3s", background:"#fff" }}
      initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }}
      transition={{ delay,duration:0.7,ease:[0.22,1,0.36,1] }}
      onMouseEnter={() => { setIsHovered(true); hoverProps.onMouseEnter(); }}
      onMouseLeave={() => { setIsHovered(false); hoverProps.onMouseLeave(); }}
    >
      {/* BG Image */}
      <motion.div className="absolute inset-0"
        style={{ backgroundImage:`url(${data.img})`,backgroundSize:"cover",backgroundPosition:"center" }}
        animate={{ scale:isHovered?1.06:1.02,opacity:isHovered?0.22:0.08 }}
        transition={{ duration:0.8,ease:[0.22,1,0.36,1] }}
      />
      {/* Bottom gradient */}
      <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 35%,rgba(255,255,255,0.97) 70%)" }} />

      {/* Hover tip */}
      <div className="hover-tip">{data.tip}</div>

      {/* Content */}
      <div className="relative z-10 p-10">
        <motion.span animate={{ scale:isHovered?1.15:1,rotate:isHovered?-5:0 }}
          transition={{ type:"spring",stiffness:300,damping:15 }} className="text-5xl mb-5 block">
          {data.icon}
        </motion.span>
        <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-2" style={{ color:accent }}>{data.tag}</p>
        <motion.h3 animate={{ color:isHovered?accent:"#0f172a" }} transition={{ duration:0.3 }}
          style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,5vw,5rem)",letterSpacing:"0.04em",lineHeight:0.95,marginBottom:"1rem" }}>
          {data.title[0]}<br/>{data.title[1]}
        </motion.h3>
        <p className="text-sm font-light leading-relaxed mb-6 max-w-xs" style={{ color:"#6b7280" }}>{data.desc}</p>

        {/* Stats row */}
        <div className="flex gap-4 mb-7">
          {data.stats.map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl" style={{ background:isHovered?`${accent}10`:"rgba(0,0,0,0.04)" }}>
              <div className="text-sm font-bold" style={{ color:accent }}>{s.val}</div>
              <div className="text-xs" style={{ color:"#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <motion.button {...hoverProps} onClick={() => navigate(`/trade/${type}`)}
          whileHover={{ boxShadow:`0 6px 28px ${accent}55`,scale:1.03 }} whileTap={{ scale:0.97 }}
          className="btn-clip-sm inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase cursor-none"
          style={{ background:isBuy?"#f59e0b":"#fb8500",color:"#fff" }}>
          <span>{data.cta}</span>
          <motion.span animate={{ x:isHovered?5:0 }} transition={{ duration:0.3 }}>→</motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const Market = () => {
  const navigate = useNavigate();
  const { hoverProps } = useCustomCursor();

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid" />
      <div className="absolute pointer-events-none" style={{ width:500,height:500,top:-150,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Back */}
        <motion.button initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.2 }}
          onClick={() => navigate("/")} {...hoverProps}
          whileHover={{ x:-4 }} className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase cursor-none outline-none"
          style={{ color:"#9ca3af" }}>
          ← Back to Home
        </motion.button>

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }}>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-3" style={{ color:"#fb8500" }}>⚡ Energy Exchange</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,7vw,6rem)",color:"#0f172a",letterSpacing:"0.03em",lineHeight:0.92 }}>
            Watt<span style={{ color:"#f59e0b" }}>X</span>change Market
          </h2>
          <p className="text-base font-light mt-4 max-w-lg leading-relaxed" style={{ color:"#6b7280" }}>
            Choose your trading mode. Buy clean energy at competitive rates or sell your surplus power and earn more than DISCOM buyback.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <MarketCard type="buy"  delay={0.4} />
          <MarketCard type="sell" delay={0.55} />
        </div>

        {/* Trust bar */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
          className="flex items-center justify-center gap-8 py-5 text-xs tracking-widest uppercase flex-wrap"
          style={{ borderTop:"1px solid rgba(0,0,0,0.06)",color:"#9ca3af" }}>
          {["WattXchange © 2025","ISO 27001 Certified","100% Renewable","CERC Regulated"].map((item,i) => (
            <span key={item} className="flex items-center gap-8">
              {i > 0 && <span style={{ color:"#e5e7eb" }}>|</span>}
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Market;
