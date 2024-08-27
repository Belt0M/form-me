export const getElementHeightWithoutBorderAndPadding = (
	element: HTMLElement
) => {
	const styles = window.getComputedStyle(element)

	const paddingTop = parseFloat(styles.paddingTop)
	const paddingBottom = parseFloat(styles.paddingBottom)

	const heightWithoutPadding = element.clientHeight - paddingTop - paddingBottom

	return heightWithoutPadding
}
