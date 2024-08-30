import {EHTMLTag} from '../types/EHTMLTag'
import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateJSX = (component: ICanvasComponent): string => {
	const {type, style, children, content, level} = component

	let jsxTag = ''

	if (type === EHTMLTag.HEADING && level) {
		jsxTag = `<h${level}`
	} else {
		jsxTag = `<${type}`
	}

	const styleString = style
		? Object.entries(style)
				.filter(([key]) => key !== 'level')
				.map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
				.join(', ')
		: ''

	if (styleString) {
		jsxTag += ` style={{ ${styleString} }}`
	}

	jsxTag += `>`

	if (content) {
		jsxTag += content
	}

	if (children && children.length > 0) {
		jsxTag += children.map(child => generateJSX(child)).join('')
	}

	jsxTag += `</${type === 'heading' && level ? `h${level}` : type}>`

	return jsxTag
}
