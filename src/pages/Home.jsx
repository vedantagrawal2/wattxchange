import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useCustomCursor from "../hooks/useCustomCursor";

/* ── Animated counter ── */
const Counter = ({ value, suffix="", decimals=0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  useEffect(() => {
    if (!inView) return;
    const dur=1800, start=Date.now();
    const tick = () => {
      const p = Math.min((Date.now()-start)/dur, 1);
      const e = 1-Math.pow(1-p, 3);
      setCount(parseFloat((value*e).toFixed(decimals)));
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, decimals]);
  return <span ref={ref}>{decimals>0?count.toFixed(decimals):count}{suffix}</span>;
};

/* ── Inline SVG energy chart ── */
const EnergyChart = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  const data=[18,32,28,45,38,55,48,62,58,72,68,84];
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const W=480,H=140,pad={l:32,r:16,t:12,b:28},maxV=90;
  const pts=data.map((v,i)=>({ x:pad.l+(i/(data.length-1))*(W-pad.l-pad.r), y:pad.t+(1-v/maxV)*(H-pad.t-pad.b) }));
  const pathD=pts.reduce((d,p,i)=>i===0?`M ${p.x} ${p.y}`:d+` L ${p.x} ${p.y}`,"");
  const areaD=pathD+` L ${pts[pts.length-1].x} ${H-pad.b} L ${pts[0].x} ${H-pad.b} Z`;
  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height:140 }}>
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="cr1">
            <motion.rect x="0" y="0" height={H} initial={{ width:0 }} animate={inView?{width:W}:{width:0}} transition={{ duration:2,ease:"easeOut",delay:0.3 }} />
          </clipPath>
        </defs>
        {[0,0.33,0.66,1].map((t,i)=><line key={i} x1={pad.l} x2={W-pad.r} y1={pad.t+t*(H-pad.t-pad.b)} y2={pad.t+t*(H-pad.t-pad.b)} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>)}
        <path d={areaD} fill="url(#cg1)" clipPath="url(#cr1)"/>
        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" clipPath="url(#cr1)"/>
        {pts.map((p,i)=><motion.circle key={i} cx={p.x} cy={p.y} r="3" fill="#f59e0b" initial={{ scale:0,opacity:0 }} animate={inView?{scale:1,opacity:1}:{}} transition={{ delay:0.3+(i/data.length)*1.8,duration:0.3 }}/>)}
        {pts.filter((_,i)=>i%2===0).map((p,i)=><text key={i} x={p.x} y={H-4} textAnchor="middle" fill="#9ca3af" fontSize="8">{months[i*2]}</text>)}
      </svg>
    </div>
  );
};

/* ── Carbon footprint bar chart ── */
const CarbonChart = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  const data=[
    { m:"Aug", tons:142 },{ m:"Sep", tons:198 },{ m:"Oct", tons:175 },
    { m:"Nov", tons:241 },{ m:"Dec", tons:215 },{ m:"Jan", tons:308 },
  ];
  const max=350;
  const W=460,H=130,pad={l:28,r:12,t:12,b:28};
  const barW=42, gap=(W-pad.l-pad.r-data.length*barW)/(data.length+1);

  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height:130 }}>
        <defs>
          <linearGradient id="cgCarbon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        {data.map((d,i)=>{
          const x = pad.l + gap*(i+1) + barW*i;
          const bh = ((d.tons/max)*(H-pad.t-pad.b));
          const y = H-pad.b-bh;
          return (
            <g key={d.m}>
              <motion.rect x={x} width={barW} rx="4"
                initial={{ height:0,y:H-pad.b }} animate={inView?{height:bh,y}:{height:0,y:H-pad.b}}
                transition={{ delay:0.2+i*0.1,duration:0.8,ease:[0.22,1,0.36,1] }}
                fill="url(#cgCarbon)"
              />
              <text x={x+barW/2} y={H-4} textAnchor="middle" fill="#9ca3af" fontSize="8">{d.m}</text>
              <motion.text x={x+barW/2} textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="700"
                initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.5+i*0.1 }}
                style={{ y: y-4 }}>
                {d.tons}t
              </motion.text>
            </g>
          );
        })}
        {/* Y-axis label */}
        <text x={4} y={pad.t+10} fill="#d1d5db" fontSize="7" transform={`rotate(-90,6,${pad.t+10})`} textAnchor="middle">CO₂ tonnes</text>
      </svg>
    </div>
  );
};

