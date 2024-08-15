import React, {forwardRef} from 'react'

interface CanvasProps {
	isEmptyCanvas: boolean
	isDragging: boolean
	children?: React.ReactNode
	onDrop: () => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
	({isEmptyCanvas, isDragging, children, onDrop, onDragOver}, ref) => {
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
				ref={ref}
				className='relative flex-grow px-20 py-12 bg-stone-800 canvas-grid'
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{isDragging && isEmptyCanvas && (
					<div
						className='w-full h-full bg-green-300 border-2 border-green-300 border-dashed bg-opacity-10'
						aria-disabled={true}
					/>
				)}
				{children}
			</section>
		)
	}
)

export default Canvas
