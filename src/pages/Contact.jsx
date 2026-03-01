import { useState } from "react";
import { motion } from "framer-motion";
import useCustomCursor from "../hooks/useCustomCursor";

const Contact = () => {
  const { hoverProps } = useCustomCursor();
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className="relative min-h-screen pt-[72px] overflow-hidden" style={{ background:"#f8f9fa" }}>
      <div className="absolute inset-0 animated-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width:500,height:500,top:-150,right:-100,background:"radial-gradient(circle,rgba(245,158,11,0.09) 0%,transparent 65%)",borderRadius:"50%" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14">

        {/* Header */}
        <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} className="mb-14">
          <p className="text-xs font-semibold tracking-[0.38em] uppercase mb-3" style={{ color:"#f59e0b" }}>Get in Touch</p>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,7vw,6rem)",color:"#0f172a",letterSpacing:"0.03em",lineHeight:0.9 }}>
            Contact<br/><span style={{ color:"#f59e0b" }}>WattXchange</span>
          </h1>
          <p className="text-base font-light mt-5 max-w-lg leading-relaxed" style={{ color:"#6b7280" }}>
            We're here around the clock. Whether you have a trading question, a technical issue, or a partnership enquiry — reach out and we'll get back to you fast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Info cards */}
          <div className="flex flex-col gap-5">
            {/* 24hr badge */}
            <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.15 }}
              className="p-6 rounded-2xl flex items-center gap-5"
              style={{ background:"#0f172a",color:"#fff" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:"rgba(245,158,11,0.15)" }}>
                🕐
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#f59e0b" }}>Always On</div>
                <div className="font-bold text-lg" style={{ color:"#fff" }}>24 × 7 Customer Support</div>
                <div className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.5)" }}>Our energy never stops — neither does our team</div>
              </div>
            </motion.div>

            {[
              {
                icon:"📞", label:"Phone",
                lines:["+91 98765 43210", "+91 73100 22334"],
                sub:"Mon – Sun, 24 hours",
                delay:0.2,
              },
              {
                icon:"📧", label:"Email",
                lines:["support@wattxchange.in", "partnerships@wattxchange.in"],
                sub:"Response within 2 hours",
                delay:0.28,
              },
              {
                icon:"📍", label:"Head Office",
                lines:["WattXchange Technologies Pvt. Ltd.", "4th Floor, Prestige Tower, MG Road,", "Indore, Madhya Pradesh — 452 001"],
                sub:"India",
                delay:0.35,
              },
            ].map((item) => (
              <motion.div key={item.label} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }}
                transition={{ delay:item.delay }}
                className="p-5 rounded-2xl flex items-start gap-4"
                style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background:"rgba(245,158,11,0.1)" }}>{item.icon}</div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:"#9ca3af" }}>{item.label}</div>
                  {item.lines.map((l,i) => (
                    <div key={i} className="text-sm font-semibold" style={{ color:"#111827",lineHeight:1.6 }}>{l}</div>
                  ))}
                  <div className="text-xs mt-1" style={{ color:"#9ca3af" }}>{item.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.42 }}
              className="rounded-2xl overflow-hidden" style={{ height:180,background:"#e5e7eb",border:"1px solid rgba(0,0,0,0.07)",position:"relative" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-4xl">🗺️</span>
                <span className="text-sm font-semibold" style={{ color:"#374151" }}>Indore, Madhya Pradesh</span>
                <span className="text-xs" style={{ color:"#9ca3af" }}>22.7196° N, 75.8577° E</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Contact form */}
          <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.2 }}
            className="p-8 rounded-2xl"
            style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>

            {sent ? (
              <motion.div initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#16a34a",letterSpacing:"0.04em" }}>Message Sent!</h3>
                <p className="text-sm mt-2" style={{ color:"#6b7280" }}>Our team will reach out within 2 hours. Thank you!</p>
                <button onClick={() => setSent(false)} className="mt-6 text-xs font-bold cursor-none" style={{ color:"#f59e0b" }}>Send another message</button>
              </motion.div>
            ) : (
              <>
                <h3 className="font-bold text-xl mb-6" style={{ color:"#111827" }}>Send Us a Message</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { field:"name",    label:"Your Name",     type:"text",  placeholder:"Arjun Sharma" },
                    { field:"email",   label:"Email Address", type:"email", placeholder:"arjun@example.com" },
                    { field:"subject", label:"Subject",       type:"text",  placeholder:"Trading query, technical support..." },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block" style={{ color:"#6b7280" }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]:e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-none transition-all"
                        style={{ background:"#f8f9fa",border:"1.5px solid rgba(0,0,0,0.08)",color:"#111827",fontFamily:"'DM Sans',sans-serif" }}
                        onFocus={e => e.target.style.borderColor="#f59e0b"}
                        onBlur={e => e.target.style.borderColor="rgba(0,0,0,0.08)"}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block" style={{ color:"#6b7280" }}>Message</label>
                    <textarea placeholder="Tell us how we can help you..." value={form.message}
                      onChange={e => setForm(f => ({ ...f, message:e.target.value }))}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-none resize-none transition-all"
                      style={{ background:"#f8f9fa",border:"1.5px solid rgba(0,0,0,0.08)",color:"#111827",fontFamily:"'DM Sans',sans-serif" }}
                      onFocus={e => e.target.style.borderColor="#f59e0b"}
                      onBlur={e => e.target.style.borderColor="rgba(0,0,0,0.08)"}
                    />
                  </div>
                  <motion.button onClick={handleSubmit} {...hoverProps}
                    whileHover={{ scale:1.03,boxShadow:"0 8px 32px rgba(245,158,11,0.35)" }} whileTap={{ scale:0.97 }}
                    className="w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl cursor-none"
                    style={{ background:"linear-gradient(135deg,#f59e0b,#fb8500)",color:"#fff" }}>
                    Send Message →
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
