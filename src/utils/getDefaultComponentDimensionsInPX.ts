import {EHTMLTag} from '../types/EHTMLTag'

export const getDefaultComponentDimensionsInPX = (type: EHTMLTag) => {
	let width = -1
	let height = -1

	//  -1 === 100%
	switch (type) {
		case EHTMLTag.DIV:
			height = 100
			break
		case EHTMLTag.HEADING:
			height = 38
			break
		case EHTMLTag.BUTTON:
			width = 100
			height = 40
			break
		case EHTMLTag.INPUT:
			width = 200
			height = 40
			break
		case EHTMLTag.IMG:
			width = 350
			height = 200
			break
		default:
			break
	}

	return {width, height}
}
