import {useEffect, useState} from 'react'

const useResizable = (
	initialWidth: number,
	initialHeight: number,
	resizableRef: React.RefObject<HTMLDivElement>,
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
		if (!dimensions.width && !dimensions.height) {
			setDimensions({width: initialWidth, height: initialHeight})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialWidth, initialHeight])

	const startResize = (e: React.MouseEvent, direction: string) => {
		e.preventDefault()
		let isResizing = true

		const startX = e.clientX
		const startY = e.clientY
		const startWidth = dimensions.width
		const startHeight = dimensions.height

		const handleMouseMove = (event: MouseEvent) => {
			if (resizableRef) {
				const parentElement = resizableRef.current?.parentElement

				if (isResizing && parentElement) {
					const parentRect = getComputedStyle(parentElement)
					const parentWidth =
						parentElement.clientWidth -
						parseFloat(parentRect.paddingLeft) -
						parseFloat(parentRect.paddingRight)
					const parentHeight =
						parentElement.clientHeight -
						parseFloat(parentRect.paddingTop) -
						parseFloat(parentRect.paddingBottom)
					const cursorDiffX = (event.clientX - startX) * (isCenteredX ? 2 : 1)
					const cursorDiffY = (event.clientY - startY) * (isCenteredY ? 2 : 1)
					let newWidth = startWidth
					let newHeight = startHeight

					if (direction === 'right' || direction === 'bottom-right') {
						newWidth = Math.min(startWidth + cursorDiffX, parentWidth)
					}
					if (direction === 'left') {
						newWidth = Math.max(startWidth - cursorDiffX, minWidth)
					}

					if (direction === 'bottom' || direction === 'bottom-right') {
						newHeight = Math.min(startHeight + cursorDiffY, parentHeight)
					}
					if (direction === 'top') {
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
