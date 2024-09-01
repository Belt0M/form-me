import {ICanvasComponent} from '../types/ICanvasComponent'

export function getHintComponent(
	tree: ICanvasComponent[]
): ICanvasComponent | null {
	for (const node of tree) {
		const found = findComponentInSubtree(node)
		if (found) {
			return found
		}
	}

	return null
}

function findComponentInSubtree(
	node: ICanvasComponent
): ICanvasComponent | null {
	if (node.isHint) {
		return node
	}

	if (node.children) {
		for (const child of node.children) {
			const found = findComponentInSubtree(child)
			if (found) {
				return found
			}
		}
	}

	return null
}
