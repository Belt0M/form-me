import {EHTMLTag} from './EHTMLTag'

export interface ICanvasComponent {
	id: string
	type: EHTMLTag
	x?: number
	y?: number
	isHint?: boolean
	style?: React.CSSProperties
	children?: ICanvasComponent[]
	parent?: HTMLElement
}
