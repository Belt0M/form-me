import {Trash} from '@phosphor-icons/react'
import React, {useEffect, useRef, useState} from 'react'
import {EHTMLTag} from '../../types/EHTMLTag'
import {EPosition} from '../../types/EPosition'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import Div from '../creator/dnd-components/Div'
import Section from '../creator/dnd-components/Section'

interface CanvasComponentProps {
	component: ICanvasComponent
	hoveredComponentId: string | null
	draggingType: EHTMLTag | null
	isHintShowing: boolean
	editingComponentId: string | null
	isResizing?: boolean
	onUpdateStyle: (id: string, updatedStyle: React.CSSProperties) => void
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	setHoveredComponentId: (id: string | null) => void
	onDeleteComponent: (id?: string) => void
	onEditComponent: (id: string) => void
	addComponent: (
		parentId: string | null,
		newComponent: ICanvasComponent,
		isHint?: boolean
	) => void
	setIsHintShowing: React.Dispatch<React.SetStateAction<boolean>>
}

const RenderCanvasComponent: React.FC<CanvasComponentProps> = ({
	component,
	hoveredComponentId,
	draggingType,
	isHintShowing,
	editingComponentId,
	isResizing,
	onUpdateStyle,
	setHoveredComponentId,
	onDeleteComponent,
	onEditComponent,
	addComponent,
	setIsHintShowing,
	setIsResizing,
}) => {
	const {id, type, style, children, isHint} = component
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [isHovering, setIsHovering] = useState<boolean>(false)

	const createHintComponent = (hoveredID: string) => {
		if (hoveredID) {
			const id = crypto.randomUUID()
			const newComponent: ICanvasComponent = {
				id,
				type: draggingType!,
				style: {position: EPosition.RELATIVE, visibility: 'hidden'},
				children: [],
				isHint: true,
			}

			addComponent(hoveredID, newComponent, true)
		}
	}

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.currentTarget.contains(event.relatedTarget as Node)) {
			return
		}

		const relatedElement = event.relatedTarget as HTMLElement | null
		const targetElement = event.target as HTMLElement | null
		const isEnterFromAnotherComponent =
			targetElement?.getAttribute('aria-atomic') &&
			relatedElement?.getAttribute('aria-atomic')

		setHoveredComponentId(id)

		if (draggingType) {
			if (!isEnterFromAnotherComponent) {
				setIsHintShowing(true)
				createHintComponent(id)
			}
		}
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const targetElement = event.target as HTMLElement | null
		const isTargetComponentType = targetElement?.getAttribute('aria-atomic')

		if (isTargetComponentType) {
			const relatedElement = event.relatedTarget as HTMLElement | null
			const isLeaveOnNextComponent =
				targetElement?.getAttribute('aria-atomic') &&
				relatedElement?.getAttribute('aria-atomic')

			if (!relatedElement?.getAttribute('aria-disabled') && isHintShowing) {
				onDeleteComponent()

				setIsHintShowing(false)
			}

			if (isLeaveOnNextComponent) {
				createHintComponent(relatedElement!.id)

				setIsHintShowing(true)
			}

			if (event.currentTarget.contains(event.relatedTarget as Node)) {
				return
			}

			if (relatedElement && relatedElement.getAttribute('aria-atomic')) {
				setHoveredComponentId(relatedElement.id)
			} else {
				setHoveredComponentId(null)
			}
		}
	}

	const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()

		setHoveredComponentId(id)
		setIsHovering(true)
	}

	const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const relatedTarget = event.relatedTarget as HTMLElement | null

		if (relatedTarget && relatedTarget.getAttribute?.('aria-atomic')) {
			setHoveredComponentId(relatedTarget.id)
		} else {
			setIsHovering(false)
			setHoveredComponentId(null)
		}
	}

	const handleDelete = () => {
		onDeleteComponent(id)
	}

	const handleEdit = (editID: string) => {
		onEditComponent(editID)
	}

	const handleResize = (e: MouseEvent, direction: string) => {
		if (!containerRef.current) return

		const container = containerRef.current
		const rect = container.getBoundingClientRect()

		const newStyle: React.CSSProperties = {}

		if (direction.includes('right')) {
			newStyle.width = `${e.clientX - rect.left}px`
		}
		if (direction.includes('bottom')) {
			newStyle.height = `${e.clientY - rect.top}px`
		}

		Object.assign(container.style, newStyle)
	}

	const handleMouseUp = () => {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	const handleMouseMove = (e: MouseEvent) => {
		const direction = containerRef.current?.dataset.direction || ''
		handleResize(e, direction)
	}

	const startResizing = (direction: string) => {
		if (containerRef.current) {
			containerRef.current.dataset.direction = direction
		}
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	useEffect(() => {
		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	let renderedComponent
	const isCurrentInFocus = component.id === hoveredComponentId
	const isCurrentHovered = isHovering && isCurrentInFocus
	// const hoveredOutline =
	// 	'before:absolute before:inset-0 before:left-0 before:top-0 border-yellow-400 border-2 border-dashed'
	const computedStyle = {
		...style,
		position: style?.position,
	}

	if (style?.position === 'relative') {
		delete computedStyle.left
		delete computedStyle.top
	}

	const onHoverGUI = (
		<>
			{isCurrentInFocus && !editingComponentId && (
				<div
					className='absolute px-2 py-1 text-xs font-bold bg-white rounded select-none bottom-1 right-1 text-primary'
					aria-disabled={true}
				>
					{type}
				</div>
			)}

			{isCurrentHovered && (
				<div
					className='absolute flex gap-2 px-3 py-2 rounded top-3 right-3 bg-dark bg-opacity-40 z-[100]'
					aria-disabled={true}
				>
					<Trash
						className='text-red-500 transition-all cursor-pointer hover:scale-105'
						weight='bold'
						size={25}
						onClick={handleDelete}
					/>
				</div>
			)}
		</>
	)

	const renderChildren = () => {
		return children?.length ? (
			<React.Fragment>
				{children.map(child => (
					<RenderCanvasComponent
						key={child.id}
						component={child}
						setHoveredComponentId={setHoveredComponentId}
						editingComponentId={editingComponentId}
						hoveredComponentId={hoveredComponentId}
						onDeleteComponent={onDeleteComponent}
						onEditComponent={onEditComponent}
						draggingType={draggingType}
						addComponent={addComponent}
						isHintShowing={isHintShowing}
						setIsHintShowing={setIsHintShowing}
						isResizing={isResizing}
						setIsResizing={setIsResizing}
						onUpdateStyle={onUpdateStyle}
					/>
				))}
			</React.Fragment>
		) : (
			<React.Fragment />
		)
	}

	const resizeHandles = (
		<>
			<div
				onMouseDown={() => startResizing('right')}
				className='absolute top-0 right-0 w-2 h-full cursor-e-resize'
				style={{zIndex: 10}}
			/>
			<div
				onMouseDown={() => startResizing('bottom')}
				className='absolute bottom-0 left-0 w-full h-2 cursor-s-resize'
				style={{zIndex: 10}}
			/>
			<div
				onMouseDown={() => startResizing('bottom-right')}
				className='absolute bottom-0 right-0 w-4 h-4 bg-gray-500 cursor-se-resize'
				style={{zIndex: 10}}
			/>
		</>
	)

	switch (type) {
		case EHTMLTag.SECTION:
			if (isHint) {
				renderedComponent = (
					<Section id={id} isHint={!!isHint}>
						{renderChildren()}
					</Section>
				)
			} else {
				renderedComponent = (
					<Section
						id={id}
						style={computedStyle}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						isEditing={editingComponentId === id}
						onEditComponent={handleEdit}
						onHoverGUI={onHoverGUI}
						isCurrentHovered={isCurrentHovered}
						isCurrentInFocus={isCurrentInFocus}
						isResizing={isResizing}
						setIsResizing={setIsResizing}
					>
						{renderChildren()}
					</Section>
				)
			}

			break
		case EHTMLTag.DIV:
			if (isHint) {
				renderedComponent = (
					<Div id={id} isHint={!!isHint}>
						{renderChildren()}
					</Div>
				)
			} else {
				renderedComponent = (
					<Div
						id={id}
						style={computedStyle}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onMouseEnter={handleMouseEnter}
						onEditComponent={onEditComponent}
						onMouseLeave={handleMouseLeave}
						onHoverGUI={onHoverGUI}
						isEditing={editingComponentId === id}
						resizeHandles={resizeHandles}
						isCurrentHovered={isCurrentHovered}
						isCurrentInFocus={isCurrentInFocus}
						isResizing={isResizing}
						setIsResizing={setIsResizing}
						onUpdateStyle={onUpdateStyle}
					>
						{renderChildren()}
					</Div>
				)
			}

			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
