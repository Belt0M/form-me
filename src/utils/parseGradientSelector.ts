import {IGradient} from '../types/IGradient'

export function parseGradientSelector(gradientString: string): IGradient {
	const isGradient = gradientString.includes('linear-gradient')

	if (!isGradient) {
		return {
			direction: '',
			startColor: '',
			endColor: '',
			enabled: false,
		}
	}

	const gradientDetails = gradientString.match(/linear-gradient\(([^)]+)\)/)

	if (!gradientDetails || gradientDetails.length < 2) {
		throw new Error('Invalid gradient string')
	}

	const [direction, startColor, endColor] = gradientDetails[1]
		.split(',')
		.map(str => str.trim())

	return {
		direction,
		startColor,
		endColor,
		enabled: true,
	}
}
