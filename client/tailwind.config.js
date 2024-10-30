/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        muted: "#f4f4f5",
      },
    },
    plugins: [
      require("tailwindcss-animate"),
      function ({ addUtilities }) {
        addUtilities({
          ".hover-overlay": {
            position: "relative",
            overflow: "hidden",
          },
          ".hover-overlay::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: "white",
            opacity: 0,
            transition: "opacity 0.3s ease-out",
          },
          ".hover-overlay:hover::before": {
            opacity: 0.05,
          },
        });
      },
    ],
  },
};
