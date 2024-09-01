import {EHTMLTag} from './EHTMLTag'
import {IExtendedCSSProperties} from './IExtendedCSSProperties'

export interface ICanvasComponent {
	id: string
	type: EHTMLTag
	isHint?: boolean
	isErrorHint?: boolean
	style?: IExtendedCSSProperties
	content?: string
	children?: ICanvasComponent[]
	parent?: HTMLElement
	isBlock?: boolean
	level?: number
}
