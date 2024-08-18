export function getParentDimensions(
	element: HTMLElement | null
): {width: number; height: number} | null {
	if (!element) return null

	const parentElement = element.parentElement as HTMLElement | null
	if (!parentElement) return null

	const parentRect = getComputedStyle(parentElement)

	const parentWidth =
		parentElement.clientWidth -
		parseFloat(parentRect.paddingLeft) -
		parseFloat(parentRect.paddingRight)

	const parentHeight =
		parentElement.clientHeight -
		parseFloat(parentRect.paddingTop) -
		parseFloat(parentRect.paddingBottom)

	return {width: parentWidth, height: parentHeight}
}
