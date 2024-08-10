import React, {CSSProperties, FC, ReactElement} from 'react'

interface Props {
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: () => void
	onMouseLeave?: () => void
}

const Section: FC<Props> = ({
	style,
	children,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
}) => {
	return (
		<section
			className='h-full min-h-[200px] bg-gray-500'
			style={style}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</section>
	)
}

export default Section
