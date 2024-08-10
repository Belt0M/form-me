import React, {useState} from 'react'
import {sidebarComponents} from '../../data/sidebar-components'
import {EHTMLTag} from '../../types/EHTMLTag'
import {EPosition} from '../../types/EPosition'

interface SidebarProps {
	onDragStart: (
		type: EHTMLTag,
		position: EPosition,
		event: React.DragEvent<HTMLDivElement>
	) => void
}

const Sidebar: React.FC<SidebarProps> = ({onDragStart}) => {
	const [position, setPosition] = useState<EPosition>(EPosition.RELATIVE)

	return (
		<aside className='w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900'>
			<h2 className='mb-4 text-xl'>Components</h2>
			<div className='mb-4'>
				<label className='block mb-2 text-white'>Position</label>
				<select
					value={position}
					onChange={e => setPosition(e.target.value as EPosition)}
					className='p-2 text-white rounded bg-stone-700'
				>
					<option value={EPosition.RELATIVE}>Relative</option>
					<option value={EPosition.ABSOLUTE}>Absolute</option>
				</select>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				{sidebarComponents.map(({icon: IconComponent, type}) => (
					<div
						key={type}
						draggable
						onDragStart={event => onDragStart(type, position, event)}
						className='flex flex-col items-center justify-center gap-2 p-2 mb-2 text-white bg-white border-2 border-purple-800 cursor-pointer aspect-square rounded-xl bg-opacity-10'
					>
						<IconComponent size={24} weight='bold' />
						<span className='font-bold'>{`</${type}>`}</span>
					</div>
				))}
			</div>
		</aside>
	)
}

export default Sidebar
