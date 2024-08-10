import React, {CSSProperties, FC, ReactElement} from 'react'

interface Props {
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
}

const Div: FC<Props> = ({style, children, onDragEnter, onDragLeave}) => {
	return (
		<div
			className='p-4 bg-secondary'
			style={style}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{children}
		</div>
	)
}

export default Div
