// src/components/Sidebar.tsx
import React, {useState} from 'react'
import {IComponent} from '../../types/IComponent'

interface SidebarProps {
	onDragStart: (
		component: IComponent,
		position: string,
		event: React.DragEvent<HTMLDivElement>
	) => void
}

const components: IComponent[] = [
	{id: 'section'},
	{id: 'div'},
	{id: 'input: text'},
	{id: 'input: email'},
	{id: 'input: password'},
	{id: 'input: select'},
	{id: 'input: checkbox'},
	{id: 'input: file'},
	{id: 'button'},
	{id: 'h1-h6'},
	{id: 'span'},
	{id: 'a'},
	{id: 'img'},
	{id: 'label'},
]

const Sidebar: React.FC<SidebarProps> = ({onDragStart}) => {
	const [position, setPosition] = useState<string>('relative')

	return (
		<aside className='w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900'>
			<h2 className='mb-4 text-xl'>Components</h2>
			<div className='mb-4'>
				<label className='block mb-2 text-white'>Position</label>
				<select
					value={position}
					onChange={e => setPosition(e.target.value)}
					className='p-2 text-white rounded bg-stone-700'
				>
					<option value='relative'>Relative</option>
					<option value='absolute'>Absolute</option>
				</select>
			</div>
			{components.map(component => (
				<div
					key={component.id}
					draggable
					onDragStart={event => onDragStart(component, position, event)}
					className='p-2 mb-2 text-white cursor-pointer bg-stone-500'
				>
					{component.id}
				</div>
			))}
		</aside>
	)
}

export default Sidebar
