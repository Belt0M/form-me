import {EHTMLTag} from '../types/EHTMLTag'

export const getIsBlockComponentByType = (type: EHTMLTag): boolean => {
	const blockComponents: EHTMLTag[] = [
		EHTMLTag.DIV,
		EHTMLTag.SECTION,
		EHTMLTag.INPUT,
		EHTMLTag.BUTTON,
	]

	return blockComponents.includes(type)
}
