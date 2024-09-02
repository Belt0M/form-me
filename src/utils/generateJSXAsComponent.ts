import {EHTMLTag} from '../types/EHTMLTag'
import {ICanvasComponent} from '../types/ICanvasComponent'

export const generateJSXAsComponent = (
	components: ICanvasComponent,
	formName: string = 'Form'
): string => {
	let inputCounter = 1

	const generateState = (component: ICanvasComponent): string => {
		return component.type === EHTMLTag.INPUT
			? `nameValue${inputCounter++}: ''`
			: ''
	}

	const generateHandleChange = (): string => {
		let handleChangeCode = ''
		for (let i = 1; i < inputCounter; i++) {
			handleChangeCode += `
			[name]: value
		})
	}`
		}
		handleChangeCode = handleChangeCode.replace('return {...prev, ', '')
		return handleChangeCode
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

	const formState = generateState(components)
	const formComponentsJSX = generateComponentJSX(components)
	const handleChangeCode = generateHandleChange()

	return `
	const ${formName} = () => {
		const [state, setState] = useState({
			${formState}
		})

		const handleChange = (event) => {
			const { name, value } = event.target
			setState((prev) => ({
				...prev,
				${handleChangeCode}
			}))
		}

		const handleSubmit = (event) => {
			event.preventDefault()
			if (${Object.keys(components)
				.map((_, index) => `!state.nameValue${index + 1}`)
				.join(' || ')}) {
				alert('Please fill out all fields')
				return
			}
			alert(JSON.stringify(state, null, 2))
		}

		const isSubmitDisabled = ${Object.keys(components)
			.map((_, index) => `!state.nameValue${index + 1}`)
			.join(' || ')}

		return (
			<form onSubmit={handleSubmit}>
				${formComponentsJSX}
				<button type="submit" disabled={isSubmitDisabled}>
					Submit
				</button>
			</form>
		)
	}

	export default ${formName}
	`
}
