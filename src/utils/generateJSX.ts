import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateJSX = (component: ICanvasComponent): string => {
	const {type, style, children} = component

	const styleString = style
		? Object.entries(style)
				.map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
				.join(', ')
		: ''

	let jsxTag = `<${type}`

	if (styleString) {
		jsxTag += ` style={{ ${styleString} }}`
	}

	jsxTag += `>`

	if (children && children.length > 0) {
		jsxTag += children.map(child => generateJSX(child)).join('')
	}

	jsxTag += `</${type}>`

	return jsxTag
}
