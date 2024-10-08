import {EHTMLTag} from '../types/EHTMLTag'
import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateSimpleJSX = (component: ICanvasComponent): string => {
	const {type, style, children, content, level, src} = component

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
		jsxTag += ` style={{ ${styleString} }} `
	}

	if (type === EHTMLTag.IMG) {
		jsxTag += `src='${src}' />`
	} else if (type === EHTMLTag.INPUT && style?.placeholder) {
		jsxTag += `placeholder='${style.placeholder}' >`
	} else {
		jsxTag += `>`

		if (content) {
			jsxTag += content
		}
	}

	if (children && children.length > 0) {
		jsxTag += children.map(child => generateSimpleJSX(child)).join('')
	}

	if (type !== EHTMLTag.IMG) {
		jsxTag += `</${type === 'heading' && level ? `h${level}` : type}>`
	}

	return jsxTag
}
