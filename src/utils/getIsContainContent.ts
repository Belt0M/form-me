import {EHTMLTag} from '../types/EHTMLTag'

export const getIsContainContent = (type: EHTMLTag) => {
	let result = false

	switch (type) {
		case EHTMLTag.BUTTON:
		case EHTMLTag.HEADING:
			result = true
			break
		default:
			break
	}

	return result
}
