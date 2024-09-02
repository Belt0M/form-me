import {EHTMLTag} from '../types/EHTMLTag'
import {getElementHeightWithoutBorderAndPadding} from './getElementHeightWithoutBorderAndPadding'

export const getDefaultComponentHeight = (
	type: EHTMLTag,
	parentID: string | null
) => {
	let parentHeight = null

	if (parentID) {
		const parent = document.getElementById(parentID)

		if (parent) {
			parentHeight = getElementHeightWithoutBorderAndPadding(parent)
		}
	}

	let result = '100%'

	switch (type) {
		case EHTMLTag.DIV:
			result = parentHeight
				? Math.round((100 / parentHeight) * 100) + '%'
				: '100px'
			break
		case EHTMLTag.HEADING:
			result = 'auto'
			break
		case EHTMLTag.BUTTON:
			result = '40px'
			break
		case EHTMLTag.INPUT:
			result = parentHeight
				? Math.round((40 / parentHeight) * 100) + '%'
				: '40px'
			break
		case EHTMLTag.IMG:
			result = parentHeight
				? Math.round((200 / parentHeight) * 100) + '%'
				: '200px'
			break
		default:
			break
	}

	return result
}
