/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Red Hat Display"', "sans-serif"],
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#FBBF24",
        muted: "#f4f4f5",
        background: "var(--background)",
        error: "#eb0000",
        typography: {
          primary: "#0f2738",
          secondary: "#374151",
        },
        input: "#e5e7eb",
        placeholder: "#9ca3af",
      },
      fontSize: {
        h1: ["24px", { lineHeight: "28px", letterSpacing: "-0.5px" }],
        h2: ["20px", { lineHeight: "26px", letterSpacing: "-0.25px" }],
        subtitle: ["18px", { lineHeight: "24px", letterSpacing: "-0.15px" }],
        body: ["16px", { lineHeight: "22px", letterSpacing: "0px" }],
        bodySmall: ["14px", { lineHeight: "20px", letterSpacing: "0.15px" }],
        bodyXSmall: ["12px", { lineHeight: "18px", letterSpacing: "0.25px" }],
        bodyXXSmall: ["10px", { lineHeight: "16px", letterSpacing: "0.3px" }],
      },
      fontWeight: {
        display: {
          regular: 400,
          medium: 500,
          bold: 700,
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  },
};
