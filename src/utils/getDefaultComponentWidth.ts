import {EHTMLTag} from '../types/EHTMLTag'
import {getElementWidthWithoutBorderAndPadding} from './getElementWidthWithoutBorderAndPadding'

export const getDefaultComponentWidth = (
	type: EHTMLTag,
	parentID: string | null
) => {
	let parentWidth = null

	if (parentID) {
		const parent = document.getElementById(parentID)

		if (parent) {
			parentWidth = getElementWidthWithoutBorderAndPadding(parent)
		}
	}

	let result = '100%'

	switch (type) {
		case EHTMLTag.HEADING:
			result = 'auto'
			break
		case EHTMLTag.BUTTON:
			result = '100px'
			break
		case EHTMLTag.INPUT:
			result = parentWidth
				? Math.round((200 / parentWidth) * 100) + '%'
				: '200px'
			break
		default:
			break
	}

	return result
}
