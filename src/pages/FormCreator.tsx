import {Export, Eye, File} from '@phosphor-icons/react'
import {html} from 'js-beautify'
import React, {useEffect, useRef, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {Bounce, toast, ToastContainer} from 'react-toastify'
import {Tooltip} from 'react-tooltip'
import Canvas from '../components/creator/Canvas'
import RenderCanvasComponent from '../components/creator/CanvasRenderer'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'
import ButtonTypeModal from '../components/modals/ButtonTypeModal'
import ExportModal from '../components/modals/ExportModal'
import ImageModal from '../components/modals/ImageModal'
import InputTypeModal from '../components/modals/InputTypeModal'
import PreviewModal from '../components/modals/PreviewModal'
import {useClickOutside} from '../hooks/useClickOutside'
import {useUpdateFormMutation} from '../store/forms.api'
import {EHTMLTag} from '../types/EHTMLTag'
import {EPosition} from '../types/EPosition'
import {ICanvasComponent} from '../types/ICanvasComponent'
import {generateColor} from '../utils/generateColor'
import {generateJSXAsComponent} from '../utils/generateJSXAsComponent'
import {generateSimpleJSX} from '../utils/generateSimpleJSX'
import {getComponentById} from '../utils/getComponentByID'
import {getComponentsQuantity} from '../utils/getComponentsQuantity'
import {getDefaultComponentHeight} from '../utils/getDefaultComponentHeight'
import {getDefaultComponentWidth} from '../utils/getDefaultComponentWidth'
import {getHintComponent} from '../utils/getHintComponent'
import {getIsBlockComponentByType} from '../utils/getIsBlockComponentByType'
import {getIsComponentWithChildren} from '../utils/getIsComponentWithChildren'
import {getIsContainContent} from '../utils/getIsContainContent'

const FormCreator: React.FC = () => {
	const [updateForm, {isSuccess: isUpdateSuccess, isError: isUpdateError}] =
		useUpdateFormMutation()
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
	const [isHintShowing, setIsHintShowing] = useState<string | null>(null)
	const [isResizing, setIsResizing] = useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = useState<{
		input: boolean
		button: boolean
		preview: boolean
		export: boolean
		image: boolean
	}>({export: false, input: false, button: false, preview: false, image: false})
	const [exportedCode, setExportedCode] = useState<string>('')
	const [initialCanvasComponents, setInitialCanvasComponents] = useState<
		ICanvasComponent[]
	>([])

	const location = useLocation()
	const formId = location.pathname.split('/').pop() as string

	const canvasRef = useRef<HTMLDivElement>(null)

	useClickOutside(canvasRef, editingComponentId, setEditingComponentId)

	const defaultStyles: React.CSSProperties = {
		position: 'relative',
		padding: '8px',
	}

	useEffect(() => {
		const initialContent = location.state?.content

		if (initialContent) {
			setCanvasComponents(initialContent)
			setInitialCanvasComponents(initialContent)
		}
	}, [location.state])

	useEffect(() => {
		if (isUpdateSuccess || isUpdateError) {
			if (isUpdateSuccess) {
				setInitialCanvasComponents(canvasComponents)
			}

			const text = isUpdateSuccess
				? 'The form was successfully updated'
				: 'The form could not be updated'

			toast(text, {
				position: 'top-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				type: isUpdateSuccess ? 'success' : 'error',
				style: {padding: '0.5rem'},
				draggable: true,
				progress: undefined,
				theme: 'dark',
				transition: Bounce,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isUpdateSuccess, isUpdateError])

	const handleDragStart = (type: EHTMLTag, position: EPosition) => {
		setDraggedComponentType(type)
		setPositionMode(position)
	}

	const handleDragEnd = () => {
		draggedComponentType !== EHTMLTag.INPUT &&
			draggedComponentType !== EHTMLTag.BUTTON &&
			draggedComponentType !== EHTMLTag.IMG &&
			setDraggedComponentType(null)
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
		buttonType?: 'button' | 'submit' | null,
		imageUrl?: string | null
	) => {
		const hintComponent = getHintComponent(canvasComponents)
		const isError = hintComponent?.isErrorHint

		handleDeleteComponent()

		if (isError) {
			toast('The component cannot be placed here', {
				position: 'top-center',
				autoClose: 2000,
				type: 'error',
				style: {padding: '0.5rem'},
				theme: 'dark',
				transition: Bounce,
			})
			toast(
				'P.S. For absolute positioning, select "position: absolute" from the side menu above components',
				{
					position: 'top-center',
					delay: 1000,
					autoClose: 2500,
					type: 'warning',
					style: {padding: '0.5rem'},
					theme: 'dark',
					transition: Bounce,
				}
			)
			return
		}

		if (!hoveredComponentId && canvasComponents.length) {
			toast('When dropping a new component, the parent should be highlighted', {
				position: 'top-center',
				autoClose: 2000,
				type: 'error',
				style: {padding: '0.5rem'},
				theme: 'dark',
				transition: Bounce,
			})
			toast('P.S. keep an eye on whether the hint component has appeared', {
				position: 'top-center',
				delay: 1500,
				autoClose: 2500,
				type: 'warning',
				style: {padding: '0.5rem'},
				theme: 'dark',
				transition: Bounce,
			})
			return
		}

		if (hoveredComponentId) {
			const hoveredComponent = getComponentById(
				canvasComponents,
				hoveredComponentId
			)

			const type = hoveredComponent?.type
			const isComponentWithoutChildren =
				type && !getIsComponentWithChildren(type)

			if (isComponentWithoutChildren) {
				toast('The existing component does not support nesting', {
					position: 'top-center',
					autoClose: 2000,
					type: 'error',
					style: {padding: '0.5rem'},
					theme: 'dark',
					transition: Bounce,
				})
				return
			}
		}

		if (draggedComponentType === EHTMLTag.IMG && !imageUrl) {
			setIsModalOpen({
				export: false,
				input: false,
				button: false,
				preview: false,
				image: true,
			})
			return
		}

		if (draggedComponentType === EHTMLTag.INPUT && !inputType) {
			setIsModalOpen({
				export: false,
				input: true,
				button: false,
				preview: false,
				image: false,
			})
			return
		}

		if (draggedComponentType === EHTMLTag.BUTTON && !buttonType) {
			setIsModalOpen({
				export: false,
				input: false,
				button: true,
				preview: false,
				image: false,
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

		if (draggedComponentType === EHTMLTag.IMG) {
			newComponent!.src = imageUrl || ''
		}

		if (isBlock) {
			const backgroundColor = generateColor(
				getComponentsQuantity(canvasComponents) + 1
			)

			if (draggedComponentType !== EHTMLTag.BUTTON) {
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

			if (
				draggedComponentType === EHTMLTag.BUTTON ||
				draggedComponentType === EHTMLTag.INPUT
			) {
				if (draggedComponentType === EHTMLTag.BUTTON) {
					newComponent.style!.padding = '12px 25px 9px 25px'

					if (buttonType) {
						newComponent.style!.buttonType = buttonType
						newComponent.content = buttonType === 'button' ? 'Button' : 'Submit'
					}
				} else {
					if (inputType) {
						newComponent.style!.inputType = inputType
						newComponent.style!.display = 'block'
					}
				}

				newComponent.style!.borderRadius = '6px'
				newComponent.style!.borderColor = '#ffffff'
			}

			newComponent.style!.backgroundColor = backgroundColor
			newComponent.style!.borderWidth = '2px'
		}

		if (draggedComponentType === EHTMLTag.IMG) {
			newComponent.style!.padding = ''
			newComponent.style!.borderWidth = ''
		}

		if (
			draggedComponentType === EHTMLTag.BUTTON ||
			draggedComponentType === EHTMLTag.INPUT ||
			draggedComponentType === EHTMLTag.HEADING
		) {
			newComponent.style!.fontSize = '12.8px'
		}

		const hasContent = getIsContainContent(draggedComponentType)

		if (hasContent) {
			if (draggedComponentType === EHTMLTag.HEADING) {
				newComponent.content = 'Heading'
				newComponent.level = 6
			} else if (draggedComponentType === EHTMLTag.BUTTON) {
				newComponent.content = buttonType === 'button' ? 'Button' : 'Submit'
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
				image: false,
			})
		}
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleExitEditMode = () => {
		setEditingComponentId(null)
	}

	const handleDeleteComponent = (id?: string) => {
		const isHint = !id

		if (!isHint) {
			setHoveredComponentId(null)
			setEditingComponentId(null)
		} else {
			setIsHintShowing(null)
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

	const exportFormAsJSX = (components: ICanvasComponent[]): string => {
		return components.map(component => generateSimpleJSX(component)).join('\n')
	}

	const exportFormAsJSXAsComponent = (
		components: ICanvasComponent[]
	): string => {
		return components
			.map(component => generateJSXAsComponent(component))
			.join('\n')
	}

	const handleExport = () => {
		let exportedCode = exportFormAsJSXAsComponent(canvasComponents)

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
				image: false,
			})
		} catch (error) {
			console.error('Error formatting code:', error)
		}
	}

	const handleSave = async () => {
		const content = JSON.stringify(canvasComponents)

		await updateForm({id: formId, content}).unwrap()
	}

	const handlePreview = () => {
		const exportedCode = exportFormAsJSX(canvasComponents)

		setExportedCode(exportedCode)
		setIsModalOpen({
			export: false,
			input: false,
			preview: true,
			button: false,
			image: false,
		})
	}

	const handleCloseModal = () => {
		setIsModalOpen({
			export: false,
			input: false,
			preview: false,
			button: false,
			image: false,
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

	const isContentChanged = (
		initialComponents: ICanvasComponent[],
		currentComponents: ICanvasComponent[]
	): boolean => {
		if (initialComponents.length !== currentComponents.length) return true

		for (let i = 0; i < initialComponents.length; i++) {
			const initialComponent = initialComponents[i]
			const currentComponent = currentComponents[i]

			if (
				initialComponent.type !== currentComponent.type ||
				JSON.stringify(initialComponent.style) !==
					JSON.stringify(currentComponent.style) ||
				initialComponent.content !== currentComponent.content
			) {
				return true
			}

			if (initialComponent.children && currentComponent.children) {
				const areChildrenChanged = isContentChanged(
					initialComponent.children,
					currentComponent.children
				)
				if (areChildrenChanged) return true
			} else if (initialComponent.children || currentComponent.children) {
				return true
			}
		}

		return false
	}

	const buttonsStyle =
		'px-4 pt-2.5 pb-[0.525rem] border-2 transition-all disabled:border-stone-500 disabled:cursor-not-allowed rounded-lg disabled:text-stone-400 hover:enabled:bg-opacity-20'

	const hasInputElement = hasInput(canvasComponents)
	const hasSubmitButtonElement = hasSubmitButton(canvasComponents)

	const allRequirementsMet = hasInputElement && hasSubmitButtonElement
	const hasContentChanged = isContentChanged(
		initialCanvasComponents,
		canvasComponents
	)

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
							disabled={!canvasComponents.length}
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
							onClick={handleSave}
							disabled={!hasContentChanged}
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

			<main className='flex h-[calc(100vh-81.6px)] overflow-hidden'>
				<Canvas
					ref={canvasRef}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					editingComponentId={editingComponentId}
					onDeleteComponent={handleDeleteComponent}
					isEmptyCanvas={!canvasComponents.length}
					isDragging={!!draggedComponentType}
				>
					{canvasComponents.map(component => (
						<RenderCanvasComponent
							key={component.id}
							component={component}
							draggingType={draggedComponentType}
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
					onExitEditMode={handleExitEditMode}
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
						hasSubmit={hasSubmitButtonElement}
					/>
				)}
				{isModalOpen.image && (
					<ImageModal
						onSelectUrl={url => handleDrop(undefined, undefined, url)}
						onClose={handleCloseModal}
					/>
				)}
				<ToastContainer
					position='top-center'
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='dark'
					transition={Bounce}
				/>
			</main>
		</>
	)
}

export default FormCreator
