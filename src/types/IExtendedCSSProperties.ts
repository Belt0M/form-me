export interface IExtendedCSSProperties extends React.CSSProperties {
	level?: number
	text?: string
	inputType?: string
	placeholder?: string
	maxLength?: number
	pattern?: string
	min?: number | string
	max?: number | string
	step?: number
	required?: boolean
}
