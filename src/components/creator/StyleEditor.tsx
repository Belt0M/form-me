import React, {useEffect, useState} from 'react'

interface StyleEditorProps {
	componentId: string
	componentStyle: React.CSSProperties
	onUpdateStyle: (id: string, updatedStyle: React.CSSProperties) => void
	onClose: () => void
}

const StyleEditor: React.FC<StyleEditorProps> = ({
	componentId,
	componentStyle,
	onUpdateStyle,
	onClose,
}) => {
	const [styles, setStyles] = useState(componentStyle)

	useEffect(() => {
		setStyles(componentStyle)
	}, [componentStyle])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		const updatedStyles = {...styles, [name]: value}
		setStyles(updatedStyles)
		onUpdateStyle(componentId, updatedStyles)
	}

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const {name, value} = e.target
		const updatedStyles = {...styles, [name]: value}
		setStyles(updatedStyles)
		onUpdateStyle(componentId, updatedStyles)
	}

	return (
		<div className='fixed top-0 right-0 w-64 p-4 bg-white shadow-lg'>
			<h3 className='mb-4 text-lg font-bold'>Edit Styles</h3>
			<div className='flex flex-col gap-2'>
				<label>
					Height
					<input
						type='text'
						name='height'
						value={styles.height || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Width
					<input
						type='text'
						name='width'
						value={styles.width || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Background Color
					<input
						type='text'
						name='backgroundColor'
						value={styles.backgroundColor || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Border Radius
					<input
						type='text'
						name='borderRadius'
						value={styles.borderRadius || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Border Color
					<input
						type='text'
						name='borderColor'
						value={styles.borderColor || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Border Width
					<input
						type='text'
						name='borderWidth'
						value={styles.borderWidth || ''}
						onChange={handleInputChange}
						className='w-full px-2 py-1 border rounded'
					/>
				</label>
				<label>
					Display
					<select
						name='display'
						value={styles.display || 'block'}
						onChange={handleSelectChange}
						className='w-full px-2 py-1 border rounded'
					>
						<option value='block'>Block</option>
						<option value='flex'>Flex</option>
						<option value='grid'>Grid</option>
					</select>
				</label>
			</div>
			<button
				className='px-4 py-2 mt-4 text-white bg-purple-800 rounded hover:bg-purple-900'
				onClick={onClose}
			>
				Close
			</button>
		</div>
	)
}

export default StyleEditor
