import {useEffect} from 'react'

export const useClickOutside = (
	ref: React.RefObject<HTMLElement>,
	editingComponentId: string | null,
	setEditingComponentId: React.Dispatch<React.SetStateAction<string | null>>
) => {
	useEffect(() => {
		if (ref.current) {
			const handleClickOutside = (event: MouseEvent) => {
				if (editingComponentId !== null && event?.target) {
					const clickedElement = event.target as HTMLElement

					if (
						clickedElement.id !== editingComponentId &&
						!clickedElement.getAttribute('aria-expanded') &&
						!(clickedElement.parentNode as Element)?.getAttribute(
							'aria-expanded'
						)
					) {
						if (
							clickedElement.getAttribute('aria-atomic') &&
							clickedElement.id
						) {
							setEditingComponentId(clickedElement.id)
						} else {
							document.removeEventListener('mousedown', handleClickOutside)
							setEditingComponentId(null)
						}
					}
				}
			}

			const element = ref.current

			if (editingComponentId) {
				element.addEventListener('mousedown', handleClickOutside)
			} else {
				element.removeEventListener('mousedown', handleClickOutside)
			}
		}
	}, [editingComponentId, ref, setEditingComponentId])
}
