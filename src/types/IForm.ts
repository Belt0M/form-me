import {ICanvasComponent} from './ICanvasComponent'

export interface IForm {
	id: string
	title: string
	description: string
	components: ICanvasComponent[]
}
