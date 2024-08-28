import {Trash} from '@phosphor-icons/react'
import React, {forwardRef} from 'react'

interface CanvasProps {
	isEmptyCanvas: boolean
	isDragging: boolean
	children?: React.ReactNode
	editingComponentId: string | null
	onDrop: () => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
	onDeleteComponent: (id?: string) => void
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
	(
		{
			isEmptyCanvas,
			isDragging,
			children,
			editingComponentId,
			onDrop,
			onDragOver,
			onDeleteComponent,
		},
		ref
	) => {
		const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			onDragOver(event)
		}

		const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			onDrop()
		}

		const handleDelete = () => {
			onDeleteComponent(editingComponentId!)
		}

		return (
			<section
				ref={ref}
				className='relative flex items-center justify-center flex-grow px-20 py-12 bg-stone-800 canvas-grid '
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{isDragging && isEmptyCanvas && (
					<div
						className='w-full h-full bg-green-300 border-2 border-green-300 border-dashed bg-opacity-10'
						aria-disabled={true}
					/>
				)}
				{editingComponentId && (
					<div
						className='absolute flex gap-2 px-4 py-2 rounded-lg top-2 right-2 bg-dark bg-opacity-80 z-[100]'
						aria-disabled={true}
					>
						<Trash
							className='text-red-500 transition-all cursor-pointer hover:scale-105'
							weight='bold'
							size={20}
							aria-disabled={true}
							onClick={handleDelete}
						/>
					</div>
				)}
				{children}
			</section>
		)
	}
)

export default Canvas
