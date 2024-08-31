export const roundTo = (value: number, to: number = 1): number => {
	const mult = 10 ** to

	return Math.round(value * mult) / mult
}
