import React, {useState} from 'react'

interface CanvasProps {
	onDrop: (x: number, y: number) => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
	children?: React.ReactNode
}

const Canvas: React.FC<CanvasProps> = ({onDrop, onDragOver, children}) => {
	const [highlightPosition, setHighlightPosition] = useState<{
		x: number
		y: number
	} | null>(null)

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		const rect = event.currentTarget.getBoundingClientRect()
		const x = Math.floor((event.clientX - rect.left) / 50) * 50
		const y = Math.floor((event.clientY - rect.top) / 50) * 50
		setHighlightPosition({x, y})
		onDragOver(event)
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (highlightPosition) {
			onDrop(highlightPosition.x, highlightPosition.y)
			setHighlightPosition(null)
		}
	}

	return (
		<section
			className='relative flex-grow px-20 py-12 bg-stone-800 canvas-grid'
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{highlightPosition && (
				<div
					className='absolute w-[50px] h-[50px] bg-purple-600 opacity-50 pointer-events-none'
					style={{
						left: highlightPosition.x,
						top: highlightPosition.y,
						border: '2px dashed #4A4A4A', // Highlighted border
					}}
				/>
			)}
			{children}
		</section>
	)
}

export default Canvas
