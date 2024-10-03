import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {

        'sm': {'min': '320px', 'max': '470px'},
      },
      colors: {
        primary: "#74BDCB",
        background: "#FFA384",
        secondary: "#EFE7BC",
        activeCTA: "#FF9571"
      },
      boxShadow: {
        primary: "0 25px 30px -22px rgba(116, 189, 203, 0.25)",
        inputs: "0 10px 10px 1px rgba(80, 189, 203, 0.30)",
        buttonShadow: "0px 0px 20px 12px rgba(233, 138, 118, 1)"
      }, 
      gridTemplateColumns: {
        'notes': 'repeat(auto-fill, minmax(250px, 1fr))',
      }
    },
  },
  plugins: [],
}
export default config
