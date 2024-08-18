import {CaretLeft} from '@phosphor-icons/react'
import _ from 'lodash'
import React, {CSSProperties, useEffect, useState} from 'react'
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
	isFirstComponent: boolean
}

enum ESpacing {
	ALL = 1,
	AXIS = 2,
	INDIVIDUAL = 3,
}

enum EDirection {
	ALL = 'All',
	HORIZONTAL = 'Horizontal',
	VERTICAL = 'Vertical',
	LEFT = 'Left',
	RIGHT = 'Right',
	TOP = 'Top',
	BOTTOM = 'Bottom',
}

const defaultGradient = {
	enabled: false,
	direction: 'to right',
	startColor: '#ffffff',
	endColor: '#000000',
}

const Sidebar: React.FC<SidebarProps> = ({
	isCanvasEmpty,
	editingComponentId,
	componentStyle,
	onDragStart,
	onDragEnd,
	onUpdateStyle,
	isFirstComponent,
}) => {
	const [position, setPosition] = useState<EPosition>(EPosition.RELATIVE)
	const [activeSections, setActiveSections] = useState<string[]>([])
	const [backgroundGradient, setBackgroundGradient] = useState(defaultGradient)
	const [spacingMode, setSpacingMode] = useState<ESpacing>(ESpacing.ALL)

	useEffect(() => {
		if (editingComponentId) {
			setSpacingMode(ESpacing.ALL)
			setBackgroundGradient(defaultGradient)
			setActiveSections([])
		}
	}, [editingComponentId])

	useEffect(() => {
		if (componentStyle.backgroundImage) {
			const gradientMatch = componentStyle.backgroundImage.match(
				/linear-gradient\(([^,]+),\s*(#[0-9A-Fa-f]+),\s*(#[0-9A-Fa-f]+)\)/
			)
			if (gradientMatch) {
				setBackgroundGradient({
					enabled: true,
					direction: gradientMatch[1],
					startColor: gradientMatch[2],
					endColor: gradientMatch[3],
				})
			}
		}
	}, [componentStyle.backgroundImage])

	const toggleSection = (section: string) => {
		setActiveSections(prev =>
			prev.includes(section)
				? prev.filter(s => s !== section)
				: [...prev, section]
		)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		const updatedStyle = {...componentStyle, [name]: value}
		onUpdateStyle(editingComponentId as string, updatedStyle)
	}

	const arrayToStyles = (arr: number[]): string => {
		if (!arr || !arr?.length) throw new Error('Incorrect function arguments')

		return arr.reduce(
			(acc: string, curValue: number) => acc + curValue + 'px ',
			''
		)
	}

	const styleToArray = (style: string): number[] => {
		if (!style) throw new Error('Incorrect function arguments')

		const remToPxConversionFactor = 16

		let arrayAfterSplitting = style.trim().split(' ')

		arrayAfterSplitting =
			arrayAfterSplitting.length === 1
				? new Array(4).fill(arrayAfterSplitting[0])
				: arrayAfterSplitting

		return arrayAfterSplitting.map(value => {
			if (value.endsWith('rem')) {
				const remValue = parseFloat(value)
				return remValue * remToPxConversionFactor
			}
			return parseFloat(value)
		})
	}

	function getStyleArrFromEnum(position: string, value: number): number[] {
		switch (position) {
			case 'Top':
				return [value, 0, 0, 0]
			case 'Right':
				return [0, value, 0, 0]
			case 'Bottom':
				return [0, 0, value, 0]
			case 'Left':
				return [0, 0, 0, value]
			case 'Vertical':
				return [value, 0, value, 0]
			case 'Horizontal':
				return [0, value, 0, value]
			case 'All':
				return [value, value, value, value]
			default:
				throw new Error('Invalid position')
		}
	}

	const getSeparateStyleFromGeneral = (
		style: string,
		direction: EDirection
	): string | null => {
		const styleArr = styleToArray(style)
		let result = null

		if (styleArr) {
			switch (direction) {
				case EDirection.TOP:
					result = styleArr[0]?.toString() || null
					break
				case EDirection.BOTTOM:
					result = styleArr[2]?.toString() || null
					break
				case EDirection.LEFT:
					result = styleArr[3]?.toString() || null
					break
				case EDirection.RIGHT:
					result = styleArr[1]?.toString() || null
					break
				case EDirection.HORIZONTAL:
					result = Math.max(styleArr[1], styleArr[3])?.toString() || null
					break
				case EDirection.VERTICAL:
					result = Math.max(styleArr[0], styleArr[2])?.toString() || null
					break
				default:
					result = styleArr.join(' ')
					break
			}

			return result
		}

		return null
	}

	type EDirectionType = (typeof EDirection)[keyof typeof EDirection]

	function isEnumValue(value: string): value is EDirectionType {
		return Object.values(EDirection).includes(value as EDirectionType)
	}

	const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		const newValue = !value || value === '0' ? '-1' : value
		const baseName = name.replace(
			/Top|Right|Bottom|Left|Vertical|Horizontal/g,
			''
		)
		let directionName = name
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.split(' ')
			.pop()

		if (directionName) {
			directionName = isEnumValue(directionName)
				? directionName
				: EDirection.ALL
		}

		if (directionName) {
			const curStyle = componentStyle[baseName as keyof CSSProperties]
			const nextStyleArr = getStyleArrFromEnum(directionName, +newValue)
			let resultArr

			if (curStyle) {
				const curStyleArr = styleToArray(curStyle as string)

				resultArr = curStyleArr.map((value, index) => {
					const nextValue = nextStyleArr[index]
					return nextValue !== 0 ? (nextValue < 0 ? 0 : nextValue) : value
				})
			} else {
				resultArr = getStyleArrFromEnum(directionName, +newValue)
			}

			const resultStyle = arrayToStyles(resultArr)

			const updatedStyle = {...componentStyle, [baseName]: resultStyle}

			onUpdateStyle(editingComponentId as string, updatedStyle)
		}
	}

	const handleGradientChange = _.debounce(gradient => {
		if (gradient.enabled) {
			const updatedStyle = {
				backgroundImage: `linear-gradient(${gradient.direction}, ${gradient.startColor}, ${gradient.endColor})`,
			}
			onUpdateStyle(editingComponentId as string, updatedStyle)
		} else {
			onUpdateStyle(editingComponentId as string, {backgroundImage: ''})
		}
	}, 5)

	const handleGradientColorChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const {name, value} = e.target
		setBackgroundGradient(prev => {
			const newGradient = {...prev, [name]: value}
			handleGradientChange(newGradient)
			return newGradient
		})
	}

	const handleGradientDirectionChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const {value} = e.target
		setBackgroundGradient(prev => {
			const newGradient = {...prev, direction: value}
			handleGradientChange(newGradient)
			return newGradient
		})
	}

	const handleToggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
		const enabled = e.target.checked
		setBackgroundGradient(prev => {
			const newGradient = {...prev, enabled}
			handleGradientChange(newGradient)
			return newGradient
		})
	}

	const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const {value} = e.target
		let updatedStyle: React.CSSProperties = {
			display: value,
		}

		if (value === 'flex') {
			updatedStyle = {
				...updatedStyle,
				flexDirection: 'row',
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				gap: '0px',
			}
		} else if (value === 'grid') {
			updatedStyle = {
				...updatedStyle,
				gridTemplateColumns: '',
				gridTemplateRows: '',
				gap: '0px',
			}
		}

		onUpdateStyle(editingComponentId as string, updatedStyle)
	}

	const renderSpacingInput = (
		label: string,
		name: keyof React.CSSProperties,
		value: string | number,
		disabled = false
	) => (
		<div className='flex items-center mb-2'>
			<label className='w-1/3 text-white'>{label}</label>
			<input
				type='range'
				name={name}
				min='0'
				max='100'
				value={parseInt(value as string) || 0}
				onChange={handleRangeChange}
				className='w-full'
				disabled={disabled}
			/>
			<input
				type='number'
				name={name}
				value={parseInt(value as string) || 0}
				onChange={handleRangeChange}
				className='w-16 p-1 ml-2 text-white rounded bg-stone-700'
				disabled={disabled}
			/>
		</div>
	)

	const renderSpacingSection = (label: string, baseName: string) => {
		const style = componentStyle[baseName as keyof CSSProperties] as string

		if (spacingMode === ESpacing.ALL) {
			return renderSpacingInput(
				label,
				baseName as keyof React.CSSProperties,
				style
					? getSeparateStyleFromGeneral(style, EDirection.ALL) || '0px'
					: '0px',
				isFirstComponent && baseName === 'margin'
			)
		} else if (spacingMode === ESpacing.AXIS) {
			return (
				<>
					{renderSpacingInput(
						`${label} Vertical`,
						`${baseName}Vertical` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.VERTICAL) || '0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Horizontal`,
						`${baseName}Horizontal` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.HORIZONTAL) ||
									'0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
				</>
			)
		} else {
			return (
				<>
					{renderSpacingInput(
						`${label} Top`,
						`${baseName}Top` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.TOP) || '0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Right`,
						`${baseName}Right` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.RIGHT) || '0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Bottom`,
						`${baseName}Bottom` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.BOTTOM) || '0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Left`,
						`${baseName}Left` as keyof React.CSSProperties,
						style
							? getSeparateStyleFromGeneral(style, EDirection.LEFT) || '0px'
							: '0px',
						isFirstComponent && baseName === 'margin'
					)}
				</>
			)
		}
	}

	return (
		<aside className='w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900 min-w-72'>
			<div className='flex justify-between mb-4'>
				{!editingComponentId ? (
					<h2 className='text-xl'>Components</h2>
				) : (
					<div className='flex items-center'>
						<CaretLeft className='text-white cursor-pointer' size={24} />
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

			{editingComponentId && (
				<div className='flex flex-col gap-4'>
					{/* Background Section */}
					<div className='group'>
						<div
							className='flex justify-between cursor-pointer'
							onClick={() => toggleSection('background')}
						>
							<span className='text-white'>Background</span>
							<span>{activeSections.includes('background') ? '▲' : '▼'}</span>
						</div>
						{activeSections.includes('background') && (
							<div className='mt-2'>
								<label className='block mb-2 text-white'>
									Background Color
								</label>
								<input
									type='color'
									name='backgroundColor'
									value={componentStyle.backgroundColor || '#ffffff'}
									onChange={handleInputChange}
									className='w-full h-10 px-2 py-1 border rounded'
								/>
								<div className='mt-4'>
									<label className='flex items-center mb-2 text-white'>
										<input
											type='checkbox'
											name='enableGradient'
											checked={backgroundGradient.enabled}
											onChange={handleToggleGradient}
											className='mr-2'
										/>
										Enable Gradient
									</label>
									{backgroundGradient.enabled && (
										<>
											<select
												name='direction'
												value={backgroundGradient.direction}
												onChange={handleGradientDirectionChange}
												className='w-full p-2 mb-2 text-white rounded bg-stone-700'
											>
												<option value='to right'>To Right</option>
												<option value='to left'>To Left</option>
												<option value='to bottom'>To Bottom</option>
												<option value='to top'>To Top</option>
											</select>
											<input
												type='color'
												name='startColor'
												value={backgroundGradient.startColor}
												onChange={handleGradientColorChange}
												className='w-full h-10 px-2 py-1 mb-2 border rounded'
											/>
											<input
												type='color'
												name='endColor'
												value={backgroundGradient.endColor}
												onChange={handleGradientColorChange}
												className='w-full h-10 px-2 py-1 border rounded'
											/>
										</>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Border Section */}
					<div className='group'>
						<div
							className='flex justify-between cursor-pointer'
							onClick={() => toggleSection('border')}
						>
							<span className='text-white'>Border</span>
							<span>{activeSections.includes('border') ? '▲' : '▼'}</span>
						</div>
						{activeSections.includes('border') && (
							<div className='mt-2'>
								<label className='block mb-2 text-white'>Border Width</label>
								<input
									type='range'
									name='borderWidth'
									min='0'
									max='20'
									value={parseInt(componentStyle.borderWidth as string) || 0}
									onChange={handleRangeChange}
									className='w-full'
								/>
								<span className='text-white'>
									{parseInt(componentStyle.borderWidth as string) || 0}px
								</span>
								<label className='block mt-4 mb-2 text-white'>
									Border Color
								</label>
								<input
									type='color'
									name='borderColor'
									value={componentStyle.borderColor || '#000000'}
									onChange={handleInputChange}
									className='w-full h-10 px-2 py-1 border rounded'
								/>
								<label className='block mt-4 mb-2 text-white'>
									Border Style
								</label>
								<select
									name='borderStyle'
									value={componentStyle.borderStyle || 'solid'}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										const {name, value} = e.target
										const updatedStyle = {...componentStyle, [name]: value}
										onUpdateStyle(editingComponentId as string, updatedStyle)
									}}
									className='w-full p-2 mb-2 text-white rounded bg-stone-700'
								>
									<option value='solid'>Solid</option>
									<option value='dashed'>Dashed</option>
									<option value='dotted'>Dotted</option>
									<option value='double'>Double</option>
								</select>
								<label className='block mt-4 mb-2 text-white'>
									Border Radius
								</label>
								<input
									type='range'
									name='borderRadius'
									min='0'
									max='50'
									value={parseInt(componentStyle.borderRadius as string) || 0}
									onChange={handleRangeChange}
									className='w-full'
								/>
								<span className='text-white'>
									{parseInt(componentStyle.borderRadius as string) || 0}px
								</span>
							</div>
						)}
					</div>

					{/* Padding & Margin Section */}
					<div className='group'>
						<div
							className='flex justify-between cursor-pointer'
							onClick={() => toggleSection('spacing')}
						>
							<span className='text-white'>Spacing</span>
							<span>{activeSections.includes('spacing') ? '▲' : '▼'}</span>
						</div>
						{activeSections.includes('spacing') && (
							<div className='mt-2'>
								<label className='block mb-2 text-white'>Spacing Mode</label>
								<select
									value={spacingMode}
									onChange={e => setSpacingMode(+e.target.value as ESpacing)}
									className='w-full p-2 mb-4 text-white rounded bg-stone-700'
								>
									<option value='1'>All Sides</option>
									<option value='2'>Axis (Vertical/Horizontal)</option>
									<option value='3'>Individual Sides</option>
								</select>

								{renderSpacingSection('Padding', 'padding')}
								<div className={isFirstComponent ? 'opacity-50' : ''}>
									{renderSpacingSection('Margin', 'margin')}
									{isFirstComponent && (
										<p className='mt-1 text-xs text-yellow-500'>
											Margin change is disabled for the root component.
										</p>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Display Section */}
					<div className='group'>
						<div
							className='flex justify-between cursor-pointer'
							onClick={() => toggleSection('display')}
						>
							<span className='text-white'>Display</span>
							<span>{activeSections.includes('display') ? '▲' : '▼'}</span>
						</div>
						{activeSections.includes('display') && (
							<div className='mt-2'>
								<label className='block mb-2 text-white'>Display Type</label>
								<select
									name='display'
									value={componentStyle.display || 'block'}
									onChange={handleDisplayChange}
									className='w-full p-2 mb-2 text-white rounded bg-stone-700'
								>
									<option value='block'>Block</option>
									<option value='flex'>Flex</option>
									<option value='grid'>Grid</option>
								</select>

								{/* Flex options */}
								{componentStyle.display === 'flex' && (
									<div className='mt-2'>
										<label className='block mb-2 text-white'>
											Flex Direction
										</label>
										<select
											name='flexDirection'
											value={componentStyle.flexDirection || 'row'}
											onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
												const {name, value} = e.target
												const updatedStyle = {...componentStyle, [name]: value}
												onUpdateStyle(
													editingComponentId as string,
													updatedStyle
												)
											}}
											className='w-full p-2 mb-2 text-white rounded bg-stone-700'
										>
											<option value='row'>Row</option>
											<option value='row-reverse'>Row Reverse</option>
											<option value='column'>Column</option>
											<option value='column-reverse'>Column Reverse</option>
										</select>

										<label className='block mb-2 text-white'>
											Justify Content
										</label>
										<select
											name='justifyContent'
											value={componentStyle.justifyContent || 'flex-start'}
											onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
												const {name, value} = e.target
												const updatedStyle = {...componentStyle, [name]: value}
												onUpdateStyle(
													editingComponentId as string,
													updatedStyle
												)
											}}
											className='w-full p-2 mb-2 text-white rounded bg-stone-700'
										>
											<option value='flex-start'>Flex Start</option>
											<option value='center'>Center</option>
											<option value='flex-end'>Flex End</option>
											<option value='space-between'>Space Between</option>
											<option value='space-around'>Space Around</option>
										</select>

										<label className='block mb-2 text-white'>Align Items</label>
										<select
											name='alignItems'
											value={componentStyle.alignItems || 'stretch'}
											onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
												const {name, value} = e.target
												const updatedStyle = {...componentStyle, [name]: value}
												onUpdateStyle(
													editingComponentId as string,
													updatedStyle
												)
											}}
											className='w-full p-2 mb-2 text-white rounded bg-stone-700'
										>
											<option value='stretch'>Stretch</option>
											<option value='flex-start'>Flex Start</option>
											<option value='center'>Center</option>
											<option value='flex-end'>Flex End</option>
											<option value='baseline'>Baseline</option>
										</select>

										<label className='block mb-2 text-white'>Gap</label>
										<input
											type='range'
											name='gap'
											min='0'
											max='50'
											value={parseInt(componentStyle.gap as string) || 0}
											onChange={handleRangeChange}
											className='w-full'
										/>
										<span className='text-white'>
											{parseInt(componentStyle.gap as string) || 0}px
										</span>
									</div>
								)}

								{/* Grid options */}
								{componentStyle.display === 'grid' && (
									<div className='mt-2'>
										<label className='block mb-2 text-white'>
											Grid Template Columns
										</label>
										<input
											type='text'
											name='gridTemplateColumns'
											value={componentStyle.gridTemplateColumns || ''}
											onChange={handleInputChange}
											className='w-full px-2 py-1 mb-2 border rounded'
											placeholder='e.g., 1fr 1fr 1fr'
										/>

										<label className='block mb-2 text-white'>
											Grid Template Rows
										</label>
										<input
											type='text'
											name='gridTemplateRows'
											value={componentStyle.gridTemplateRows || ''}
											onChange={handleInputChange}
											className='w-full px-2 py-1 mb-2 border rounded'
											placeholder='e.g., auto auto'
										/>

										<label className='block mb-2 text-white'>Gap</label>
										<input
											type='range'
											name='gap'
											min='0'
											max='50'
											value={parseInt(componentStyle.gap as string) || 0}
											onChange={handleRangeChange}
											className='w-full'
										/>
										<span className='text-white'>
											{parseInt(componentStyle.gap as string) || 0}px
										</span>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</aside>
	)
}

export default Sidebar
