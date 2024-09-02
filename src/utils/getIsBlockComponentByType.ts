import {EHTMLTag} from '../types/EHTMLTag'

export const getIsBlockComponentByType = (type: EHTMLTag): boolean => {
	const blockComponents: EHTMLTag[] = [
		EHTMLTag.DIV,
		EHTMLTag.FORM,
		EHTMLTag.INPUT,
		EHTMLTag.BUTTON,
		EHTMLTag.IMG,
	]

	return blockComponents.includes(type)
}
