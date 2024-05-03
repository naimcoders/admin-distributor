import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        "md-max": { max: "768px" },
        lg: "1024px",
      },
      width: {
        calcSideBar: "calc(100% - 224px)",
        calcLogin: "calc(100% - 70%)",
      },
      height: {
        calcSideBar: "calc(100vh - 12%)",
        calcSideBarDrawer: "calc(100vh - 16%)",
        calcOutlet: "calc(100vh - 100px)",
        calcDashboardTable: "calc(100vh - 25rem)",
        calcProductTable: "calc(100vh - 17rem)",
        calcSubDistributorTable: "calc(100vh - 17rem)",
      },
      fontFamily: {
        interRegular: ["interRegular", "sans"],
        interThin: ["interThin", "sans"],
        interMedium: ["interMedium", "sans"],
        interBold: ["interBold", "sans"],
      },
      fontSize: {
        "clamp-1.5rem-4vw-2rem": "clamp(1.5rem, 4vw, 2rem)",
        "clamp-1rem-4vw-1.4rem": "clamp(1rem, 6vw, 1.4rem)",
        vmin: "3vmin",
        "2vmin": "2vmin",
      },
      aspectRatio: {
        "3/4": "3 / 4",
      },
      colors: {
        primary: "#093DB0",
        secondary: "#FFFFFF",
        accentYellow: "#fbdb08",
        accentGray: "#E4E4E4",
      },
      gridTemplateColumns: {
        "20rem-1fr": "14rem 1fr",
        "auto-fit-min-200px": "repeat(auto-fit, minmax(150px, 1fr))",
        "auto-fit-min-300px": "repeat(auto-fit, minmax(240px, 1fr))",
      },
    },
  },
  plugins: [
    nextui({
      prefix: "nextui",
      defaultExtendTheme: "light",
      themes: {
        light: {
          colors: {
            background: "#E4E4E4",
          },
        },
      },
    }),
  ],
};
