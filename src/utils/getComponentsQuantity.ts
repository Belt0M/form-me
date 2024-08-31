import {ICanvasComponent} from '../types/ICanvasComponent'

export function getComponentsQuantity(tree: ICanvasComponent[]): number {
	let count = 0

	for (const node of tree) {
		count += countComponentsInSubtree(node)
	}

	return count
}

function countComponentsInSubtree(node: ICanvasComponent): number {
	let count = 1

	if (node.children) {
		for (const child of node.children) {
			count += countComponentsInSubtree(child)
		}
	}

	return count
}
