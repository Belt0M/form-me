// src/components/Canvas.tsx
import React, {useState} from 'react'
import {IComponent} from '../../types/IComponent'

interface CanvasProps {
	onDrop: (component: IComponent, x: number, y: number) => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
	children?: React.ReactNode
	selectedComponent: IComponent | null
}

const Canvas: React.FC<CanvasProps> = ({
	onDrop,
	onDragOver,
	children,
	selectedComponent,
}) => {
	const [highlightPosition, setHighlightPosition] = useState<{
		x: number
		y: number
	} | null>(null)
	const [hoveredComponent, setHoveredComponent] = useState<{
		component: string
		position: string
	} | null>(null)

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		// Set hovered component based on drag data
		const component = event.dataTransfer.getData('component')
		const position = event.dataTransfer.getData('position')
		setHoveredComponent({component, position})
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		const rect = event.currentTarget.getBoundingClientRect()
		const x = Math.floor((event.clientX - rect.left) / 50) * 50
		const y = Math.floor((event.clientY - rect.top) / 50) * 50
		setHighlightPosition({x, y})
		onDragOver(event)
	}

	const handleDragLeave = () => {
		setHighlightPosition(null)
		setHoveredComponent(null)
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (highlightPosition && selectedComponent) {
			onDrop(selectedComponent, highlightPosition.x, highlightPosition.y)
			setHighlightPosition(null)
			setHoveredComponent(null)
		}
	}

	return (
		<div
			className='relative flex-grow p-4 bg-stone-800 canvas-grid'
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{/* Highlight Box */}
			{highlightPosition && (
				<div
					className='absolute w-[50px] h-[50px] bg-purple-600 opacity-50 pointer-events-none'
					style={{
						left: highlightPosition.x,
						top: highlightPosition.y,
					}}
				/>
			)}
			{/* Render Canvas Components */}
			{children}
		</div>
	)
}

export default Canvas
