import React, {useState} from 'react'
import {IComponent} from '../../types/EHTMLTag'
import {IStyles} from '../../types/IStyles'

const ComponentContext: React.FC<{
	component: IComponent
	onClose: () => void
	onUpdate: (component: IComponent) => void
}> = ({component, onClose, onUpdate}) => {
	const [styles, setStyles] = useState<IStyles | null>(component.styles || null)

	const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setStyles({
			...styles,
			[name]: value,
		} as IStyles)
	}

	const handleUpdate = () => {
		onUpdate({...component, styles})
		onClose()
	}

	return (
		<div className='absolute top-0 left-0 p-4 bg-white rounded shadow-md'>
			<h3 className='mb-4'>Edit Component</h3>
			<div className='mb-4'>
				<label className='block mb-2'>Background Color</label>
				<input
					type='text'
					name='backgroundColor'
					value={styles?.backgroundColor || ''}
					onChange={handleStyleChange}
					className='p-2 border rounded'
				/>
			</div>
			<div className='mb-4'>
				<label className='block mb-2'>Font Size</label>
				<input
					type='text'
					name='fontSize'
					value={styles?.fontSize || ''}
					onChange={handleStyleChange}
					className='p-2 border rounded'
				/>
			</div>
			<button
				onClick={handleUpdate}
				className='px-4 py-2 text-white bg-blue-500 rounded'
			>
				Save
			</button>
			<button onClick={onClose} className='px-4 py-2 ml-2 bg-gray-300 rounded'>
				Cancel
			</button>
		</div>
	)
}

export default ComponentContext
