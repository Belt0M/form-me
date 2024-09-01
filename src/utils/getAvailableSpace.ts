import {getElementHeightWithoutBorderAndPadding} from './getElementHeightWithoutBorderAndPadding'
import {getElementWidthWithoutBorderAndPadding} from './getElementWidthWithoutBorderAndPadding'

export const getAvailableSpace = (
	parent: HTMLElement | null,
	inPercents?: boolean
) => {
	if (parent) {
		const parentWidth = getElementWidthWithoutBorderAndPadding(parent)
		const parentHeight = getElementHeightWithoutBorderAndPadding(parent)

		const siblings = Array.from(parent.children)

		let maxWidth = parentWidth
		let maxHeight = parentHeight

		siblings.forEach(sibling => {
			const {width: siblingWidth, height: siblingHeight} =
				sibling.getBoundingClientRect()

			const isFlexRow =
				parent.style.display === 'flex' &&
				(!parent.style.flexDirection ||
					['row', 'row-reverse'].includes(parent.style.flexDirection))

			if (isFlexRow) {
				const availableWidth = maxWidth - siblingWidth

				maxWidth = Math.min(maxWidth, availableWidth)
			}

			if (!isFlexRow) {
				const availableHeight = maxHeight - siblingHeight

				maxHeight = Math.min(maxHeight, availableHeight)
			}
		})

		if (inPercents) {
			maxWidth = (maxWidth / parentWidth) * 100
			maxHeight = (maxHeight / parentHeight) * 100
		}

		return {availableWidth: maxWidth, availableHeight: maxHeight}
	} else {
		return {availableWidth: 100, availableHeight: 100}
	}
}
