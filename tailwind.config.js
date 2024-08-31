/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#9333ea ',
				secondary: '#292524  ',
				dark: '#121212',
				hint: '#60a5fa ',
				hintBorder: '#1e3a8a ',
			},
			boxShadow: {
				custom: '0px 6px 32px -11px rgba(55, 56, 66, 1)',
			},
		},
	},
	plugins: [],
}
