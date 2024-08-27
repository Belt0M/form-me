export const getElementWidthWithoutBorderAndPadding = (
	element: HTMLElement
) => {
	const styles = window.getComputedStyle(element)

	const paddingLeft = parseFloat(styles.paddingLeft)
	const paddingRight = parseFloat(styles.paddingRight)

	const widthWithoutPadding = element.clientWidth - paddingLeft - paddingRight

	return widthWithoutPadding
}
