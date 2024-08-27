import {getElementHeightWithoutBorderAndPadding} from './getElementHeightWithoutBorderAndPadding'
import {getElementWidthWithoutBorderAndPadding} from './getElementWidthWithoutBorderAndPadding'

export const getElementMinDimensions = (
	parent: HTMLElement | null
	// type: EHTMLTag
) => {
	const result = {width: 10, height: 10}

	if (parent) {
		const parentWidth = getElementWidthWithoutBorderAndPadding(parent)
		const parentHeight = getElementHeightWithoutBorderAndPadding(parent)

		result.width = Math.round(100 / (parentWidth / 100))
		result.height = Math.round(100 / (parentHeight / 100))
	}

	return result
}
