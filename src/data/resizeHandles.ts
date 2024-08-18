import {CSSProperties} from 'react'

interface IResizeHandle {
	direction: 'top' | 'bottom' | 'left' | 'right'
	styles: CSSProperties
}

export const resizeHandlers: IResizeHandle[] = [
	{
		direction: 'top',
		styles: {
			width: '100%',
			height: '7px',
			top: 0,
			left: 0,
			cursor: 'n-resize',
		},
	},
	{
		direction: 'bottom',
		styles: {
			width: '100%',
			height: '7px',
			bottom: 0,
			left: 0,
			cursor: 's-resize',
		},
	},
	{
		direction: 'left',
		styles: {
			width: '7px',
			height: '100%',
			left: 0,
			top: 0,
			cursor: 'w-resize',
		},
	},
	{
		direction: 'right',
		styles: {
			width: '7px',
			height: '100%',
			right: 0,
			top: 0,
			cursor: 'e-resize',
		},
	},
]
