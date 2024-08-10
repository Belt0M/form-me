import React, {useState} from 'react'
import Canvas from '../components/creator/Canvas'
import RenderCanvasComponent from '../components/creator/CanvasRenderer'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'
import {EHTMLTag} from '../types/EHTMLTag'
import {EPosition} from '../types/EPosition'
import {ICanvasComponent} from '../types/ICanvasComponent'

const FormCreator: React.FC = () => {
	const [canvasComponents, setCanvasComponents] = useState<ICanvasComponent[]>(
		[]
	)
	const [selectedComponent, setSelectedComponent] = useState<EHTMLTag | null>(
		null
	)
	const [positionMode, setPositionMode] = useState<EPosition>(
		EPosition.RELATIVE
	)
	const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(
		null
	)

	const handleDragStart = (type: EHTMLTag, position: EPosition) => {
		setSelectedComponent(type)
		setPositionMode(position)
	}

	const addComponent = (
		parentId: string | null,
		newComponent: ICanvasComponent
	) => {
		setCanvasComponents(prevComponents => {
			if (!parentId) {
				return [...prevComponents, newComponent]
			}

			const addChild = (components: ICanvasComponent[]): ICanvasComponent[] => {
				return components.map(component => {
					if (component.id === parentId) {
						return {
							...component,
							children: component.children
								? [...component.children, newComponent]
								: [newComponent],
						}
					}
					if (component.children) {
						return {
							...component,
							children: addChild(component.children),
						}
					}
					return component
				})
			}

			return addChild(prevComponents)
		})
	}

	const handleDrop = (x: number, y: number) => {
		if (selectedComponent === null) return

		const id = crypto.randomUUID()
		const newComponent: ICanvasComponent = {
			id,
			type: selectedComponent,
			style: {position: positionMode},
			children: [],
		}

		// Якщо positionMode не абсолютний, не встановлюємо x і y
		if (positionMode === EPosition.ABSOLUTE) {
			newComponent.x = x
			newComponent.y = y
		}

		if (hoveredComponentId) {
			addComponent(hoveredComponentId, newComponent)
		} else {
			addComponent(null, newComponent)
		}

		setSelectedComponent(null)
		setHoveredComponentId(null)
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

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
			<main className='flex h-[calc(100vh-80.8px)] overflow-hidden'>
				<Canvas onDrop={handleDrop} onDragOver={handleDragOver}>
					{canvasComponents.map(component => (
						<RenderCanvasComponent
							key={component.id}
							component={component}
							setHoveredComponentId={setHoveredComponentId}
						/>
					))}
				</Canvas>
				<Sidebar onDragStart={handleDragStart} />
			</main>
		</>
	)
}

export default FormCreator
