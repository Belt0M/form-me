import {EHTMLTag} from '../types/EHTMLTag'

export const getIsComponentWithChildren = (type: EHTMLTag): boolean => {
	const components: EHTMLTag[] = [EHTMLTag.DIV, EHTMLTag.FORM]

	return components.includes(type)
}
