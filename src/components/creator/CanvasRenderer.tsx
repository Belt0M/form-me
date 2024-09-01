import React, {useEffect, useRef, useState} from 'react'
import {EHTMLTag} from '../../types/EHTMLTag'
import {EPosition} from '../../types/EPosition'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import Div from '../creator/dnd-components/Div'
import Section from '../creator/dnd-components/Section'
import Button from './dnd-components/Button'
import Heading from './dnd-components/Heading'
import Input from './dnd-components/Input'

interface Props {
	component: ICanvasComponent
	hoveredComponentId: string | null
	draggingType: EHTMLTag | null
	isHintShowing: boolean
	editingComponentId: string | null
	canvasComponents: ICanvasComponent[]
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

const RenderCanvasComponent: React.FC<Props> = ({
	component,
	hoveredComponentId,
	draggingType,
	isHintShowing,
	editingComponentId,
	isResizing,
	canvasComponents,
	onUpdateStyle,
	setHoveredComponentId,
	onDeleteComponent,
	onEditComponent,
	addComponent,
	setIsHintShowing,
	setIsResizing,
}) => {
	const {id, type, style, children, isHint, content, level} = component
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

	const handleDragEnter = (
		event: React.DragEvent<HTMLDivElement | HTMLButtonElement>
	) => {
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

	const handleDragLeave = (
		event: React.DragEvent<HTMLDivElement | HTMLButtonElement>
	) => {
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

	const handleMouseEnter = (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
	) => {
		event.preventDefault()

		setHoveredComponentId(id)
		setIsHovering(true)
	}

	const handleMouseLeave = (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
	) => {
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
			{isCurrentInFocus && editingComponentId !== id && (
				<div
					className='absolute px-2 pt-[0.3rem] pb-0.5 text-xs font-bold bg-white rounded select-none bottom-1 right-1 text-primary'
					aria-disabled={true}
				>
					{type}
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
						canvasComponents={canvasComponents}
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
						onUpdateStyle={onUpdateStyle}
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
						editingComponentId={editingComponentId}
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
		case EHTMLTag.HEADING:
			if (isHint) {
				renderedComponent = (
					<Heading level={level || 6} id={id} isHint={!!isHint} />
				)
			} else {
				renderedComponent = (
					<Heading
						id={id}
						level={level || 6}
						content={content}
						style={computedStyle}
						editingComponentId={editingComponentId}
						isCurrentInFocus={isCurrentInFocus}
						isResizing={isResizing}
						isHint={isHint}
						onHoverGUI={onHoverGUI}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onEditComponent={handleEdit}
					/>
				)
			}
			break
		case EHTMLTag.BUTTON:
			if (isHint) {
				renderedComponent = <Button id={id} isHint={!!isHint} />
			} else {
				renderedComponent = (
					<Button
						id={id}
						type={style?.buttonType || 'button'}
						style={computedStyle}
						content={content}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onMouseEnter={handleMouseEnter}
						onEditComponent={onEditComponent}
						onMouseLeave={handleMouseLeave}
						onHoverGUI={onHoverGUI}
						editingComponentId={editingComponentId}
						isCurrentInFocus={isCurrentInFocus}
						isResizing={isResizing}
					/>
				)
			}
			break
		case EHTMLTag.INPUT:
			if (isHint) {
				renderedComponent = (
					<Input id={id} type={style?.inputType || 'text'} isHint={!!isHint} />
				)
			} else {
				renderedComponent = (
					<Input
						id={id}
						style={computedStyle}
						type={style?.inputType || 'text'}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onEditComponent={handleEdit}
						editingComponentId={editingComponentId}
						isCurrentInFocus={isCurrentInFocus}
						onUpdateStyle={onUpdateStyle}
						setIsResizing={setIsResizing}
						isResizing={isResizing}
						onHoverGUI={onHoverGUI}
					/>
				)
			}
			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
