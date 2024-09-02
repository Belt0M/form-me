import {EHTMLTag} from '../types/EHTMLTag'
import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateJSXAsComponent = (
	component: ICanvasComponent,
	formName: string = 'Form'
): string => {
	const stateEntries: string[] = []
	const stateConditions: string[] = []
	let inputCounter = 1

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

	const generateComponentJSX = (component: ICanvasComponent): string => {
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

		if (type === EHTMLTag.IMG && src) {
			jsxTag += `src='${src}' `
		}

		if (type === EHTMLTag.INPUT) {
			const name = `nameValue${inputCounter++}`
			jsxTag += ` name='${name}' value={state.${name}} onChange={handleChange} `
		}

		jsxTag += `>`

		if (content) {
			jsxTag += content
		}

		if (children && children.length > 0) {
			jsxTag += children.map(child => generateComponentJSX(child)).join('')
		}

		jsxTag += `</${type === 'heading' && level ? `h${level}` : type}>`

		return jsxTag
	}

	// Генерація стану
	generateState(component)

	// Генерація JSX коду компонентів
	const formComponentsJSX = generateComponentJSX(component)

	// Генерація JSX коду для кореневого тега форми
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

  const isSubmitDisabled = ${stateConditions.join(' || ')};

  return (
    ${formComponentsJSX.replace('<form', '<form onSubmit={handleSubmit}')}
    <button type="submit" disabled={isSubmitDisabled}>
      Submit
    </button>
    </form>
  );
};

export default ${formName};
  `
}
