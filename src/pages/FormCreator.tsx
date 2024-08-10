// src/pages/FormCreator.tsx
import React, {useState} from 'react'
import Canvas from '../components/creator/Canvas'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'
import {IComponent} from '../types/IComponent'

interface CanvasComponent {
	component: IComponent
	x: number
	y: number
}

const FormCreator: React.FC = () => {
	const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
		[]
	)
	const [selectedComponent, setSelectedComponent] = useState<IComponent | null>(
		null
	)
	const [currentPosition, setCurrentPosition] = useState<string>('relative')

	const handleDragStart = (
		component: IComponent,
		position: string,
		event: React.DragEvent<HTMLDivElement>
	) => {
		setSelectedComponent(component)
		setCurrentPosition(position)

		const dragGhost = document.createElement('div')

		dragGhost.className =
			'p-2 mb-2 text-white border bg-stone-500 border-stone-700'
		dragGhost.textContent = component.id as string
		document.body.appendChild(dragGhost)
		dragGhost.style.position = 'absolute'
		dragGhost.style.top = '-9999px'

		const {width, height} = dragGhost.getBoundingClientRect()
		event.dataTransfer.setDragImage(dragGhost, width / 2, height / 2)

		setTimeout(() => {
			document.body.removeChild(dragGhost)
		}, 0)
	}

	const handleDrop = (component: IComponent, x: number, y: number) => {
		setCanvasComponents([...canvasComponents, {component, x, y}])
		setSelectedComponent(null)
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
				<Canvas
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					selectedComponent={selectedComponent}
				>
					{canvasComponents.map((component, index) => (
						<div
							key={index}
							className={`absolute`}
							style={{
								left: component.x,
								top: component.y,
							}}
						>
							{component.component.id}
						</div>
					))}
				</Canvas>
				<Sidebar onDragStart={handleDragStart} />
			</main>
		</>
	)
}

export default FormCreator
