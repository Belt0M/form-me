import {Export, Eye, File} from '@phosphor-icons/react'
import {html} from 'js-beautify'
import React, {useRef, useState} from 'react'
import {Tooltip} from 'react-tooltip'
import ButtonTypeModal from '../components/creator/ButtonTypeModal'
import Canvas from '../components/creator/Canvas'
import RenderCanvasComponent from '../components/creator/CanvasRenderer'
import InputTypeModal from '../components/creator/InputTypeModal'
import Sidebar from '../components/creator/Sidebar'
import ExportModal from '../components/ExportModal'
import Header from '../components/Header'
import PreviewModal from '../components/PreviewModal'
import {useClickOutside} from '../hooks/useClickOutside'
import {EHTMLTag} from '../types/EHTMLTag'
import {EPosition} from '../types/EPosition'
import {ICanvasComponent} from '../types/ICanvasComponent'
import {generateColor} from '../utils/generateColor'
import {generateJSX} from '../utils/generateJSX'
import {getComponentsQuantity} from '../utils/getComponentsQuantity'
import {getDefaultComponentHeight} from '../utils/getDefaultComponentHeight'
import {getDefaultComponentWidth} from '../utils/getDefaultComponentWidth'
import {getIsBlockComponentByType} from '../utils/getIsBlockComponentByType'
import {getIsContainContent} from '../utils/getIsContainContent'
// import {
//   useAddFormMutation,
//   useGetFormByIdQuery,
//   useUpdateFormMutation,
// } from '../store/forms.api';

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
	const [isModalOpen, setIsModalOpen] = useState<{
		input: boolean
		button: boolean
		preview: boolean
		export: boolean
	}>({export: false, input: false, button: false, preview: false})
	const [exportedCode, setExportedCode] = useState<string>('')

	const canvasRef = useRef<HTMLDivElement>(null)

	useClickOutside(canvasRef, editingComponentId, setEditingComponentId)

	const defaultStyles: React.CSSProperties = {
		position: 'relative',
		padding: '8px',
	}

	const handleDragStart = (type: EHTMLTag, position: EPosition) => {
		setDraggingType(type)
		setDraggedComponentType(type)
		setPositionMode(position)
	}

	const handleDragEnd = () => {
		draggingType !== EHTMLTag.INPUT &&
			draggingType !== EHTMLTag.BUTTON &&
			setDraggingType(null)
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

	const handleDrop = (
		inputType?: string | null,
		buttonType?: 'button' | 'submit' | null
	) => {
		handleDeleteComponent()

		if (draggedComponentType === EHTMLTag.INPUT && !inputType) {
			setIsModalOpen({
				export: false,
				input: true,
				button: false,
				preview: false,
			})
			return
		}

		if (draggedComponentType === EHTMLTag.BUTTON && !buttonType) {
			setIsModalOpen({
				export: false,
				input: false,
				button: true,
				preview: false,
			})
			return
		}

		if (draggedComponentType === null) return
		if (canvasComponents.length && !hoveredComponentId) return

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
				const width = getDefaultComponentWidth(
					draggedComponentType,
					hoveredComponentId
				)
				const height = getDefaultComponentHeight(
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

					if (buttonType) {
						newComponent.style!.buttonType = buttonType
						newComponent.content = buttonType === 'button' ? 'Button' : 'Submit'
					}
				} else {
					if (inputType) {
						newComponent.style!.inputType = inputType
					}
				}

				newComponent.style!.borderRadius = '6px'
				newComponent.style!.borderColor = '#ffffff'
			}

			newComponent.style!.backgroundColor = backgroundColor
			newComponent.style!.borderWidth = '2px'
		}

		if (
			draggingType === EHTMLTag.BUTTON ||
			draggingType === EHTMLTag.INPUT ||
			draggingType === EHTMLTag.HEADING
		) {
			newComponent.style!.fontSize = '12.8px'
		}

		const hasContent = getIsContainContent(draggedComponentType)

		if (hasContent) {
			if (draggingType === EHTMLTag.HEADING) {
				newComponent.content = 'Heading'
				newComponent.level = 6
			} else if (draggingType === EHTMLTag.BUTTON) {
				newComponent.content = buttonType === 'button' ? 'Button' : 'Submit'
			}
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

		if (inputType || buttonType) {
			setIsModalOpen({
				export: false,
				input: false,
				preview: false,
				button: false,
			})
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

	const handleUpdateComponentProperty = (
		id: string,
		name: string,
		value: string | number
	) => {
		if (name) {
			const updateComponentProperty = (
				components: ICanvasComponent[]
			): ICanvasComponent[] => {
				return components.map(component => {
					if (component.id === id) {
						return {...component, [name]: value}
					}
					if (component.children) {
						return {
							...component,
							children: updateComponentProperty(component.children),
						}
					}
					return component
				})
			}

			setCanvasComponents(prevComponents =>
				updateComponentProperty(prevComponents)
			)
		}
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
			setIsModalOpen({
				export: true,
				input: false,
				preview: false,
				button: false,
			})
		} catch (error) {
			console.error('Error formatting code:', error)
		}
	}

	const handlePreview = () => {
		const exportedCode = exportFormAsJSX(canvasComponents)

		setExportedCode(exportedCode)
		setIsModalOpen({
			export: false,
			input: false,
			preview: true,
			button: false,
		})
	}

	const handleCloseModal = () => {
		setIsModalOpen({
			export: false,
			input: false,
			preview: false,
			button: false,
		})
	}

	const hasInput = (components: ICanvasComponent[]): boolean => {
		return components.some(
			component =>
				(!component.isHint && component.type === EHTMLTag.INPUT) ||
				(component.children && hasInput(component.children))
		)
	}

	const hasSubmitButton = (components: ICanvasComponent[]): boolean => {
		return components.some(
			component =>
				(!component.isHint &&
					component.type === EHTMLTag.BUTTON &&
					component.style?.buttonType === 'submit') ||
				(component.children && hasSubmitButton(component.children))
		)
	}

	const buttonsStyle =
		'px-4 pt-2.5 pb-[0.525rem] border-2 transition-all disabled:border-stone-500 disabled:cursor-not-allowed rounded-lg disabled:text-stone-400 hover:enabled:bg-opacity-20'

	const hasInputElement = hasInput(canvasComponents)
	const hasSubmitButtonElement = hasSubmitButton(canvasComponents)

	const allRequirementsMet = hasInputElement && hasSubmitButtonElement

	return (
		<>
			<Header
				hasInput={hasInputElement}
				hasSubmitButton={hasSubmitButtonElement}
				actions={
					<>
						<button
							className={
								buttonsStyle +
								' border-violet-800 text-violet-800 hover:enabled:bg-violet-800'
							}
							type='button'
							onClick={handlePreview}
							disabled={!allRequirementsMet}
							id='preview'
						>
							<Eye weight='bold' size={16} />
						</button>
						<button
							className={
								buttonsStyle +
								' border-purple-800 text-purple-800 hover:enabled:bg-purple-800'
							}
							type='button'
							// onClick={handleSave}
							disabled={!allRequirementsMet}
							id='save'
						>
							<File weight='bold' className='mb-[0.1rem]' size={16} />
						</button>
						<button
							className={
								buttonsStyle +
								' border-fuchsia-800 text-fuchsia-800 hover:enabled:bg-fuchsia-800'
							}
							type='button'
							onClick={handleExport}
							disabled={!allRequirementsMet}
							id='export'
						>
							<Export weight='bold' className='mb-[0.1rem]' size={16} />
						</button>
						<Tooltip anchorSelect='#preview' place='top'>
							Preview
						</Tooltip>
						<Tooltip anchorSelect='#save' place='top'>
							Save
						</Tooltip>
						<Tooltip anchorSelect='#export' place='top'>
							Export
						</Tooltip>
					</>
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
					onUpdateProperty={handleUpdateComponentProperty}
				/>
				{isModalOpen.input && (
					<InputTypeModal
						onSelectType={handleDrop}
						onClose={handleCloseModal}
					/>
				)}
				{isModalOpen.export && (
					<ExportModal onClose={handleCloseModal} exportedCode={exportedCode} />
				)}
				{isModalOpen.preview && (
					<PreviewModal
						onClose={handleCloseModal}
						exportedCode={exportedCode}
					/>
				)}
				{isModalOpen.button && (
					<ButtonTypeModal
						onSelectType={handleDrop}
						onClose={handleCloseModal}
					/>
				)}
			</main>
		</>
	)
}

export default FormCreator
