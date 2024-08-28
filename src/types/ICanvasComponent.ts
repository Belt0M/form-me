import {EHTMLTag} from './EHTMLTag'
import {IExtendedCSSProperties} from './IExtendedCSSProperties'

export interface ICanvasComponent {
	id: string
	type: EHTMLTag
	x?: number
	y?: number
	isHint?: boolean
	style?: IExtendedCSSProperties
	children?: ICanvasComponent[]
	parent?: HTMLElement
	isBlock?: boolean
}
