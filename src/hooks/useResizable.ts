import {useEffect, useState} from 'react'

const useResizable = (
	initialWidth: number,
	initialHeight: number,
	resizableRef: React.RefObject<HTMLDivElement>
) => {
	const [dimensions, setDimensions] = useState({
		width: initialWidth,
		height: initialHeight,
	})

	useEffect(() => {
		if (!dimensions.width && !dimensions.height) {
			console.log({width: initialWidth, height: initialHeight})
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
					let newWidth = startWidth
					let newHeight = startHeight

					if (direction === 'right' || direction === 'bottom-right') {
						newWidth = Math.min(
							startWidth + (event.clientX - startX),
							parentWidth
						)
					}
					if (direction === 'left') {
						newWidth = Math.max(startWidth - (event.clientX - startX), 100)
					}

					if (direction === 'bottom' || direction === 'bottom-right') {
						newHeight = Math.min(
							startHeight + (event.clientY - startY),
							parentHeight
						)
					}
					if (direction === 'top') {
						newHeight = Math.max(startHeight - (event.clientY - startY), 100)
					}

					console.log(Math.max(newWidth, 100), Math.max(newHeight, 100))

					setDimensions({
						width: Math.max(newWidth, 100),
						height: Math.max(newHeight, 100),
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
