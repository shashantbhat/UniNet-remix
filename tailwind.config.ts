import type { Config } from "tailwindcss";


export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeOut: 'fadeOut 1s ease-in-out 4s forwards',
        fadeIn: 'fadeIn 4s ease-in-out 5s forwards',
        typing: 'typing 3s forwards',
        "spinner": "spinner 1.2s linear infinite",
      },
      keyframes: {
        "spinner": {
          "0%": {
            "opacity": "1"
          },
          "100%": {
            "opacity": "0.15"
          }   
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typing: {
          '0%': {width: '0%'},
          '100%': {width: '100%'},
        },
      },
      fontFamily: {
        "sans":[
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

