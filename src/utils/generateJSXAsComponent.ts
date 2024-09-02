import {EHTMLTag} from '../types/EHTMLTag'
import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateJSXAsComponent = (
	component: ICanvasComponent,
	formName: string = 'Form'
): string => {
	const stateEntries: string[] = []
	const stateConditions: string[] = []
	let inputCounter = 1
	let inputNameCounter = 1
	let hasFormHandlerAdded = false

	const generateState = (component: ICanvasComponent): void => {
		if (component.type === EHTMLTag.INPUT) {
			const stateKey = `nameValue${inputCounter}`

			stateEntries.push(`${stateKey}: ''`)
			stateConditions.push(`!state.${stateKey}`)
			inputCounter++
		}

		if (component.children && component.children.length > 0) {
			component.children.forEach(child => generateState(child))
		}
	}

	const generateComponentJSX = (
		component: ICanvasComponent,
		indentLevel: number = 1
	): string => {
		const {type, style, children, content, level, src} = component
		const indent = '  '.repeat(indentLevel)
		let jsxTag = ''

		if (type === EHTMLTag.HEADING && level) {
			jsxTag = `${indent}<h${level}`
		} else {
			jsxTag = `${indent}<${type}`
		}

		const styleString = style
			? Object.entries(style)
					.filter(([key]) => key !== 'level')
					.map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
					.join(`,\n${'  '.repeat(indentLevel + 2)}`)
			: ''

		if (styleString) {
			jsxTag += ` style={{\n${'  '.repeat(
				indentLevel + 2
			)}${styleString}\n${indent}  }}`
		}

		if (type === EHTMLTag.IMG && src) {
			jsxTag += ` src='${src}'`
		}

		if (type === EHTMLTag.INPUT) {
			const name = `nameValue${inputNameCounter++}`
			const inputType = style?.inputType ? ` type='${style.inputType}'` : ''
			jsxTag += `${inputType} name='${name}' value={state.${name} || ''} onChange={handleChange}`
		}

		if (type === EHTMLTag.BUTTON) {
			const buttonType = style?.buttonType ? ` type='${style.buttonType}'` : ''
			jsxTag += `${buttonType}`
		}

		if (type === EHTMLTag.FORM && !hasFormHandlerAdded) {
			jsxTag += ` onSubmit={handleSubmit}`
			hasFormHandlerAdded = true
		}

		if (type === EHTMLTag.IMG || type === EHTMLTag.INPUT) {
			jsxTag += ` />\n`
		} else {
			jsxTag += `>\n`

			if (content) {
				jsxTag += `${'  '.repeat(indentLevel + 1)}${content}\n`
			}

			if (children && children.length > 0) {
				jsxTag += children
					.map(child => generateComponentJSX(child, indentLevel + 1))
					.join('\n')
			}

			jsxTag += `${indent}</${
				type === 'heading' && level ? `h${level}` : type
			}>\n`
		}

		return jsxTag
	}

	generateState(component)

	const formComponentsJSX = generateComponentJSX(component, 1)

	return `
import React, { useState } from 'react';

const ${formName} = () => {
  const [state, setState] = useState({
    ${stateEntries.join(',\n    ')}
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (${stateConditions.join(' || ')}) {
      alert('Please fill out all fields');
      return;
    }
    alert(JSON.stringify(state, null, 2));
  };

  return (
    ${formComponentsJSX}
  );
};

export default ${formName};
  `
}
