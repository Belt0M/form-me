import React from 'react'
import DraggableItem from './DraggableItem'

const Sidebar: React.FC = () => {
	return (
		<aside className='w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900'>
			<h4 className='mb-5 font-semibold text-stone-400'>
				Drag and Drop Elements
			</h4>
			<div className='w-full h-[.1rem] bg-stone-400 bg-opacity-40 mb-3' />
			<h5 className='mb-2 text-stone-400'>Structural Components</h5>
			<div>
				<DraggableItem id='section' label='Section (block)' />
				<DraggableItem id='div' label='Div (grid/flex/absolute/relative)' />
			</div>
			<h5 className='mt-5 mb-2 text-stone-400'>Form Components</h5>
			<div>
				<DraggableItem id='input-text' label='Input (text)' />
				<DraggableItem id='input-email' label='Input (email)' />
				<DraggableItem id='input-password' label='Input (password)' />
				<DraggableItem id='select' label='Select' />
				<DraggableItem id='checkbox' label='Checkbox' />
				<DraggableItem id='file' label='File Input' />
				<DraggableItem id='button-submit' label='Button (submit)' />
				<DraggableItem id='button' label='Button' />
				<DraggableItem id='label' label='Label' />
				<DraggableItem id='h1' label='Heading 1' />
				<DraggableItem id='h2' label='Heading 2' />
				<DraggableItem id='h3' label='Heading 3' />
				<DraggableItem id='h4' label='Heading 4' />
				<DraggableItem id='h5' label='Heading 5' />
				<DraggableItem id='h6' label='Heading 6' />
				<DraggableItem id='span' label='Span' />
				<DraggableItem id='a' label='Anchor' />
				<DraggableItem id='img' label='Image' />
			</div>
		</aside>
	)
}

export default Sidebar
