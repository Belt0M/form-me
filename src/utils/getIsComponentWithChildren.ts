import {EHTMLTag} from '../types/EHTMLTag'

export const getIsComponentWithChildren = (type: EHTMLTag): boolean => {
	const components: EHTMLTag[] = [EHTMLTag.DIV, EHTMLTag.SECTION]

	return components.includes(type)
}
