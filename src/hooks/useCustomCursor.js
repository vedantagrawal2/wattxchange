import { useEffect, useRef } from "react";

/**
 * useCustomCursor
 * Crosshair + electric spark cursor — minimal, sharp, high-contrast
 */
const useCustomCursor = () => {
  const cursorRef = useRef(null);
  const mousePos  = useRef({ x: 0, y: 0 });
  const curPos    = useRef({ x: 0, y: 0 });
  const rafId     = useRef(null);

  useEffect(() => {
    const cursor = document.getElementById("cursor-custom");
    const cursorDot = document.getElementById("cursor-dot");
    if (!cursor) return;
    cursorRef.current = cursor;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Dot follows instantly
      if (cursorDot) {
        cursorDot.style.left = e.clientX + "px";
        cursorDot.style.top  = e.clientY + "px";
      }
    };

    const animate = () => {
      const { x: mx, y: my } = mousePos.current;
      let { x: cx, y: cy }   = curPos.current;
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      curPos.current = { x: cx, y: cy };
      cursor.style.left = cx + "px";
      cursor.style.top  = cy + "px";
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const hoverProps = {
    onMouseEnter: () => cursorRef.current?.classList.add("hovered"),
    onMouseLeave: () => cursorRef.current?.classList.remove("hovered"),
  };

  return { hoverProps };
};

export default useCustomCursor;
