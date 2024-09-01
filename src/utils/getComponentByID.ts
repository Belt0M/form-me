import {ICanvasComponent} from '../types/ICanvasComponent'

export function getComponentById(
	tree: ICanvasComponent[],
	id: string | null
): ICanvasComponent | null {
	if (!id) return null

	for (const node of tree) {
		const found = findComponentInSubtree(node, id)
		if (found) {
			return found
		}
	}

	return null
}

function findComponentInSubtree(
	node: ICanvasComponent,
	id: string
): ICanvasComponent | null {
	if (node.id === id) {
		return node
	}

	if (node.children) {
		for (const child of node.children) {
			const found = findComponentInSubtree(child, id)
			if (found) {
				return found
			}
		}
	}

	return null
}
