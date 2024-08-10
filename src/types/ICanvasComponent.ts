export interface ICanvasComponent {
	id: string
	type: string
	x?: number
	y?: number
	style?: React.CSSProperties
	children?: ICanvasComponent[]
}
