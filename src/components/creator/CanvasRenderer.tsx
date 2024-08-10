import React, {useState} from 'react'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import Div from '../creator/dnd-components/Div'
import Section from '../creator/dnd-components/Section'

interface CanvasComponentProps {
	component: ICanvasComponent
	setHoveredComponentId: (id: string | null) => void
}

const RenderCanvasComponent: React.FC<CanvasComponentProps> = ({
	component,
	setHoveredComponentId,
}) => {
	const {id, type, style, children} = component
	const [isHovered, setIsHovered] = useState(false)

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		console.log(id)

		setHoveredComponentId(id)
		setIsHovered(true)
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		console.log(null)

		setHoveredComponentId(null)
		setIsHovered(false)
	}

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

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
		return children ? (
			<React.Fragment>
				{children.map(child => (
					<RenderCanvasComponent
						key={child.id}
						component={child}
						setHoveredComponentId={setHoveredComponentId}
					/>
				))}
			</React.Fragment>
		) : null
	}

	switch (type) {
		case 'section':
			renderedComponent = (
				<Section
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<>
						{children?.length ? renderChildren() : null}
						{isHovered && (
							<div className='absolute px-2 py-1 text-xs font-bold bg-white rounded bottom-1 right-1 text-primary'>
								{type}
							</div>
						)}
					</>
				</Section>
			)
			break
		case 'div':
			renderedComponent = (
				<Div
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<>
						{children?.length ? renderChildren() : null}
						{isHovered && (
							<div className='absolute px-2 py-1 text-xs font-bold bg-white rounded bottom-1 right-1 text-primary'>
								{type}
							</div>
						)}
					</>
				</Div>
			)
			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
