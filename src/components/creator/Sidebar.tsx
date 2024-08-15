import {CaretLeft} from '@phosphor-icons/react'
import React, {useState} from 'react'
import {sidebarComponents} from '../../data/sidebar-components'
import {EHTMLTag} from '../../types/EHTMLTag'
import {EPosition} from '../../types/EPosition'

interface SidebarProps {
	isCanvasEmpty: boolean
	editingComponentId: string | null
	componentStyle: React.CSSProperties
	onDragStart: (
		type: EHTMLTag,
		position: EPosition,
		event: React.DragEvent<HTMLDivElement>
	) => void
	onDragEnd: () => void
	onUpdateStyle: (id: string, updatedStyle: React.CSSProperties) => void
}

const Sidebar: React.FC<SidebarProps> = ({
	isCanvasEmpty,
	editingComponentId,
	componentStyle,
	onDragStart,
	onDragEnd,
	onUpdateStyle,
}) => {
	const [position, setPosition] = useState<EPosition>(EPosition.RELATIVE)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		const updatedStyle = {...componentStyle, [name]: value}
		onUpdateStyle(editingComponentId as string, updatedStyle)
	}

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const {name, value} = e.target
		const updatedStyle = {...componentStyle, [name]: value}
		onUpdateStyle(editingComponentId as string, updatedStyle)
	}

	return (
		<aside className='w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900'>
			<div className='flex justify-between mb-4'>
				{!editingComponentId ? (
					<h2 className='text-xl'>Components</h2>
				) : (
					<div className='flex items-center'>
						<CaretLeft
							className='text-white cursor-pointer'
							size={24}
							// onClick={() => setActiveTab(ETabs.COMPONENTS)}
						/>
						<h2 className='ml-2 text-xl'>Properties</h2>
					</div>
				)}
			</div>

			{!editingComponentId && (
				<>
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
						{sidebarComponents.map(({icon: IconComponent, type}) => {
							const isSection = type === EHTMLTag.SECTION
							const isDisabled = isCanvasEmpty ? !isSection : false
							return (
								<div
									key={type}
									draggable={!isDisabled}
									onDragStart={event =>
										!isDisabled && onDragStart(type, position, event)
									}
									onDragEnd={onDragEnd}
									className={`flex flex-col items-center justify-center gap-2 p-2 mb-2 text-white bg-white border-2 border-purple-800 cursor-pointer aspect-square rounded-xl bg-opacity-10 ${
										isDisabled ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								>
									<IconComponent size={24} weight='bold' />
									<span className='font-bold'>{`</${type}>`}</span>
								</div>
							)
						})}
					</div>
				</>
			)}

			{editingComponentId && editingComponentId && (
				<div className='flex flex-col gap-2'>
					<label>
						Background Color
						<input
							type='text'
							name='backgroundColor'
							value={componentStyle.backgroundColor || ''}
							onChange={handleInputChange}
							className='w-full px-2 py-1 border rounded'
						/>
					</label>
					<label>
						Border Radius
						<input
							type='text'
							name='borderRadius'
							value={componentStyle.borderRadius || ''}
							onChange={handleInputChange}
							className='w-full px-2 py-1 border rounded'
						/>
					</label>
					<label>
						Border Color
						<input
							type='text'
							name='borderColor'
							value={componentStyle.borderColor || ''}
							onChange={handleInputChange}
							className='w-full px-2 py-1 border rounded'
						/>
					</label>
					<label>
						Border Width
						<input
							type='text'
							name='borderWidth'
							value={componentStyle.borderWidth || ''}
							onChange={handleInputChange}
							className='w-full px-2 py-1 border rounded'
						/>
					</label>
					<label>
						Display
						<select
							name='display'
							value={componentStyle.display || 'block'}
							onChange={handleSelectChange}
							className='w-full px-2 py-1 border rounded'
						>
							<option value='block'>Block</option>
							<option value='flex'>Flex</option>
							<option value='grid'>Grid</option>
						</select>
					</label>
				</div>
			)}
		</aside>
	)
}

export default Sidebar
