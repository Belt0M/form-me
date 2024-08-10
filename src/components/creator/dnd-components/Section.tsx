// src/components/creator/Section.tsx
import React, {FC, ReactElement} from 'react'

interface Props {
	style?: React.CSSProperties | null
	children?: ReactElement
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
}

const Section: FC<Props> = ({style, children, onDragEnter, onDragLeave}) => {
	return (
		<section
			className='relative w-full h-full p-4 bg-dark'
			style={{
				...style,
			}}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{children}
		</section>
	)
}

export default Section
