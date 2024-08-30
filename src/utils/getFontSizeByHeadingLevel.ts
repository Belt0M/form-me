export function getFontSizeByHeadingLevel(level: number): string {
	let result = 16

	switch (level) {
		case 1:
			result = 32
			break
		case 2:
			result = 25.6
			break
		case 3:
			result = 22.4
			break
		case 4:
			result = 19.2
			break
		case 5:
			result = 16
			break
		case 6:
			result = 12.8
			break
		default:
			break
	}

	return result + 'px'
}
