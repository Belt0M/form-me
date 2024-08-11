import React from 'react'

interface CanvasProps {
	onDrop: () => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
	children?: React.ReactNode
}

const Canvas: React.FC<CanvasProps> = ({onDrop, onDragOver, children}) => {
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()

		onDragOver(event)
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()

		onDrop()
	}

	return (
		<section
			className='relative flex-grow px-20 py-12 bg-stone-800 canvas-grid'
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{children}
		</section>
	)
}

export default Canvas
