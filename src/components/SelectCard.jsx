import { motion } from "framer-motion";

/**
 * SelectCard — a styled clickable option card.
 * Props: label, sublabel, icon, selected, onClick, accentColor, delay
 */
const SelectCard = ({ label, sublabel, icon, selected, onClick, accentColor = "#ffb703", delay = 0 }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: `0 8px 32px ${accentColor}28` }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative w-full text-left p-4 rounded-lg transition-all duration-300 cursor-none outline-none"
      style={{
        background:   selected ? `${accentColor}18` : "rgba(253,246,227,0.04)",
        border:       `1.5px solid ${selected ? accentColor : "rgba(255,183,3,0.12)"}`,
        boxShadow:    selected ? `0 0 0 1px ${accentColor}40, 0 4px 24px ${accentColor}20` : "none",
      }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-xl shrink-0">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-semibold truncate"
            style={{ color: selected ? accentColor : "#fdf6e3" }}
          >
            {label}
          </div>
          {sublabel && (
            <div
              className="text-xs mt-0.5 truncate"
              style={{ color: "rgba(253,246,227,0.42)" }}
            >
              {sublabel}
            </div>
          )}
        </div>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-sm shrink-0"
            style={{ color: accentColor }}
          >
            ✓
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default SelectCard;
