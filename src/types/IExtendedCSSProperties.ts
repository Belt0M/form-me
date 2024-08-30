export interface IExtendedCSSProperties extends React.CSSProperties {
	inputType?: string
	buttonType?: 'button' | 'submit'
	placeholder?: string
	maxLength?: number
	pattern?: string
	min?: number | string
	max?: number | string
	step?: number
	required?: boolean
}
