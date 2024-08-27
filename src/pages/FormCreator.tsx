import React, {useRef, useState} from 'react'
import Canvas from '../components/creator/Canvas'
import RenderCanvasComponent from '../components/creator/CanvasRenderer'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'
import {useClickOutside} from '../hooks/useClickOutside'
import {EHTMLTag} from '../types/EHTMLTag'
import {EPosition} from '../types/EPosition'
import {ICanvasComponent} from '../types/ICanvasComponent'
import {generateColor} from '../utils/generateColor'
import {getElementHeightWithoutBorderAndPadding} from '../utils/getElementHeightWithoutBorderAndPadding'

const FormCreator: React.FC = () => {
	const [canvasComponents, setCanvasComponents] = useState<ICanvasComponent[]>(
		[]
	)
	const [canvasComponentsArr, setCanvasComponentsArr] = useState<
		ICanvasComponent[]
	>([])
	const [draggedComponentType, setDraggedComponentType] =
		useState<EHTMLTag | null>(null)
	const [positionMode, setPositionMode] = useState<EPosition>(
		EPosition.RELATIVE
	)
	const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(
		null
	)
	const [editingComponentId, setEditingComponentId] = useState<string | null>(
		null
	)
	const [draggingType, setDraggingType] = useState<EHTMLTag | null>(null)
	const [isHintShowing, setIsHintShowing] = useState<boolean>(false)

	const [isResizing, setIsResizing] = useState<boolean>(false)

	const canvasRef = useRef<HTMLDivElement>(null)

	useClickOutside(canvasRef, editingComponentId, setEditingComponentId)

	const defaultStyles: React.CSSProperties = {
		position: 'relative',
		padding: '.5rem',
	}

	const handleDragStart = (type: EHTMLTag, position: EPosition) => {
		setDraggingType(type)
		setDraggedComponentType(type)
		setPositionMode(position)
	}

	const handleDragEnd = () => {
		setDraggingType(null)
	}

	const addComponent = (
		parentId: string | null,
		newComponent: ICanvasComponent,
		isHint?: boolean
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
		!isHint && setCanvasComponentsArr(prev => [...prev, newComponent])
	}

	const handleDrop = () => {
		handleDeleteComponent()

		if (draggedComponentType === null) return
		if (canvasComponents.length && !hoveredComponentId) return

		const getHeightByComponentType = (
			type: EHTMLTag,
			parentID: string | null
		) => {
			let parentHeight = null

			if (parentID) {
				const parent = document.getElementById(parentID)

				if (parent) {
					parentHeight = getElementHeightWithoutBorderAndPadding(parent)
				}
			}

			let result = '100%'

			switch (type) {
				case EHTMLTag.DIV:
					result = parentHeight
						? Math.round((100 / parentHeight) * 100) + '%'
						: '100px'
					break
				default:
					break
			}

			return result
		}

		const height = getHeightByComponentType(
			draggedComponentType,
			hoveredComponentId
		)

		const backgroundColor = generateColor(canvasComponentsArr.length + 1)

		const id = crypto.randomUUID()
		const newComponent: ICanvasComponent = {
			id,
			type: draggedComponentType,
			style: {
				...defaultStyles,
				position: positionMode,
				height,
				width: '100%',
				backgroundColor,
			},
			children: [],
		}

		if (hoveredComponentId) {
			addComponent(hoveredComponentId, newComponent)
		} else {
			addComponent(null, newComponent)
		}

		setDraggedComponentType(null)
		setHoveredComponentId(null)
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleDeleteComponent = (id?: string) => {
		const isHint = !id

		if (!isHint && id === hoveredComponentId) {
			setHoveredComponentId(null)
			setEditingComponentId(null)
		}

		const removeHintComponent = (
			components: ICanvasComponent[]
		): ICanvasComponent[] => {
			return components
				.map(component => {
					if (component.isHint) {
						return null
					}

					if (component.children && component.children.length > 0) {
						component.children = removeHintComponent(component.children)
					}

					return component
				})
				.filter(Boolean) as ICanvasComponent[]
		}

		const removeComponentById = (
			components: ICanvasComponent[],
			idToRemove: string
		): ICanvasComponent[] => {
			return components
				.map(component => {
					if (component.id === idToRemove) {
						return null
					}

					if (component.children && component.children.length > 0) {
						component.children = removeComponentById(
							component.children,
							idToRemove
						)
					}

					return component
				})
				.filter(Boolean) as ICanvasComponent[]
		}

		if (isHint) {
			setCanvasComponents(prevComponents => removeHintComponent(prevComponents))
		} else {
			setCanvasComponents(prevComponents =>
				removeComponentById(prevComponents, id!)
			)
			setCanvasComponentsArr(prev => prev.filter(el => el.id !== id))
		}
	}

	const handleEditComponent = (id: string) => {
		setEditingComponentId(id)
	}

	const handleUpdateStyle = (id: string, updatedStyle: React.CSSProperties) => {
		const updateComponentStyle = (
			components: ICanvasComponent[]
		): ICanvasComponent[] => {
			return components.map(component => {
				if (component.id === id) {
					return {...component, style: {...component.style, ...updatedStyle}}
				}
				if (component.children) {
					return {
						...component,
						children: updateComponentStyle(component.children),
					}
				}
				return component
			})
		}

		setCanvasComponents(prevComponents => updateComponentStyle(prevComponents))
		setCanvasComponentsArr(prev =>
			prev.map(component => {
				if (component.id === id) {
					return {...component, style: {...component.style, ...updatedStyle}}
				}

				return component
			})
		)
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
					ref={canvasRef}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					isEmptyCanvas={!canvasComponents.length}
					isDragging={!!draggingType}
				>
					{canvasComponents.map(component => (
						<RenderCanvasComponent
							key={component.id}
							component={component}
							draggingType={draggingType}
							editingComponentId={editingComponentId}
							setHoveredComponentId={setHoveredComponentId}
							hoveredComponentId={hoveredComponentId}
							onDeleteComponent={handleDeleteComponent}
							onEditComponent={handleEditComponent}
							addComponent={addComponent}
							isHintShowing={isHintShowing}
							setIsHintShowing={setIsHintShowing}
							isResizing={isResizing}
							setIsResizing={setIsResizing}
							onUpdateStyle={handleUpdateStyle}
						/>
					))}
				</Canvas>
				<Sidebar
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					isCanvasEmpty={canvasComponents.length === 0}
					isFirstComponent={canvasComponents?.[0]?.id === editingComponentId}
					editingComponentId={editingComponentId}
					componentStyle={
						canvasComponentsArr.find(c => c.id === editingComponentId)?.style ||
						{}
					}
					onUpdateStyle={handleUpdateStyle}
				/>
			</main>
		</>
	)
}

export default FormCreator
