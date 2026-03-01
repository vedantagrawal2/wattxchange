/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold:   "#ffb703",
        orange: "#fb8500",
        navy:   "#023047",
        cream:  "#fdf6e3",
        dark:   "#1f2937",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body:    ["'DM Sans'", "sans-serif"],
        serif:   ["'Playfair Display'", "serif"],
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        orbFloat: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(30px,-20px) scale(1.05)" },
          "66%":     { transform: "translate(-20px,15px) scale(0.97)" },
        },
        gridMove: {
          "0%":   { transform: "translateY(0)" },
          "100%": { transform: "translateY(60px)" },
        },
        lineShoot: {
          "0%":   { opacity: "0", top: "-10%", height: "0px" },
          "10%":  { opacity: "0.5" },
          "90%":  { opacity: "0.5" },
          "100%": { opacity: "0", top: "110%", height: "200px" },
        },
        particleFloat: {
          "0%":   { opacity: "0", transform: "translateY(100vh) scale(0)" },
          "10%":  { opacity: "0.8" },
          "90%":  { opacity: "0.8" },
          "100%": { opacity: "0", transform: "translateY(-100px) scale(1.5)" },
        },
        zapPulse: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%":     { opacity: "1",   transform: "scale(1.2)" },
        },
        flicker: {
          "0%,95%,100%": { opacity: "1" },
          "96%":          { opacity: "0.5" },
          "98%":          { opacity: "0.4" },
        },
        scrollPulse: {
          "0%,100%": { opacity: "0.3", transform: "scaleY(1)" },
          "50%":     { opacity: "1",   transform: "scaleY(1.2)" },
        },
        cursorExpand: {
          "0%":   { transform: "translate(-50%,-50%) scale(1)" },
          "100%": { transform: "translate(-50%,-50%) scale(1.5)" },
        },
      },
      animation: {
        "fade-up":        "fadeUp 0.8s ease forwards",
        "orb-float":      "orbFloat 8s ease-in-out infinite",
        "grid-move":      "gridMove 20s linear infinite",
        "line-shoot":     "lineShoot 4s ease-in-out infinite",
        "particle-float": "particleFloat linear infinite",
        "zap-pulse":      "zapPulse 2s ease-in-out infinite",
        "flicker":        "flicker 5s ease-in-out infinite",
        "scroll-pulse":   "scrollPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
