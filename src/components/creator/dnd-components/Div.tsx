import React, {CSSProperties, FC, ReactElement} from 'react'

interface Props {
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: () => void
	onMouseLeave?: () => void
}

const Div: FC<Props> = ({
	style,
	children,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
}) => {
	return (
		<div
			className='h-24 bg-gray-300'
			style={style}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</div>
	)
}

export default Div
