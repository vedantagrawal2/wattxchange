import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useCustomCursor from "../hooks/useCustomCursor";

const PRODUCTS = [
  { id:1,  name:"Solar Panel Kit — 5kW",        category:"Solar",      emoji:"☀️", price:185000, originalPrice:220000, rating:4.8, reviews:342, badge:"Best Seller",    badgeColor:"#f59e0b", img:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",  desc:"Complete 5kW residential solar panel kit with monocrystalline panels, mounting hardware, and DC cable.", specs:["5kW Peak","25yr Warranty","22% Efficiency","Anti-Reflection"],   tooltip:"Generate up to 600 kWh/month — sell surplus on WattXchange" },
  { id:2,  name:"Smart Energy Meter",            category:"Monitoring", emoji:"📊", price:4500,   originalPrice:6000,   rating:4.6, reviews:218, badge:"WattX Certified",badgeColor:"#fb8500", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",  desc:"Bi-directional smart meter compatible with WattXchange. Tracks generation, consumption, and export.", specs:["Bi-Directional","Wi-Fi + 4G","Mobile App","DLMS Protocol"],       tooltip:"Required for WattXchange trading — auto-reports to platform" },
  { id:3,  name:"Lithium Battery 10kWh",         category:"Storage",    emoji:"🔋", price:320000, originalPrice:385000, rating:4.9, reviews:156, badge:"Top Rated",      badgeColor:"#16a34a", img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",  desc:"LiFePO4 battery storage. Discharge at night or sell during peak hours when DISCOM rates are highest.",  specs:["10 kWh","6000+ Cycles","95% Efficiency","10yr Warranty"],         tooltip:"Store and sell energy during peak rate hours for max profit" },
  { id:4,  name:"Grid-Tie Inverter 5kW",         category:"Inverter",   emoji:"⚡", price:42000,  originalPrice:55000,  rating:4.7, reviews:289, badge:"Compatible",     badgeColor:"#f59e0b", img:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",  desc:"Grid-tied hybrid inverter with net metering support, fully compatible with WattXchange API.",           specs:["5kW Output","MPPT","WattX API","IP65"],                             tooltip:"Plug directly into WattXchange for automated energy trading" },
  { id:5,  name:"Wind Micro-Turbine 2kW",        category:"Wind",       emoji:"🌬️",price:95000,  originalPrice:115000, rating:4.5, reviews:87,  badge:"New",            badgeColor:"#38bdf8", img:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",  desc:"Compact rooftop wind turbine for coastal and hilly regions. Generate clean wind to supplement solar.",  specs:["2kW Rated","Low-Wind Start","Silent","20yr Life"],                  tooltip:"Ideal for coastal areas — generate and sell wind year-round" },
  { id:6,  name:"EV Charging Station 7.4kW",     category:"EV",         emoji:"🚗", price:35000,  originalPrice:44000,  rating:4.6, reviews:193, badge:"Popular",        badgeColor:"#fb8500", img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",  desc:"AC Type-2 EV charger with smart scheduling. Charge from solar surplus instead of paying grid rates.",   specs:["7.4kW AC","Smart Schedule","OCPP","Mobile App"],                    tooltip:"Charge your EV from solar — cut fuel costs to near zero" },
  { id:7,  name:"Solar Water Heater 200L",       category:"Solar",      emoji:"🌡️",price:22000,  originalPrice:28000,  rating:4.4, reviews:412, badge:"Eco Pick",       badgeColor:"#16a34a", img:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",  desc:"Pressurized flat-plate solar water heater. Eliminates up to 80% of water heating electricity use.",    specs:["200L","Pressurised","ETC Tech","5yr Warranty"],                     tooltip:"Reduce units you need to buy — heat water free from the sun" },
  { id:8,  name:"AI Energy Management System",   category:"Software",   emoji:"🖥️",price:8999,   originalPrice:12000,  rating:4.8, reviews:134, badge:"WattX Premium",  badgeColor:"#f59e0b", img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",  desc:"AI-powered energy management. Auto-decides when to sell to WattXchange vs store vs consume.",           specs:["AI Optimised","WattX Integrated","Real-Time","Auto Trading"],       tooltip:"Let AI manage your energy trading — earn more with zero effort" },
];

const CATEGORIES = ["All","Solar","Storage","Inverter","Monitoring","Wind","EV","Software"];

const ProductCard = ({ product, delay }) => {
  const [hovered, setHovered] = useState(false);
  const { hoverProps } = useCustomCursor();
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }}
      transition={{ delay,duration:0.5,ease:[0.22,1,0.36,1] }}
      className="relative rounded-2xl overflow-hidden flex flex-col cursor-none"
      style={{ background:"#fff",border:`1.5px solid ${hovered?"rgba(245,158,11,0.35)":"rgba(0,0,0,0.07)"}`,transition:"border-color 0.3s",boxShadow:hovered?"0 8px 40px rgba(245,158,11,0.12)":"0 2px 12px rgba(0,0,0,0.04)" }}
      onMouseEnter={() => { setHovered(true); hoverProps.onMouseEnter(); }}
      onMouseLeave={() => { setHovered(false); hoverProps.onMouseLeave(); }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <motion.img src={product.img} alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale:hovered?1.07:1 }} transition={{ duration:0.6 }}
          style={{ opacity:hovered?0.75:0.55,filter:"saturate(0.7)" }}
          onError={e => { e.target.style.display="none"; }}
        />
        <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 40%,rgba(255,255,255,0.97) 100%)" }} />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background:product.badgeColor+"22",color:product.badgeColor,border:`1px solid ${product.badgeColor}44` }}>
          {product.badge}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
          style={{ background:"rgba(34,197,94,0.15)",color:"#16a34a" }}>
          -{discount}%
        </span>
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:4 }}
              className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background:"rgba(15,23,42,0.9)",color:"#f59e0b",backdropFilter:"blur(8px)" }}>
              💡 {product.tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background:"rgba(245,158,11,0.1)",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",fontSize:"0.6rem" }}>
            {product.category}
          </span>
          <span className="text-xs" style={{ color:"#9ca3af" }}>⭐ {product.rating} ({product.reviews})</span>
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color:"#111827",fontFamily:"'DM Sans',sans-serif" }}>
          {product.emoji} {product.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"#6b7280" }}>{product.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.specs.map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded"
              style={{ background:"rgba(0,0,0,0.05)",color:"#6b7280",border:"1px solid rgba(0,0,0,0.07)" }}>
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"#f59e0b",letterSpacing:"0.04em" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-2 text-xs line-through" style={{ color:"#d1d5db" }}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <motion.button whileHover={{ scale:1.05,boxShadow:"0 4px 20px rgba(245,158,11,0.38)" }} whileTap={{ scale:0.96 }}
            onClick={() => navigate('/products/quote', { state: { product } })}
            className="btn-clip-sm px-4 py-2 text-xs font-bold tracking-wide cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            Get Quote
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [activeCategory, setCategory] = useState("All");
  const filtered = activeCategory==="All" ? PRODUCTS : PRODUCTS.filter(p => p.category===activeCategory);

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width:500,height:500,top:-100,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.38em] uppercase mb-4" style={{ color:"#fb8500" }}>🛒 WattXchange Store</p>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,6rem)",color:"#0f172a",letterSpacing:"0.03em" }}>
            Energy <span style={{ color:"#f59e0b" }}>Products</span>
          </h1>
          <p className="text-base font-light max-w-xl mx-auto leading-relaxed mt-4" style={{ color:"#6b7280" }}>
            Everything you need to generate, store, and trade renewable energy — fully compatible with the WattXchange platform.
          </p>
        </motion.div>

        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
          className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider cursor-none transition-all duration-300"
              style={{ background:activeCategory===cat?"linear-gradient(135deg,#f59e0b,#fb8500)":"#fff", color:activeCategory===cat?"#fff":"#6b7280", border:`1px solid ${activeCategory===cat?"transparent":"rgba(0,0,0,0.1)"}`, boxShadow:activeCategory===cat?"0 4px 20px rgba(245,158,11,0.3)":"none" }}>
              {cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => <ProductCard key={product.id} product={product} delay={i*0.06} />)}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.6 }}
          className="text-center mt-16 p-10 rounded-3xl"
          style={{ background:"#0f172a",color:"#fff" }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",color:"#f59e0b",letterSpacing:"0.04em",marginBottom:"0.75rem" }}>
            Already have solar or wind energy?
          </h3>
          <p className="text-sm mb-6" style={{ color:"rgba(255,255,255,0.55)" }}>
            List your surplus energy on WattXchange and start earning today
          </p>
          <motion.button whileHover={{ scale:1.04,boxShadow:"0 8px 40px rgba(245,158,11,0.4)" }} whileTap={{ scale:0.97 }}
            onClick={() => navigate('/products/quote', { state: { product } })}
            className="btn-clip px-12 py-4 font-bold text-base tracking-widest uppercase cursor-none"
            style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
            Sell My Energy ⚡
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
