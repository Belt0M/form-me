import {EHTMLTag} from '../types/EHTMLTag'
import {getElementHeightWithoutBorderAndPadding} from './getElementHeightWithoutBorderAndPadding'
import {getElementWidthWithoutBorderAndPadding} from './getElementWidthWithoutBorderAndPadding'

export const getElementMinDimensions = (
	parent: HTMLElement | null,
	type?: EHTMLTag
) => {
	const result = {width: 10, height: 10}

	if (parent) {
		const parentWidth = getElementWidthWithoutBorderAndPadding(parent)
		const parentHeight = getElementHeightWithoutBorderAndPadding(parent)

		switch (type) {
			case EHTMLTag.INPUT:
				result.width = Math.round(100 / (parentWidth / 100))
				result.height = Math.round(30 / (parentHeight / 100))
				break
			default:
				result.width = Math.round(100 / (parentWidth / 100))
				result.height = Math.round(100 / (parentHeight / 100))
				break
		}
	}

	return result
}
