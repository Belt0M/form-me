import {Gear, Trash} from '@phosphor-icons/react'
import clsx from 'clsx'
import React, {useEffect, useRef, useState} from 'react'
import {EHTMLTag} from '../../types/EHTMLTag'
import {ETabs} from '../../types/ETabs'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import Div from '../creator/dnd-components/Div'
import Section from '../creator/dnd-components/Section'

interface CanvasComponentProps {
	component: ICanvasComponent
	setHoveredComponentId: (id: string | null) => void
	hoveredComponentId: string | null
	onDeleteComponent: (id: string) => void
	onEditComponent: (id: string) => void
	activeTab: ETabs
}

const RenderCanvasComponent: React.FC<CanvasComponentProps> = ({
	component,
	setHoveredComponentId,
	hoveredComponentId,
	onDeleteComponent,
	onEditComponent,
	activeTab,
}) => {
	const {id, type, style, children} = component
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [isHovering, setIsHovering] = useState<boolean>(false)

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.currentTarget.contains(event.relatedTarget as Node)) {
			return
		}

		console.log(id)

		setHoveredComponentId(id)
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.currentTarget.contains(event.relatedTarget as Node)) {
			return
		}

		const relatedTarget = event.relatedTarget as HTMLElement | null

		console.log(relatedTarget)

		if (relatedTarget && relatedTarget.getAttribute('aria-atomic')) {
			setHoveredComponentId(relatedTarget.id)
		} else {
			setHoveredComponentId(null)
		}
	}

	const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		setIsHovering(true)
		setHoveredComponentId(id)
	}

	const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const relatedTarget = event.relatedTarget as HTMLElement | null

		if (relatedTarget && relatedTarget.getAttribute('aria-atomic')) {
			setHoveredComponentId(relatedTarget.id)
		} else {
			setIsHovering(false)
			setHoveredComponentId(null)
		}
	}

	const handleDelete = () => {
		onDeleteComponent(id)
	}

	const handleEdit = () => {
		onEditComponent(id)
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
	const hoveredOutline =
		'before:absolute before:inset-0 before:left-0 before:top-0 before:z-50 border-yellow-400 border-2 border-dashed'
	const computedStyle = {
		...style,
		position: style?.position,
	}

	if (style?.position === 'relative') {
		delete computedStyle.left
		delete computedStyle.top
		computedStyle.width = '100%'
	}

	const onHoverGUI = (
		<>
			{isCurrentInFocus && (
				<div className='absolute px-2 py-1 text-xs font-bold bg-white rounded bottom-1 right-1 text-primary'>
					{type}
				</div>
			)}

			{isCurrentHovered && (
				<div className='absolute flex gap-2 px-3 py-2 rounded top-2 right-2 bg-dark bg-opacity-40 z-[100]'>
					<Gear
						className='text-yellow-500 transition-all cursor-pointer hover:scale-105'
						weight='bold'
						size={25}
						onClick={handleEdit}
					/>
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
						hoveredComponentId={hoveredComponentId}
						onDeleteComponent={onDeleteComponent}
						onEditComponent={onEditComponent}
						activeTab={activeTab}
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
			renderedComponent = (
				<div
					ref={containerRef}
					className={clsx(
						isCurrentInFocus && hoveredOutline,
						'relative w-full h-full'
					)}
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Section id={id} style={{width: '100%', height: '100%'}}>
						{renderChildren()}
					</Section>
					{activeTab !== ETabs.PARAMETERS && onHoverGUI}
					{isCurrentHovered && activeTab === ETabs.PARAMETERS && resizeHandles}
				</div>
			)
			break
		case EHTMLTag.DIV:
			renderedComponent = (
				<div
					ref={containerRef}
					className={clsx(
						isCurrentInFocus && hoveredOutline,
						'relative w-full h-full'
					)}
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Div id={id} style={{width: '100%', height: '100%'}}>
						{renderChildren()}
					</Div>
					{isCurrentHovered && activeTab !== ETabs.PARAMETERS && onHoverGUI}
					{isCurrentHovered && activeTab === ETabs.PARAMETERS && resizeHandles}
				</div>
			)
			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
