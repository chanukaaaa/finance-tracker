import withMT from "@material-tailwind/react/utils/withMT";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import scrollbarHide from "tailwind-scrollbar-hide";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        larsseit: ["Larsseit", "sans-serif"],
        larsseitBold: ["LarsseitBold", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        colfaxWeb: ["ColfaxWeb, sans-serif"],
        geologica: ["Geologica, sans-serif"],
        poppins: ["Poppins, serif"],
      },
      colors: {
        "bottom-border": "#FFFFFF03",
        "theme-color": "#461058",
        "theme-title": "#C38ED1",
        purple: "#9165A0",
      },
      screens: {
        "3xl": "1400px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [typography, scrollbarHide],
});
