import {Gear, Trash} from '@phosphor-icons/react'
import React, {useEffect, useRef, useState} from 'react'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import Div from '../creator/dnd-components/Div'
import Section from '../creator/dnd-components/Section'

interface CanvasComponentProps {
	component: ICanvasComponent
	setHoveredComponentId: (id: string | null) => void
	onDeleteComponent: (id: string) => void
	onEditComponent: (id: string) => void
	activeTab: 'components' | 'parameters'
}

const RenderCanvasComponent: React.FC<CanvasComponentProps> = ({
	component,
	setHoveredComponentId,
	onDeleteComponent,
	onEditComponent,
	activeTab,
}) => {
	const {id, type, style, children} = component
	const [isHovered, setIsHovered] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		setHoveredComponentId(id)
		setIsHovered(true)
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		setHoveredComponentId(null)
		setIsHovered(false)
	}

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
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
	}, [])

	let renderedComponent
	const computedStyle = {
		...style,
		border: isHovered ? '2px dashed #4A4A4A' : undefined,
		position: style?.position,
	}

	if (style?.position === 'relative') {
		delete computedStyle.left
		delete computedStyle.top
		computedStyle.width = '100%'
	}

	const renderChildren = () => {
		return children?.length ? (
			<React.Fragment>
				{children.map(child => (
					<RenderCanvasComponent
						key={child.id}
						component={child}
						setHoveredComponentId={setHoveredComponentId}
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

	const iconClass =
		'absolute top-2 right-2 flex gap-2 py-2 px-3 bg-dark rounded bg-opacity-40'

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
		case 'section':
			renderedComponent = (
				<div
					ref={containerRef}
					className='relative w-full h-full'
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Section style={{width: '100%', height: '100%'}}>
						{renderChildren()}
					</Section>
					{isHovered && activeTab !== 'parameters' && (
						<>
							<div className='absolute px-2 py-1 text-xs font-bold bg-white rounded bottom-1 right-1 text-primary'>
								{type}
							</div>
							<div className={iconClass}>
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
						</>
					)}
					{resizeHandles}
				</div>
			)
			break
		case 'div':
			renderedComponent = (
				<div
					ref={containerRef}
					className='relative w-full h-full'
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Div style={{width: '100%', height: '100%'}}>{renderChildren()}</Div>
					{isHovered && activeTab !== 'parameters' && (
						<>
							<div className='absolute px-2 py-1 text-xs font-bold bg-white rounded bottom-1 right-1 text-primary'>
								{type}
							</div>
							<div className={iconClass}>
								<Gear
									className='cursor-pointer'
									size={20}
									onClick={handleEdit}
								/>
								<Trash
									className='cursor-pointer'
									size={20}
									onClick={handleDelete}
								/>
							</div>
						</>
					)}
					{resizeHandles}
				</div>
			)
			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
