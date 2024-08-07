import {useDraggable} from '@dnd-kit/core'
import React from 'react'

const DraggableItem: React.FC<{id: string; label: string}> = ({id, label}) => {
	const {attributes, listeners, setNodeRef} = useDraggable({
		id,
	})

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className='p-2 mb-2 text-white rounded cursor-pointer bg-stone-700'
		>
			{label}
		</div>
	)
}

export default DraggableItem
