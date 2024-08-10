import React from 'react'
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

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setHoveredComponentId(id)
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setHoveredComponentId(null)
	}

	let renderedComponent
	const computedStyle = {...style}

	// Видаляємо `left` і `top` для компонентів з `position: relative`
	if (style?.position === 'relative') {
		delete computedStyle.left
		delete computedStyle.top
		computedStyle.width = '100%'
	}

	switch (type) {
		case 'section':
			renderedComponent = (
				<Section
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
				>
					{children && (
						<React.Fragment>
							{children.map(child => (
								<RenderCanvasComponent
									key={child.id}
									component={child}
									setHoveredComponentId={setHoveredComponentId}
								/>
							))}
						</React.Fragment>
					)}
				</Section>
			)
			break
		case 'div':
			renderedComponent = (
				<Div
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
				>
					{children && (
						<React.Fragment>
							{children.map(child => (
								<RenderCanvasComponent
									key={child.id}
									component={child}
									setHoveredComponentId={setHoveredComponentId}
								/>
							))}
						</React.Fragment>
					)}
				</Div>
			)
			break
		case 'h1':
			renderedComponent = (
				<h1
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
				>
					{'H1 Component'}
				</h1>
			)
			break
		case 'input':
			renderedComponent = (
				<input
					style={computedStyle}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
				/>
			)
			break
		case 'button':
			// renderedComponent = (
			// 	<button
			// 		style={computedStyle}
			// 		onDragEnter={handleDragEnter}
			// 		onDragLeave={handleDragLeave}
			// 	>
			// 		{'Button'}
			// 	</button>
			// )
			break
		default:
			renderedComponent = null
	}

	return <>{renderedComponent}</>
}

export default RenderCanvasComponent
