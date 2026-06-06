export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Premium Medical Teal Identity Transformation
        primary: '#0d9488',          // Soothing Teal 600 (Main brand, buttons, accents)
        'primary-light': '#f0fdfa',    // Ultra-soft Teal 50 (Card backgrounds, alerts)
        'primary-dark': '#115e59',     // Deep Teal 800 (Hover states, headers, dark text)
        
        // Clinical Alert States (Kept highly standard for healthcare readability)
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        'risk-high': '#EF4444',
        'risk-medium': '#F59E0B',
        'risk-low': '#10B981',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}