/* ── Donut chart ── */
const DonutChart = () => {
  const ref=useRef(null);
  const inView=useInView(ref,{once:true});
  const segs=[
    { label:"Solar",   pct:44, color:"#f59e0b" },
    { label:"Wind",    pct:31, color:"#3b82f6" },
    { label:"Hydro",   pct:16, color:"#0891b2" },
    { label:"Biomass", pct:9,  color:"#16a34a" },
  ];
  const cx=60,cy=60,r=48,stroke=18,c=2*Math.PI*r;
  let cum=0;
  return (
    <div ref={ref} className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" style={{ width:120,height:120,flexShrink:0 }}>
        {segs.map((s,i)=>{ const off=c-(s.pct/100)*c; const rot=(cum/100)*360-90; cum+=s.pct;
          return <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={c} initial={{ strokeDashoffset:c }} animate={inView?{strokeDashoffset:off}:{}} transition={{ duration:1.4,delay:0.2+i*0.2,ease:"easeOut" }} style={{ transform:`rotate(${rot}deg)`,transformOrigin:"center" }}/>;
        })}
        <text x={cx} y={cy-4} textAnchor="middle" fill="#111827" fontSize="11" fontWeight="700">India</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="#9ca3af" fontSize="7">Energy Mix</text>
      </svg>
      <div className="flex flex-col gap-2">
        {segs.map(s=>(
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:s.color }}/>
            <span className="text-xs" style={{ color:"#374151" }}>{s.label}</span>
            <span className="text-xs font-bold ml-auto" style={{ color:s.color }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Energy source cards ── */
const ENERGY_SOURCES = [
  { id:"solar",   label:"Solar",   tag:"Photovoltaic",  stat:"₹2.80/kWh", emoji:"☀️", desc:"Harness sunlight from rooftop PV panels and utility-scale solar farms across India.", bg:"linear-gradient(160deg,#f59e0b,#fde68a)", accent:"#f59e0b", img:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" },
  { id:"wind",    label:"Wind",    tag:"Turbine",       stat:"₹2.44/kWh", emoji:"🌬️", desc:"Capture kinetic energy from India's vast coastal and inland wind corridors.", bg:"linear-gradient(160deg,#3b82f6,#bfdbfe)", accent:"#3b82f6", img:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80" },
  { id:"hydro",   label:"Hydro",   tag:"Ocean & River", stat:"₹3.12/kWh", emoji:"💧", desc:"Clean energy from oceans, rivers and reservoirs powering millions of homes sustainably.", bg:"linear-gradient(160deg,#0891b2,#a5f3fc)", accent:"#0891b2", img:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80" },
  { id:"biomass", label:"Biomass", tag:"Organic",       stat:"₹4.50/kWh", emoji:"🌿", desc:"Agricultural waste converted to clean electricity through advanced gasification.", bg:"linear-gradient(160deg,#16a34a,#bbf7d0)", accent:"#16a34a", img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80" },
];

const EnergyCard = ({ source, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="relative overflow-hidden rounded-2xl cursor-pointer flex-1"
      style={{ minWidth:0,height:380,border:"1px solid rgba(0,0,0,0.07)" }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }}
      transition={{ delay:0.5+index*0.1,duration:0.7,ease:[0.22,1,0.36,1] }}>
      <div className="absolute inset-0" style={{ background:"#fff" }}/>
      <motion.div className="absolute inset-0"
        style={{ backgroundImage:`url(${source.img})`,backgroundSize:"cover",backgroundPosition:"center" }}
        animate={{ scale:hovered?1.08:1.02,opacity:hovered?0.52:0.1 }}
        transition={{ duration:0.8,ease:[0.22,1,0.36,1] }}/>
      <motion.div className="absolute inset-0" style={{ background:source.bg }}
        animate={{ opacity:hovered?0.82:0 }} transition={{ duration:0.55 }}/>
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
        <div className="flex items-start justify-between">
          <motion.span className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
            animate={{ background:hovered?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.05)",color:hovered?"#fff":"#9ca3af" }}
            style={{ backdropFilter:"blur(8px)",display:"inline-block" }}>{source.tag}</motion.span>
          <motion.div animate={{ scale:hovered?1.2:1,rotate:hovered?10:0 }} className="text-2xl">{source.emoji}</motion.div>
        </div>
        <div>
          <motion.p className="text-sm leading-relaxed mb-4" animate={{ opacity:hovered?1:0,y:hovered?0:10 }} style={{ color:"rgba(255,255,255,0.9)" }}>{source.desc}</motion.p>
          <div className="flex items-end justify-between">
            <div>
              <motion.div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.2rem",lineHeight:1,letterSpacing:"0.02em" }} animate={{ color:hovered?"#fff":"#111827" }}>{source.label}</motion.div>
              <motion.div className="text-xs tracking-wider mt-0.5" animate={{ color:hovered?"rgba(255,255,255,0.6)":"#9ca3af" }}>Energy Source</motion.div>
            </div>
            <div className="text-right">
              <motion.div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",letterSpacing:"0.04em" }} animate={{ color:hovered?"#fff":source.accent }}>{source.stat}</motion.div>
              <motion.div className="text-xs" animate={{ color:hovered?"rgba(255,255,255,0.55)":"#9ca3af" }}>avg. rate</motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Home ── */
const Home = () => {
  const navigate = useNavigate();
  const { hoverProps } = useCustomCursor();

  const stats=[
    { value:2.4,  suffix:" GWh", label:"Energy Traded",   decimals:1 },
    { value:40,   suffix:"K+",   label:"Active Users",    decimals:0 },
    { value:98,   suffix:"%",    label:"Uptime SLA",      decimals:0 },
    { value:120,  suffix:"",     label:"Cities Live",     decimals:0 },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 pointer-events-none animated-grid"/>
      <div className="absolute pointer-events-none" style={{ width:600,height:600,top:-200,right:-150,background:"radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 65%)",borderRadius:"50%" }}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

        {/* ── HERO ── */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20 mb-24">
          <div className="flex-1 max-w-2xl">
            <motion.p initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
              className="text-xs font-semibold tracking-[0.38em] uppercase mb-6 flex items-center gap-3" style={{ color:"#f59e0b" }}>
              <span className="inline-block w-8 h-px" style={{ background:"#f59e0b" }}/>
              India's Next-Generation Energy Exchange
            </motion.p>
            <motion.h1 initial={{ opacity:0,y:28 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8,delay:0.1,ease:[0.22,1,0.36,1] }}
              style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(5.5rem,12vw,10rem)",lineHeight:0.88,letterSpacing:"-0.01em",color:"#0f172a" }}>
              Watt<br/>
              <motion.span animate={{ opacity:[1,0.45,1,0.3,1] }} transition={{ duration:5,repeat:Infinity,delay:2.5,times:[0,0.95,0.96,0.98,1] }}
                style={{ WebkitTextStroke:"2.5px #f59e0b",color:"transparent",display:"inline-block" }}>Xchange</motion.span>
            </motion.h1>
            <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.25 }}
              className="text-lg font-light leading-relaxed mt-8 mb-4" style={{ color:"#374151",maxWidth:480 }}>
              India's first peer-to-peer renewable energy marketplace — buy cheap clean power directly from solar and wind producers, or sell your surplus at prices better than DISCOM buyback rates.
            </motion.p>
            <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.32 }}
              className="text-sm leading-relaxed mb-10" style={{ color:"#6b7280",maxWidth:440 }}>
              Fully regulated, ISO 27001 certified, and operating across 120+ cities in India. Settlement in under 24 hours with zero counterparty risk.
            </motion.p>
            <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.4 }} className="flex items-center gap-4 flex-wrap">
              <motion.button onClick={() => navigate("/market")} {...hoverProps}
                whileHover={{ scale:1.04,boxShadow:"0 12px 48px rgba(245,158,11,0.38)" }} whileTap={{ scale:0.97 }}
                className="btn-clip inline-flex items-center gap-3 px-10 py-4 font-bold text-sm tracking-widest uppercase cursor-none"
                style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff",letterSpacing:"0.14em" }}>
                <span>Explore Market</span>
                <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.5,repeat:Infinity }}>→</motion.span>
              </motion.button>
              <motion.button onClick={() => navigate("/products")} {...hoverProps}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="px-8 py-4 text-sm font-semibold tracking-widest uppercase cursor-none rounded"
                style={{ color:"#374151",border:"1.5px solid #e5e7eb",background:"#fff" }}>
                Our Products
              </motion.button>
            </motion.div>
          </div>

          {/* Stats + chart */}
          <motion.div initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.8,delay:0.35,ease:[0.22,1,0.36,1] }}
            className="hidden lg:flex flex-col gap-4 flex-shrink-0" style={{ width:320 }}>
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s=>(
                <div key={s.label} className="rounded-2xl p-5" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.06)",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.9rem",color:"#f59e0b",letterSpacing:"0.04em",lineHeight:1 }}>
                    <Counter value={s.value} suffix={s.suffix} decimals={s.decimals}/>
                  </div>
                  <div className="text-xs mt-1 uppercase tracking-widest" style={{ color:"#9ca3af" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-5" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.06)",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#9ca3af" }}>Monthly GWh</span>
                <span className="text-xs font-bold" style={{ color:"#16a34a" }}>↑ 18% YoY</span>
              </div>
              <EnergyChart/>
            </div>
          </motion.div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="mb-24">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color:"#9ca3af" }}>Platform</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.4rem",color:"#111827",letterSpacing:"0.04em",marginBottom:"2.5rem" }}>How WattXchange Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step:"01",icon:"📍",title:"Select Your Location",body:"Choose your city and DISCOM. We automatically match you with certified energy producers or buyers in your distribution zone." },
              { step:"02",icon:"⚡",title:"Place a Trade",body:"Set the units you need to buy or sell, pick your price, and confirm. Our platform handles DISCOM compliance and net-metering credits." },
              { step:"03",icon:"💳",title:"Instant Settlement",body:"Energy is delivered or credited to your DISCOM meter within 24 hours. Payments settle directly to your bank or WattX wallet." },
            ].map((item,i)=>(
              <motion.div key={item.step} initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.15,duration:0.6 }}
                className="p-6 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
                <div className="flex items-start justify-between mb-4">
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"3rem",color:"rgba(245,158,11,0.15)",lineHeight:1,letterSpacing:"0.05em" }}>{item.step}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-base font-bold mb-2" style={{ color:"#111827" }}>{item.title}</div>
                <p className="text-sm leading-relaxed" style={{ color:"#6b7280" }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── ENERGY SOURCES BANNER ── */}
        <motion.div initial={{ opacity:0,y:28 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }} className="mb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color:"#9ca3af" }}>Hover to explore</p>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",letterSpacing:"0.05em",color:"#111827" }}>Renewable Energy Sources</h2>
            </div>
            <span className="text-xs tracking-widest uppercase px-4 py-2 rounded-full" style={{ color:"#9ca3af",border:"1px solid #e5e7eb",background:"#fff" }}>4 Categories</span>
          </div>
          <div className="flex gap-3" style={{ height:380 }}>
            {ENERGY_SOURCES.map((source,i)=><EnergyCard key={source.id} source={source} index={i}/>)}
          </div>
        </motion.div>

        {/* ── DATA SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          <motion.div initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}
            className="p-7 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#9ca3af" }}>Traded This Year</p>
            <h3 className="text-xl font-bold mb-5" style={{ color:"#111827" }}>India Energy Mix on WattXchange</h3>
            <DonutChart/>
          </motion.div>
          <motion.div initial={{ opacity:0,x:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}
            className="p-7 rounded-2xl" style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#9ca3af" }}>Live Today</p>
            <h3 className="text-xl font-bold mb-5" style={{ color:"#111827" }}>Top City Rates</h3>
            <div className="flex flex-col gap-3">
              {[
                { city:"Indore",    state:"MP", buy:4.40,sell:5.85,trend:"+3.2%" },
                { city:"Mumbai",    state:"MH", buy:5.20,sell:6.90,trend:"+1.8%" },
                { city:"Delhi",     state:"DL", buy:4.80,sell:6.30,trend:"+4.1%" },
                { city:"Bengaluru", state:"KA", buy:4.60,sell:6.05,trend:"+2.5%" },
                { city:"Bhopal",    state:"MP", buy:4.30,sell:5.75,trend:"+1.2%" },
              ].map((row,i)=>(
                <motion.div key={row.city} initial={{ opacity:0,x:10 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  className="flex items-center justify-between py-2" style={{ borderBottom:"1px solid rgba(0,0,0,0.05)" }}>
                  <div>
                    <span className="text-sm font-semibold" style={{ color:"#111827" }}>{row.city}</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background:"rgba(0,0,0,0.05)",color:"#6b7280" }}>{row.state}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div style={{ color:"#16a34a",fontWeight:600 }}>Buy ₹{row.buy}</div>
                    <div style={{ color:"#f59e0b",fontWeight:600 }}>Sell ₹{row.sell}</div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:"rgba(34,197,94,0.1)",color:"#16a34a" }}>{row.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── ABOUT + SDG ── */}
        <motion.div initial={{ opacity:0,y:28 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="mb-24 rounded-3xl overflow-hidden" style={{ background:"#0f172a" }}>
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color:"#f59e0b" }}>About WattXchange</p>
                <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2rem,4vw,3.5rem)",letterSpacing:"0.04em",lineHeight:1,marginBottom:"1.5rem",color:"#fff" }}>
                  Powering India's<br/>Clean Energy Future
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.65)" }}>
                  WattXchange is India's first SEBI-inspired regulated peer-to-peer renewable energy exchange, launched to bridge the gap between surplus energy producers and consumers across the country.
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color:"rgba(255,255,255,0.55)" }}>
                  We work with DISCOMs in 120+ cities to enable real-time net metering credits, transparent pricing, and instant settlement — making clean energy trading as easy as booking a cab.
                </p>
                <div className="flex gap-4 flex-wrap">
                  {[["ISO 27001","Certified"],["CERC","Compliant"],["24hr","Settlement"],["Zero","Counterparty Risk"]].map(([v,l])=>(
                    <div key={l} className="text-center">
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.2rem",color:"#f59e0b",letterSpacing:"0.05em" }}>{v}</div>
                      <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { icon:"☀️",title:"For Energy Buyers",body:"Access surplus solar and wind power at 20–35% below DISCOM retail rates. No long-term contract — buy as little as 50 kWh per transaction." },
                  { icon:"⚡",title:"For Energy Sellers",body:"Earn 40–60% more than DISCOM buyback rates by selling directly to verified consumers. Get paid within 24 hours of successful energy delivery." },
                ].map(item=>(
                  <div key={item.title} className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)" }}>
                    <div className="text-xl mb-2">{item.icon}</div>
                    <div className="font-bold text-sm mb-1" style={{ color:"#fff" }}>{item.title}</div>
                    <p className="text-xs leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SDG SECTION ── */}
            <div className="border-t pt-10" style={{ borderColor:"rgba(255,255,255,0.1)" }}>
              <div className="flex items-start gap-6 mb-6">
                {/* UN SDG emblem (SVG inline) */}
                <div className="flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="36" fill="#009edb"/>
                    <text x="36" y="28" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">UNITED NATIONS</text>
                    <text x="36" y="38" textAnchor="middle" fill="white" fontSize="6">Sustainable</text>
                    <text x="36" y="46" textAnchor="middle" fill="white" fontSize="6">Development</text>
                    <text x="36" y="54" textAnchor="middle" fill="white" fontSize="6">Goals</text>
                    <circle cx="36" cy="36" r="33" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
                    <text x="36" y="20" textAnchor="middle" fill="#ffd700" fontSize="14">🌐</text>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color:"#009edb" }}>UN Sustainable Development Goals</p>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#fff",letterSpacing:"0.04em",lineHeight:1.1,marginBottom:"0.75rem" }}>
                    Our Commitment to a Better World
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.6)" }}>
                    WattXchange is proud to actively contribute to the United Nations' 2030 Agenda for Sustainable Development. Our platform directly supports three core SDGs:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { num:"SDG 7", title:"Affordable & Clean Energy", color:"#fcc30b", desc:"We democratise access to renewable electricity for homes and businesses across India, enabling millions to switch from fossil-fuel-dependent grid power to affordable solar and wind energy." },
                  { num:"SDG 13", title:"Climate Action", color:"#3f7e44", desc:"Every kWh traded on WattXchange displaces carbon-intensive power generation. Our community has collectively prevented over 1,480 tonnes of CO₂ emissions since launch." },
                  { num:"SDG 17", title:"Partnerships for the Goals", color:"#19486a", desc:"We collaborate with DISCOMs, CERC, renewable energy producers, and local government bodies to build a transparent, inclusive, and scalable clean energy ecosystem." },
                ].map(s=>(
                  <div key={s.num} className="p-5 rounded-2xl" style={{ background:"rgba(255,255,255,0.05)",border:`1px solid ${s.color}44` }}>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:s.color }}>{s.num}</div>
                    <div className="font-bold text-sm mb-2" style={{ color:"#fff" }}>{s.title}</div>
                    <p className="text-xs leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CARBON FOOTPRINT ── */}
            <div className="border-t pt-10" style={{ borderColor:"rgba(255,255,255,0.1)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color:"#16a34a" }}>🌱 Environmental Impact</p>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",color:"#fff",letterSpacing:"0.04em",lineHeight:1,marginBottom:"1rem" }}>
                    Carbon Footprint<br/>We've Reduced Together
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    Every peer-to-peer trade on WattXchange displaces coal and gas-based power from the grid. Since our launch, our community has collectively avoided over <strong style={{ color:"#4ade80" }}>1,480 tonnes of CO₂</strong> — equivalent to planting more than 67,000 trees.
                  </p>
                  <div className="flex gap-6">
                    {[["1,480t","CO₂ Avoided"],["67K+","Trees Equivalent"],["308t","Jan 2025 Record"]].map(([v,l])=>(
                      <div key={l}>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",color:"#4ade80",letterSpacing:"0.04em" }}>{v}</div>
                        <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(34,197,94,0.2)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.4)" }}>Monthly CO₂ Reduced (tonnes)</span>
                    <span className="text-xs font-bold" style={{ color:"#4ade80" }}>↑ 116% in 6 months</span>
                  </div>
                  <CarbonChart/>
                </div>
              </div>
            </div>

            {/* ── 500 kWh REWARDS ── */}
            <div className="border-t mt-10 pt-10" style={{ borderColor:"rgba(255,255,255,0.1)" }}>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.3),rgba(251,133,0,0.2))",border:"1px solid rgba(245,158,11,0.3)" }}>🏆</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color:"#f59e0b" }}>Community Rewards — Coming Soon</p>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:"#fff",letterSpacing:"0.04em",lineHeight:1,marginBottom:"0.75rem" }}>
                    500 kWh Club — Be a Green Champion
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.6)" }}>
                    We believe that people who power India's clean energy transition deserve to be celebrated. That's why we're launching the <strong style={{ color:"#f59e0b" }}>WattXchange 500 kWh Club</strong> — a recognition and rewards programme for our most active community members.
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color:"rgba(255,255,255,0.5)" }}>
                    Members who share <strong style={{ color:"#f59e0b" }}>500 kWh or more per month</strong> through the WattXchange marketplace will receive exclusive goodies, a personalised Green Champion Award, and a dedicated feature on our platform. We'll be announcing more details very soon — watch this space!
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {[["🎁","Exclusive Goodies"],["🥇","Green Champion Award"],["🌟","Featured on Platform"],["🌱","Carbon Certificate"]].map(([icon,label])=>(
                      <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                        style={{ background:"rgba(245,158,11,0.1)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(245,158,11,0.2)" }}>
                        <span>{icon}</span><span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 px-4 py-2 rounded-xl inline-flex items-center gap-2 text-xs font-semibold"
                    style={{ background:"rgba(245,158,11,0.08)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.2)" }}>
                    🔔 Programme launching Q2 2025 — stay tuned
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }} className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color:"#9ca3af" }}>Ready to trade?</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2rem,5vw,4rem)",color:"#111827",letterSpacing:"0.04em",marginBottom:"1.5rem" }}>
            Join 40,000+ Energy Traders Across India
          </h2>
          <motion.button onClick={() => navigate("/market")} {...hoverProps}
            whileHover={{ scale:1.04,boxShadow:"0 12px 48px rgba(245,158,11,0.38)" }} whileTap={{ scale:0.97 }}
            className="btn-clip inline-flex items-center gap-3 px-14 py-5 font-bold text-base tracking-widest uppercase cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            Start Trading Now →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
