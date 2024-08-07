import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { IComponent } from '../../types/IComponent'
import ComponentContext from './ComponentContext'

const Canvas: React.FC<{
	components: IComponent[]
	hoveredPosition: {x: number; y: number} | null
	setComponents: React.Dispatch<React.SetStateAction<IComponent[]>>
}> = ({components, hoveredPosition, setComponents}) => {
	const {setNodeRef} = useDroppable({id: 'canvas'})
	const [selectedComponent, setSelectedComponent] =
		React.useState<IComponent | null>(null)

	const handleComponentClick = (component: IComponent) => {
		setSelectedComponent(component)
	}

	const handleComponentContextClose = () => {
		setSelectedComponent(null)
	}

	const updateComponent = (updatedComponent: IComponent) => {
		setComponents(
			components.map(comp =>
				comp.id === updatedComponent.id ? updatedComponent : comp
			)
		)
	}

	return (
		<div
			ref={setNodeRef}
			className='relative grid flex-grow p-4 bg-stone-800 canvas-grid'
			style={{
				gridTemplateColumns: `repeat(auto-fill, 50px)`,
				gridTemplateRows: `repeat(auto-fill, 50px)`,
			}}
		>
			{components.map((component, index) => (
				<div
					key={index}
					className='absolute p-2 mb-2 text-white bg-gray-700 rounded cursor-pointer'
					onClick={() => handleComponentClick(component)}
					style={{top: component.position.y, left: component.position.x}}
				>
					{component.id}
				</div>
			))}
			{hoveredPosition && (
				<div
					className='absolute border-2 border-blue-500 border-dashed'
					style={{
						top: hoveredPosition.y,
						left: hoveredPosition.x,
						width: '50px',
						height: '50px',
					}}
				/>
			)}
			{selectedComponent && (
				<ComponentContext
					component={selectedComponent}
					onClose={handleComponentContextClose}
					onUpdate={updateComponent}
				/>
			)}
		</div>
	)
}

export default Canvas
