/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#21c45d',
                'background-light': '#f8fafc',
                'background-dark': '#0f172a',
                'card-dark': '#111827',
                'surface-dark': '#1e293b',
                'risk-crit': '#ef4444',
                'risk-high': '#f97316',
                'risk-med': '#eab308',
                'risk-low': '#1dc95c',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                full: '9999px',
            },
        },
    },
    plugins: [],
};
