import {useEffect, useState} from 'react'
import {getMaxSiblingDimensions} from '../utils/getMaxSiblingDimension'

const useResizable = (
	initialWidth: number,
	initialHeight: number,
	resizableRef: React.RefObject<HTMLDivElement | HTMLButtonElement>,
	isCenteredX: boolean,
	isCenteredY: boolean,
	minWidth: number = 100,
	minHeight: number = 100
) => {
	const [dimensions, setDimensions] = useState({
		width: initialWidth,
		height: initialHeight,
	})

	useEffect(() => {
		setDimensions({width: initialWidth, height: initialHeight})
	}, [initialWidth, initialHeight])

	const startResize = (e: React.MouseEvent, direction: string) => {
		e.preventDefault()
		let isResizing = true

		const startX = e.clientX
		const startY = e.clientY
		const startWidth = dimensions.width
		const startHeight = dimensions.height

		const handleMouseMove = (event: MouseEvent) => {
			if (resizableRef.current) {
				const parentElement = resizableRef.current.parentElement as HTMLElement

				if (isResizing && parentElement) {
					const cursorDiffX = (event.clientX - startX) * (isCenteredX ? 2 : 1)
					const cursorDiffY = (event.clientY - startY) * (isCenteredY ? 2 : 1)

					let newWidth = startWidth
					let newHeight = startHeight

					const elementId =
						resizableRef.current.id ||
						resizableRef.current.querySelector('[aria-atomic="true"]')?.id ||
						null

					const {maxWidth, maxHeight} = getMaxSiblingDimensions(
						parentElement,
						elementId
					)

					if (direction.includes('right')) {
						newWidth = Math.min(startWidth + cursorDiffX, maxWidth)
					}
					if (direction.includes('left')) {
						newWidth = Math.max(startWidth - cursorDiffX, minWidth)
					}

					if (direction.includes('bottom')) {
						newHeight = Math.min(startHeight + cursorDiffY, maxHeight)
					}
					if (direction.includes('top')) {
						newHeight = Math.max(startHeight - cursorDiffY, minHeight)
					}

					setDimensions({
						width: Math.max(newWidth, minWidth),
						height: Math.max(newHeight, minHeight),
					})
				}
			}
		}

		const handleMouseUp = () => {
			isResizing = false
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	return {
		dimensions,
		startResize,
	}
}

export default useResizable
