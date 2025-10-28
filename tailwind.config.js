/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- BDLV Explains ---
        // यहाँ हमने आपके नए थीम कलर्स को डिफाइन किया है।
        // अब हम पूरे ऐप में '#00bf8f' की जगह 'brand-green' का इस्तेमाल कर सकते हैं।
        'brand-green': '#00bf8f', // आपका मुख्य हरा रंग
        'brand-dark': '#001510',  // आपका मुख्य डार्क बैकग्राउंड
      },
    },
  },
  plugins: [],
}