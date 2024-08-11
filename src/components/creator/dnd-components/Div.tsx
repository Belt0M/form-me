import React, {CSSProperties, FC, ReactElement} from 'react'

interface Props {
	id: string
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: () => void
	onMouseLeave?: () => void
}

const Div: FC<Props> = ({
	id,
	style,
	children,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
}) => {
	return (
		<div
			className='h-24 bg-gray-300 min-h-24'
			id={id}
			style={style}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{children}
		</div>
	)
}

export default Div
