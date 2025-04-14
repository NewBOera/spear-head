/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./privacy-policy.html",
    "./terms-and-conditions.html",
    "./disclaimer.html",
    "./src//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          md: "2rem",
          lg: "2.5rem",
          xl: "3rem",
        },
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        redPrimary: "#ED0606",
        shGray: {
          light: "#F2F2F2",
          DEFAULT: "#4F4F4F",
          dark: "#2F2F2F",
        },
      },
      screens: {
        mblg: "589px",
        "4xl": "1224px",
      },
    },
  },
  plugins: [],
};
