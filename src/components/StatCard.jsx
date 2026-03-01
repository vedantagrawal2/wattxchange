import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useCounter from "../hooks/useCounter";

const StatCard = ({ value, suffix = "", label, decimals = 0, delay = 0 }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const count = useCounter(value, 2000, inView, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <div
        className="font-display text-4xl tracking-wide"
        style={{ color: "#ffb703" }}
      >
        {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
        {suffix}
      </div>
      <div
        className="text-xs tracking-widest uppercase mt-1"
        style={{ color: "rgba(253,246,227,0.38)" }}
      >
        {label}
      </div>
    </motion.div>
  );
};

export default StatCard;
