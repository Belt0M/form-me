import {html} from 'js-beautify'
import React, {useRef, useState} from 'react'
import Canvas from '../components/creator/Canvas'
import RenderCanvasComponent from '../components/creator/CanvasRenderer'
import InputTypeModal from '../components/creator/InputTypeModal'
import Sidebar from '../components/creator/Sidebar'
import ExportModal from '../components/ExportModal'
import Header from '../components/Header'
import {useClickOutside} from '../hooks/useClickOutside'
import {EHTMLTag} from '../types/EHTMLTag'
import {EPosition} from '../types/EPosition'
import {ICanvasComponent} from '../types/ICanvasComponent'
import {generateColor} from '../utils/generateColor'
import {getComponentsQuantity} from '../utils/getComponentsQuantity'
import {getElementHeightWithoutBorderAndPadding} from '../utils/getElementHeightWithoutBorderAndPadding'
import {getElementWidthWithoutBorderAndPadding} from '../utils/getElementWidthWithoutBorderAndPadding'
import {getIsBlockComponentByType} from '../utils/getIsBlockComponentByType'

const FormCreator: React.FC = () => {
	const [canvasComponents, setCanvasComponents] = useState<ICanvasComponent[]>(
		[]
	)
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

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
	const [exportedCode, setExportedCode] = useState<string>('')

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
		draggingType !== EHTMLTag.INPUT && setDraggingType(null)
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

	const handleDrop = (isInputWithType?: boolean) => {
		handleDeleteComponent()

		if (draggedComponentType === EHTMLTag.INPUT && !isInputWithType) {
			setIsModalOpen(true)
			return
		}

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
				case EHTMLTag.HEADING:
					result = 'auto'
					break
				case EHTMLTag.BUTTON:
					result = '40px'
					break
				case EHTMLTag.INPUT:
					result = parentHeight
						? Math.round((40 / parentHeight) * 100) + '%'
						: '40px'
					break
				default:
					break
			}

			return result
		}

		const getWidthByComponentType = (
			type: EHTMLTag,
			parentID: string | null
		) => {
			let parentWidth = null

			if (parentID) {
				const parent = document.getElementById(parentID)

				if (parent) {
					parentWidth = getElementWidthWithoutBorderAndPadding(parent)
				}
			}

			let result = '100%'

			switch (type) {
				case EHTMLTag.HEADING:
					result = 'auto'
					break
				case EHTMLTag.BUTTON:
					result = '100px'
					break
				case EHTMLTag.INPUT:
					result = parentWidth
						? Math.round((200 / parentWidth) * 100) + '%'
						: '200px'
					break
				default:
					break
			}

			return result
		}

		const isBlock = getIsBlockComponentByType(draggedComponentType)

		const id = crypto.randomUUID()
		const newComponent: ICanvasComponent = {
			id,
			type: draggedComponentType,
			style: {
				...defaultStyles,
				position: positionMode,
			},
			children: [],
			isBlock,
		}

		if (isBlock) {
			const backgroundColor = generateColor(
				getComponentsQuantity(canvasComponents) + 1
			)

			if (draggingType !== EHTMLTag.BUTTON) {
				const width = getWidthByComponentType(
					draggedComponentType,
					hoveredComponentId
				)
				const height = getHeightByComponentType(
					draggedComponentType,
					hoveredComponentId
				)

				newComponent.style!.width = width
				newComponent.style!.height = height
				newComponent.style!.borderColor = backgroundColor
			}

			if (draggingType === EHTMLTag.BUTTON || draggingType === EHTMLTag.INPUT) {
				if (draggingType === EHTMLTag.BUTTON) {
					newComponent.style!.padding = '9px 25px 11px 25px'
				}

				newComponent.style!.borderRadius = '6px'
				newComponent.style!.borderColor = '#ffffff'
			}

			newComponent.style!.backgroundColor = backgroundColor
			newComponent.style!.borderWidth = '2px'
		} else {
			newComponent.style!.fontSize = '16px'
		}

		if (draggingType === EHTMLTag.BUTTON || draggingType === EHTMLTag.INPUT) {
			newComponent.style!.fontSize = '16px'
		}

		if (hoveredComponentId) {
			const parent = document.getElementById(hoveredComponentId)

			if (parent) {
				newComponent.parent = parent
			}
		}

		if (hoveredComponentId) {
			addComponent(hoveredComponentId, newComponent)
		} else {
			addComponent(null, newComponent)
		}

		setDraggedComponentType(null)
		setHoveredComponentId(null)

		if (isInputWithType) {
			setIsModalOpen(false)
		}
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleDeleteComponent = (id?: string) => {
		const isHint = !id

		if (!isHint) {
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
	}

	function generateJSX(component: ICanvasComponent): string {
		const {type, style, children} = component

		const styleString = style
			? Object.entries(style)
					.map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
					.join(', ')
			: ''

		let jsxTag = `<${type}`

		if (styleString) {
			jsxTag += ` style={{ ${styleString} }}`
		}

		jsxTag += `>`

		if (children && children.length > 0) {
			jsxTag += children.map(child => generateJSX(child)).join('')
		}

		jsxTag += `</${type}>`

		return jsxTag
	}

	function exportFormAsJSX(components: ICanvasComponent[]): string {
		return components.map(component => generateJSX(component)).join('\n')
	}

	const handleExport = () => {
		let exportedCode = exportFormAsJSX(canvasComponents)

		try {
			exportedCode = html(exportedCode, {
				indent_size: 2,
				preserve_newlines: true,
				max_preserve_newlines: 2,
				end_with_newline: true,
				indent_inner_html: true,
			})

			setExportedCode(exportedCode)
			setIsExportModalOpen(true)
		} catch (error) {
			console.error('Error formatting code:', error)
		}
	}

	return (
		<>
			<Header
				actions={
					<button
						className='px-4 pt-2 pb-[0.55rem] text-white bg-purple-800 rounded hover:enabled::brightness-110 transition-all disabled:bg-stone-500 disabled:cursor-not-allowed'
						type='button'
						onClick={handleExport}
						disabled={!canvasComponents.length}
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
					editingComponentId={editingComponentId}
					onDeleteComponent={handleDeleteComponent}
					isEmptyCanvas={!canvasComponents.length}
					isDragging={!!draggingType}
				>
					{canvasComponents.map(component => (
						<RenderCanvasComponent
							key={component.id}
							component={component}
							draggingType={draggingType}
							editingComponentId={editingComponentId}
							canvasComponents={canvasComponents}
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
					editingComponentId={editingComponentId}
					canvasComponents={canvasComponents}
					onUpdateStyle={handleUpdateStyle}
				/>
				{isModalOpen && (
					<InputTypeModal
						onSelectType={handleDrop}
						onClose={() => setIsModalOpen(false)}
					/>
				)}
				{isExportModalOpen && (
					<ExportModal
						isOpen={isExportModalOpen}
						onClose={() => setIsExportModalOpen(false)}
						exportedCode={exportedCode}
					/>
				)}
			</main>
		</>
	)
}

export default FormCreator
