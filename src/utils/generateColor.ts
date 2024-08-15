export function generateColor(id: number): string {
	const colors = [
		{red: 50, green: 0, blue: 100},
		{red: 0, green: 50, blue: 100},
		{red: 100, green: 0, blue: 50},
	]

	const shadesPerColor = 20
	const colorIndex = Math.floor(id / shadesPerColor) % colors.length
	const shadeOffset = id % shadesPerColor

	const baseColor = colors[colorIndex]

	const red = Math.max(0, Math.min(255, baseColor.red + shadeOffset * 10))
	const green = Math.max(0, Math.min(255, baseColor.green + shadeOffset * 10))
	const blue = Math.max(0, Math.min(255, baseColor.blue + shadeOffset * 10))

	const redHex = red.toString(16).padStart(2, '0')
	const greenHex = green.toString(16).padStart(2, '0')
	const blueHex = blue.toString(16).padStart(2, '0')

	return `#${redHex}${greenHex}${blueHex}`
}
