import { useState, useEffect, useRef } from "react";

/**
 * useCounter
 * Animates a number from 0 to `target` over `duration` ms.
 * Only starts when `active` is true.
 */
const useCounter = (target, duration = 2000, active = true, decimals = 0) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    const startTime = performance.now();

    const update = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      setCount(parseFloat(value.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    };

    requestAnimationFrame(update);
  }, [active, target, duration, decimals]);

  return count;
};

export default useCounter;
