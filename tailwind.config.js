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
                'background-light': '#f6f8f7',
                'background-dark': '#122017',
                'card-dark': '#111811',
                'surface-dark': '#1d2620',
            },
            fontFamily: {
                display: ['Outfit', 'sans-serif'],
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
