import { motion } from "framer-motion";

/**
 * StepIndicator — shows progress through a multi-step flow.
 * steps: array of label strings
 * current: 0-based index of active step
 */
const StepIndicator = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: done
                    ? "linear-gradient(135deg,#ffb703,#fb8500)"
                    : active
                    ? "linear-gradient(135deg,#ffb703,#fb8500)"
                    : "rgba(255,183,3,0.1)",
                  borderColor: done || active ? "#ffb703" : "rgba(255,183,3,0.25)",
                  scale: active ? 1.15 : 1,
                }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
                style={{ color: done || active ? "#023047" : "rgba(253,246,227,0.3)" }}
              >
                {done ? "✓" : i + 1}
              </motion.div>
              <span
                className="text-[10px] tracking-widest uppercase mt-2 whitespace-nowrap"
                style={{ color: active ? "#ffb703" : done ? "#fb8500" : "rgba(253,246,227,0.28)" }}
              >
                {label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <motion.div
                animate={{ background: done ? "linear-gradient(90deg,#ffb703,#fb8500)" : "rgba(255,183,3,0.12)" }}
                transition={{ duration: 0.5 }}
                className="w-16 h-px mx-1 mb-6"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
