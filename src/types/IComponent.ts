import {UniqueIdentifier} from '@dnd-kit/core'
import {IStyles} from './IStyles'

export interface IComponent {
	id: UniqueIdentifier
	position: {x: number; y: number}
	styles: IStyles | null
}
