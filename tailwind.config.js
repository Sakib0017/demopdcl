/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      animation: {
        blink: "blink 1s linear infinite",
        blob: "blob 5s infinite",
        upDown: "upDown 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        upDown: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0)" },
        },
        ping: {
          "0%, 70%, 100%": { opacity: 1 },
          "35%": { opacity: 0 },
        },
        blob: {
          "0%": {
            transform: "translate(0px,0px) scale(1)",
          },
          "33%": {
            transform: "translate(-60px,50px) scale(1.3)",
          },
          "66%": {
            transform: "translate(60px,100px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px,0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        glow: {
          "from": { textShadow: "0 0 20px #006642, 0 0 30px #006642, 0 0 40px #006642" },
          "to": { textShadow: "0 0 10px #006642, 0 0 20px #006642, 0 0 30px #006642" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      fontFamily: {
        ubuntu: ["ubuntu"],
      },
      colors: {
        primary: "#645050",
        secondary: "#01DF74",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        "PDCL-green": "#006642",
        "PDCL-green-light": "#00984a",
        "glass-white": "rgba(255, 255, 255, 0.1)",
        "glass-dark": "rgba(0, 0, 0, 0.1)",
      },
      lighting: {
        neon: "text-white text-shadow-lg stroke-2 stroke-white",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "depth-1": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "depth-2": "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        "depth-3": "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
        "depth-4": "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
        "depth-5": "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)",
        "emergency": "0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)",
        "medical": "0 0 20px rgba(0, 102, 66, 0.3), 0 0 40px rgba(0, 102, 66, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        xs: "300px",
      },
      width: {
        content: "fit-content",
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "medical-gradient": "linear-gradient(135deg, #006642, #00984a)",
        "emergency-gradient": "linear-gradient(135deg, #DC2626, #EF4444)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities }) {
      addUtilities({
        ".gradient-alt-flow": {
          backgroundImage:
            "linear-gradient(to right, #006642, #00d4ff 40%, #006642 80%)",
          backgroundSize: "200% 100%",
          animation: "flow 5s linear infinite",
          "@keyframes flow": {
            "0%": { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "-100% 0" },
          },
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".gradient-sidebar-flow": {
          backgroundImage:
            "linear-gradient(to right, #00664a, #585858 40%, #00664a 80%)",
          backgroundSize: "200% 100%",
          animation: "flow 5s linear infinite",
          "@keyframes flow": {
            "0%": { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "-100% 0" },
          },
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        // Glassmorphism utilities
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-medical": {
          background: "rgba(0, 152, 74, 0.1)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(0, 152, 74, 0.2)",
        },
        // 3D Transform utilities
        ".transform-3d": {
          transformStyle: "preserve-3d",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".perspective-500": {
          perspective: "500px",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        // Hover lift effects
        ".hover-lift": {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
          },
        },
        ".hover-lift-lg": {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
          },
        },
        // Medical-specific utilities
        ".emergency-pulse": {
          animation: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          backgroundColor: "#DC2626",
          boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.7)",
          animationName: "emergency-pulse",
        },
        "@keyframes emergency-pulse": {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.7)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 10px rgba(220, 38, 38, 0)",
          },
          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(220, 38, 38, 0)",
          },
        },
        // Scroll-based animations
        ".scroll-fade": {
          opacity: "0",
          transform: "translateY(20px)",
          transition: "all 0.6s ease-out",
          "&.is-visible": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      });
    },
  ],
};
