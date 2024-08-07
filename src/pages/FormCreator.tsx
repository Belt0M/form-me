import
	{
		DndContext,
		DragEndEvent,
		DragMoveEvent,
		DragOverlay,
		DragStartEvent,
		UniqueIdentifier,
	} from '@dnd-kit/core'
import React, { useCallback, useState } from 'react'
import Canvas from '../components/creator/Canvas'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'
import { IComponent } from '../types/IComponent'

const FormCreator: React.FC = () => {
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
	const [components, setComponents] = useState<IComponent[]>([])
	const [hoveredPosition, setHoveredPosition] = useState<{
		x: number
		y: number
	} | null>(null)

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const {active, over} = event
		setActiveId(null)

		if (over && over.id === 'canvas') {
			const rect = over.rect
			const position = {
				x: Math.floor((rect.left + rect.width / 2) / 50) * 50,
				y: Math.floor((rect.top + rect.height / 2) / 50) * 50,
			}
			setComponents(components => [
				...components,
				{id: active.id, position, styles: null},
			])
			setHoveredPosition(null)
		}
	}

	const handleDragMove = useCallback((event: DragMoveEvent) => {
		const {over} = event
		if (over && over.id === 'canvas') {
			const rect = over.rect
			const position = {
				x: Math.floor((event.delta.x + rect.width) / 50) * 50,
				y: Math.floor((event.delta.y + rect.height / 2) / 50) * 50,
			}
			console.log(event.delta, rect, position)
			setHoveredPosition(position)
		}
	}, [])

	return (
		<>
			<Header
				actions={
					<button
						className='px-4 pt-2 pb-[0.55rem] text-white bg-purple-800 rounded hover:brightness-110 transition-all'
						type='button'
					>
						Export Form
					</button>
				}
			/>
			<main className='flex max-h-[calc(100vh-80.8px)] overflow-hidden'>
				<DndContext
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragMove={handleDragMove}
				>
					<Canvas
						components={components}
						hoveredPosition={hoveredPosition}
						setComponents={setComponents}
					/>
					<Sidebar />
					<DragOverlay>
						{activeId ? (
							<div className='p-2 mb-2 text-white rounded cursor-pointer bg-stone-700'>
								{activeId}
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			</main>
		</>
	)
}

export default FormCreator
