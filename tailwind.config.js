/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#9333ea ',
				darkGray: '#2f313f',
				middleGray: '#555665',
				lightGray: '#575968',
				secondary: '#292524  ',
				dark: '#121212',
				hint: '#60a5fa ',
				hintBorder: '#1e3a8a ',
			},
			boxShadow: {
				custom: '0px 6px 32px -11px rgba(55, 56, 66, 1)',
				hoverGUI: ' 0px 0px 0px 2px rgba(255, 225, 40, 1)',
				hoverGUI2: ' 0px 0px 0px 1px rgba(255, 225, 40, 1)',
				editGUI: ' 0px 0px 0px 2px #14b8a6',
			},
		},
	},
	plugins: [],
}
