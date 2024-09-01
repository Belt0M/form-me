/* eslint-disable no-mixed-spaces-and-tabs */
import clsx from 'clsx'
import _ from 'lodash'
import React, {CSSProperties, useEffect, useState} from 'react'
import {sidebarComponents} from '../../data/sidebar-components'
import {EDirection} from '../../types/EDirection'
import {EHTMLTag} from '../../types/EHTMLTag'
import {EPosition} from '../../types/EPosition'
import {ESpacing} from '../../types/ESpacing'
import {ICanvasComponent} from '../../types/ICanvasComponent'
import {IExtendedCSSProperties} from '../../types/IExtendedCSSProperties'
import {findComponentById} from '../../utils/getComponentByID'
import {getElementMinDimensions} from '../../utils/getElementMinDimensions'
import {getFontSizeByHeadingLevel} from '../../utils/getFontSizeByHeadingLevel'
import {getIsBlockComponentByType} from '../../utils/getIsBlockComponentByType'
import {roundTo} from '../../utils/roundTo'
import InputStyleSelector from './InputStyleSelector'
import SectionHeading from './SectionHeading'
import SelectStyleSelector from './SelectStyleSelector'

interface SidebarProps {
	editingComponentId: string | null
	canvasComponents: ICanvasComponent[]
	onDragStart: (
		type: EHTMLTag,
		position: EPosition,
		event: React.DragEvent<HTMLDivElement>
	) => void
	onDragEnd: () => void
	onUpdateStyle: (id: string, updatedStyle: React.CSSProperties) => void
	onUpdateProperty: (id: string, name: string, value: string | number) => void
	onExitEditMode: () => void
}

const defaultGradient = {
	enabled: false,
	direction: 'to right',
	startColor: '#ffffff',
	endColor: '#000000',
}

const defaultOpenedSections = [
	'background',
	'border',
	'spacing',
	'display',
	'text',
]

const Sidebar: React.FC<SidebarProps> = ({
	editingComponentId,
	canvasComponents,
	onDragStart,
	onDragEnd,
	onUpdateStyle,
	onUpdateProperty,
	onExitEditMode,
}) => {
	const [position, setPosition] = useState<EPosition>(EPosition.RELATIVE)
	const [activeSections, setActiveSections] = useState<string[]>(
		defaultOpenedSections
	)
	const [backgroundGradient, setBackgroundGradient] = useState(defaultGradient)
	const [spacingMode, setSpacingMode] = useState<ESpacing>(ESpacing.ALL)

	const editingComponent = findComponentById(
		canvasComponents,
		editingComponentId
	)

	const currentElement = (
		editingComponent ? document.getElementById(editingComponent.id) : null
	) as HTMLElement | null
	const parent = currentElement ? currentElement.parentElement : null
	const componentStyle = editingComponent?.style || {}
	const {width: minWidth, height: minHeight} = getElementMinDimensions(
		parent,
		editingComponent?.type
	)

	const isFirstComponent = canvasComponents?.[0]?.id === editingComponentId
	const isCanvasEmpty = canvasComponents.length === 0
	const isBlock = editingComponent
		? getIsBlockComponentByType(editingComponent?.type)
		: false
	const isEditing = !!editingComponentId

	const [dimensions, setDimensions] = useState<{
		width: string
		height: string
		isEditing?: boolean
	}>({
		width: '',
		height: '',
		isEditing: false,
	})

	const [fontSize, setFontSize] = useState<{
		fontSize: string
		isEditing?: boolean
	}>({
		fontSize: '',
		isEditing: false,
	})

	const [padding, setPadding] = useState<{
		padding: string
		isEditing?: boolean
	}>({
		padding: '',
		isEditing: false,
	})

	useEffect(() => {
		if (isEditing) {
			setDimensions({
				width:
					Math.round(parseFloat(componentStyle.width as string)).toString() ||
					'',
				height:
					Math.round(parseFloat(componentStyle.height as string)).toString() ||
					'',
			})

			setFontSize(prev => ({
				...prev,
				fontSize: componentStyle.fontSize as string,
			}))
			setPadding(prev => ({
				...prev,
				padding: componentStyle.padding as string,
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [componentStyle.height, componentStyle.width, editingComponentId])

	useEffect(() => {
		if (editingComponentId) {
			setSpacingMode(ESpacing.ALL)
			setBackgroundGradient(defaultGradient)
			setActiveSections(defaultOpenedSections)
		}
	}, [editingComponentId])

	const toggleSection = (section: string) => {
		setActiveSections(prev =>
			prev.includes(section)
				? prev.filter(s => s !== section)
				: [...prev, section]
		)
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		suffix?: string
	) => {
		const {name, value} = e.target

		if (name === 'fontSize') {
			const {value} = e.target

			setFontSize(prev => ({
				...prev,
				[name]: value + 'px',
			}))
		} else {
			const newValue = value.length ? value : 16
			const updatedStyle = {
				...componentStyle,
				[name]: newValue + (suffix ? suffix : ''),
			}

			onUpdateStyle(editingComponentId as string, updatedStyle)
		}
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
				return [value, -1, -1, -1]
			case 'Right':
				return [-1, value, -1, -1]
			case 'Bottom':
				return [-1, -1, value, -1]
			case 'Left':
				return [-1, -1, -1, value]
			case 'Vertical':
				return [value, -1, value, -1]
			case 'Horizontal':
				return [-1, value, -1, value]
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

	const handleDimensionInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		name: 'width' | 'height'
	) => {
		const {value} = e.target
		setDimensions(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleBlur = (target: HTMLElement, name: string) => {
		let updatedName = name

		if (name.includes('padding')) {
			updatedName = 'padding'
		} else if (name.includes('margin')) {
			updatedName = 'margin'
		}

		switch (updatedName) {
			case 'width':
			case 'height': {
				const value = dimensions[updatedName]

				setDimensions(prev => ({...prev, isEditing: false}))

				target.blur()

				if (value) {
					const minValue = name === 'width' ? minWidth : minHeight
					const newValue =
						!value || value === '0' || +value < minValue
							? minValue
							: +value > 100
							? 100
							: value
					const updatedStyle = {...componentStyle, [name]: newValue + '%'}

					onUpdateStyle(editingComponentId as string, updatedStyle)
				}
				break
			}
			case 'fontSize': {
				const value = fontSize[updatedName]

				setFontSize(prev => ({...prev, isEditing: false}))

				target.blur()

				if (value) {
					const minValue = 8
					const maxValue = 100
					const numericValue = parseInt(value, 10)
					const newValue =
						!value || value === '0' || numericValue < minValue
							? minValue
							: numericValue > maxValue
							? maxValue
							: value
					const updatedStyle = {...componentStyle, [name]: newValue}

					if (numericValue > maxValue) {
						setFontSize(prev => ({...prev, fontSize: maxValue + 'px'}))
					} else if (numericValue < minValue) {
						setFontSize(prev => ({...prev, fontSize: minValue + 'px'}))
					}

					onUpdateStyle(editingComponentId as string, updatedStyle)
				}
				break
			}
			case 'padding': {
				const value = padding[updatedName]

				target.blur()

				const getCorrectedPaddingValue = (value: string): string => {
					if (!value || value === 'empty') return '0px'

					const minValue = 0
					const maxValue = 100

					const result = value
						.trim()
						.split(' ')
						.map(el => {
							if (!el) return '0px'

							const parsedEl = parseInt(el)

							const correctedEl =
								Math.min(Math.max(minValue, parsedEl), maxValue) + 'px'

							return correctedEl
						})
						.join(' ')
						.trim()

					return result
				}

				const correctedValue = getCorrectedPaddingValue(value)

				const updatedStyle = {...componentStyle, padding: correctedValue}

				onUpdateStyle(editingComponentId as string, updatedStyle)
				setPadding({isEditing: false, padding: correctedValue})

				break
			}
			default:
				break
		}
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		name: string
	) => {
		if (e.key === 'Enter') {
			handleBlur(e.target as HTMLElement, name)
		}
	}

	const handleRangePercentageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const {name, value} = e.target

		if (name && value !== undefined) {
			const minValue = name === 'width' ? minWidth : minHeight
			const newValue =
				!value || value === '0' || +value < minValue ? minValue : value
			const updatedStyle = {...componentStyle, [name]: newValue + '%'}

			onUpdateStyle(editingComponentId as string, updatedStyle)
		}
	}

	const handleSimpleRangeChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		units: string = 'rem'
	) => {
		const {name, value} = e.target
		const newValue = !value || value === '0' ? '-1' : value

		const updatedStyle = {...componentStyle, [name]: newValue + units}

		onUpdateStyle(editingComponentId as string, updatedStyle)
	}

	const updateSpacingStyles = (name: string, value: string, type: string) => {
		if (name) {
			const isEmpty = !value

			const baseName = name.replace(
				/Top|Right|Bottom|Left|Vertical|Horizontal/g,
				''
			)
			const isMargin = baseName === 'margin'
			const isPadding = baseName === 'padding'

			if (isEmpty) {
				const setState = isMargin ? setPadding : setPadding

				setState(prev => ({...prev, [baseName]: isEmpty ? 'empty' : value}))

				return
			}

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
				const nextStyleArr = getStyleArrFromEnum(directionName, +value)
				let resultArr

				if (curStyle) {
					const curStyleArr = styleToArray(curStyle as string)

					resultArr = curStyleArr.map((value, index) => {
						const nextValue = nextStyleArr[index]
						return nextValue !== -1 ? (nextValue < 0 ? 0 : nextValue) : value
					})
				} else {
					resultArr = getStyleArrFromEnum(directionName, +value)
				}

				const resultStyle = arrayToStyles(resultArr)

				if (type !== 'range' && (isMargin || isPadding)) {
					const setState = isMargin ? setPadding : setPadding

					setState(prev => ({...prev, padding: resultStyle}))
				} else {
					const updatedStyle = {...componentStyle, [baseName]: resultStyle}

					onUpdateStyle(editingComponentId as string, updatedStyle)

					if (isMargin || isPadding) {
						const setState = isMargin ? setPadding : setPadding

						setState(prev => ({...prev, padding: resultStyle}))
					}
				}
			}
		}
	}

	const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value, type} = e.target

		updateSpacingStyles(name, value, type)
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

	console.log(padding)

	const renderSpacingInput = (
		label: string,
		name: keyof React.CSSProperties,
		value: string | number,
		disabled = false
	) => {
		const setState = name.includes('margin') ? setPadding : setPadding

		return (
			<div className='items-center mb-2 text-sm'>
				<label className='block text-white'>{label}</label>
				<input
					type='range'
					name={name}
					min='0'
					max='100'
					value={parseInt(value as string) || 0}
					className='w-full pt-3 pb-2'
					disabled={disabled}
					onChange={handleRangeChange}
				/>
				<input
					type='number'
					name={name}
					value={value === '' ? '' : parseInt(value as string)}
					className='w-16 px-2 pt-2.5 pb-1.5 text-white rounded bg-stone-700'
					style={{appearance: 'textfield'}}
					disabled={disabled}
					onChange={handleRangeChange}
					onBlur={e => handleBlur(e.target as HTMLElement, name as string)}
					onKeyDown={e => handleKeyDown(e, name as string)}
					onFocus={() => setState(prev => ({...prev, isEditing: true}))}
				/>
			</div>
		)
	}

	const renderSpacingSection = (label: string, baseName: string) => {
		const state = baseName === 'margin' ? padding : padding
		let style = componentStyle[baseName as keyof CSSProperties] as string

		if (state.isEditing) {
			style = state[baseName as 'padding'] as string
		}

		if (spacingMode === ESpacing.ALL) {
			return renderSpacingInput(
				label,
				baseName as keyof React.CSSProperties,
				style && style !== 'empty'
					? getSeparateStyleFromGeneral(style, EDirection.ALL) || ''
					: '',
				isFirstComponent && baseName === 'margin'
			)
		} else if (spacingMode === ESpacing.AXIS) {
			return (
				<>
					{renderSpacingInput(
						`${label} Vertical`,
						`${baseName}Vertical` as keyof React.CSSProperties,
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.VERTICAL) || ''
							: '',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Horizontal`,
						`${baseName}Horizontal` as keyof React.CSSProperties,
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.HORIZONTAL) || ''
							: '',
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
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.TOP) || ''
							: '',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Right`,
						`${baseName}Right` as keyof React.CSSProperties,
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.RIGHT) || ''
							: '',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Bottom`,
						`${baseName}Bottom` as keyof React.CSSProperties,
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.BOTTOM) || ''
							: '',
						isFirstComponent && baseName === 'margin'
					)}
					{renderSpacingInput(
						`${label} Left`,
						`${baseName}Left` as keyof React.CSSProperties,
						style && style !== 'empty'
							? getSeparateStyleFromGeneral(style, EDirection.LEFT) || ''
							: '',
						isFirstComponent && baseName === 'margin'
					)}
				</>
			)
		}
	}

	const renderHeadingSection = () => {
		if (editingComponent) {
			const isHeading = editingComponent?.type === EHTMLTag.HEADING
			const componentName = isHeading ? 'Heading' : 'Button'

			return (
				<>
					{/* Heading Level */}
					<SectionHeading
						name='text'
						isOpen={activeSections.includes('text')}
						onSwitch={toggleSection}
					/>

					{activeSections.includes('text') && (
						<>
							{isHeading && (
								<SelectStyleSelector
									label='Heading Level'
									name='level'
									value={editingComponent?.level || 6}
									options={[1, 2, 3, 4, 5, 6].map(level => ({
										value: level,
										label: `h${level}`,
									}))}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										if (editingComponentId) {
											const newFontSize = getFontSizeByHeadingLevel(
												+e.target.value
											)
											const updatedStyle = {
												...componentStyle,
												fontSize: newFontSize,
											}
											setFontSize({
												fontSize: newFontSize,
												isEditing: false,
											})
											onUpdateStyle(editingComponentId as string, updatedStyle)
											onUpdateProperty(
												editingComponentId,
												e.target.name,
												+e.target.value
											)
										}
									}}
								/>
							)}

							{/* Heading Text */}
							<InputStyleSelector
								label={`${componentName} Text`}
								name='content'
								value={editingComponent.content || ''}
								type='text'
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									onUpdateProperty(
										editingComponentId as string,
										e.target.name,
										e.target.value
									)
								}}
							/>

							{/* Text Color */}
							<InputStyleSelector
								label='Text Color'
								name='color'
								value={componentStyle.color || '#ffffff'}
								type='color'
								onChange={handleInputChange}
							/>

							{/* Font Size */}
							<InputStyleSelector
								label='Font Size'
								name='fontSize'
								value={
									fontSize.isEditing
										? parseFloat(fontSize.fontSize as string).toString()
										: parseFloat(componentStyle.fontSize as string).toString()
								}
								type='number'
								onChange={e => handleInputChange(e, 'px')}
								onBlur={e => handleBlur(e.target as HTMLElement, 'fontSize')}
								onKeyDown={e => handleKeyDown(e, 'fontSize')}
								onFocus={() =>
									setFontSize(prev => ({...prev, isEditing: true}))
								}
								useAdvancedHandlers
							/>

							{/* Text Decoration */}
							<SelectStyleSelector
								label='Text Decoration'
								name='textDecoration'
								value={(componentStyle.textDecoration as string) || 'none'}
								options={[
									{value: 'none', label: 'None'},
									{value: 'underline', label: 'Underline'},
									{value: 'line-through', label: 'Line Through'},
									{value: 'overline', label: 'Overline'},
								]}
								onChange={handleInputChange}
							/>

							{/* Font Style */}
							<SelectStyleSelector
								label='Font Style'
								name='fontStyle'
								value={componentStyle.fontStyle || 'normal'}
								options={[
									{value: 'normal', label: 'Normal'},
									{value: 'italic', label: 'Italic'},
									{value: 'oblique', label: 'Oblique'},
									{value: 'inherit', label: 'Inherit'},
								]}
								onChange={handleInputChange}
							/>
						</>
					)}
				</>
			)
		}
		return null
	}

	const renderInputSection = () => {
		if (editingComponent?.type === EHTMLTag.INPUT) {
			return (
				<>
					{/* Input Placeholder */}
					<div className='group'>
						<div className='flex justify-between cursor-pointer'>
							<span className='text-white'>Placeholder</span>
						</div>
						<div className='mt-2'>
							<input
								type='text'
								name='placeholder'
								value={componentStyle.placeholder || ''}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const updatedStyle = {
										...componentStyle,
										placeholder: e.target.value,
									}
									onUpdateStyle(editingComponentId as string, updatedStyle)
								}}
								className='w-full p-2 mb-4 text-white rounded bg-stone-700'
							/>
						</div>
					</div>
				</>
			)
		}
		return null
	}

	const renderConstraintsSection = () => {
		if (editingComponent?.type === EHTMLTag.INPUT) {
			const inputType = componentStyle.inputType || 'text'

			const renderConstraint = (
				label: string,
				name: string,
				type = 'text',
				placeholder = ''
			) => (
				<div className='group'>
					<label className='block mb-2 text-white'>{label}</label>
					<input
						type={type}
						name={name}
						value={
							typeof componentStyle[name as keyof IExtendedCSSProperties] ===
								'string' ||
							typeof componentStyle[name as keyof IExtendedCSSProperties] ===
								'number'
								? String(componentStyle[name as keyof IExtendedCSSProperties])
								: ''
						}
						onChange={handleInputChange}
						className='w-full p-2 mb-4 text-white rounded bg-stone-700'
						placeholder={placeholder}
					/>
				</div>
			)

			const renderCheckboxConstraint = (label: string, name: string) => (
				<div className='group'>
					<label className='block mb-2 text-white'>{label}</label>
					<input
						type='checkbox'
						name={name}
						checked={!!componentStyle[name as keyof IExtendedCSSProperties]}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const updatedStyle = {
								...componentStyle,
								[name]: e.target.checked,
							}
							onUpdateStyle(editingComponentId as string, updatedStyle)
						}}
						className='w-full p-2 mb-4 text-white rounded bg-stone-700'
					/>
				</div>
			)

			const constraints = []

			switch (inputType) {
				case 'text':
				case 'email':
				case 'password':
				case 'search':
				case 'tel':
				case 'url':
					constraints.push(
						renderConstraint('Max Length', 'maxLength', 'number')
					)
					constraints.push(renderConstraint('Pattern (Regex)', 'pattern'))
					constraints.push(renderCheckboxConstraint('Required', 'required'))
					break

				case 'number':
				case 'range':
					constraints.push(renderConstraint('Min Value', 'min', 'number'))
					constraints.push(renderConstraint('Max Value', 'max', 'number'))
					constraints.push(renderConstraint('Step', 'step', 'number'))
					constraints.push(renderCheckboxConstraint('Required', 'required'))
					break

				case 'date':
				case 'time':
				case 'month':
				case 'week':
				case 'datetime-local':
					constraints.push(renderConstraint('Min Value', 'min', 'date'))
					constraints.push(renderConstraint('Max Value', 'max', 'date'))
					constraints.push(renderCheckboxConstraint('Required', 'required'))
					break

				case 'checkbox':
				case 'radio':
					constraints.push(renderCheckboxConstraint('Required', 'required'))
					break

				case 'file':
					constraints.push(renderCheckboxConstraint('Required', 'required'))
					break

				default:
					break
			}

			return (
				<div className='group'>
					<SectionHeading
						name='constraints'
						isOpen={activeSections.includes('constraints')}
						onSwitch={toggleSection}
					/>
					{activeSections.includes('constraints') && (
						<div className='mt-2' key='constraints'>
							{constraints}
						</div>
					)}
				</div>
			)
		}
		return null
	}

	return (
		<aside className='w-[22.5%] max-h-full px-6 overflow-y-auto select-none py-5 bg-stone-900 min-w-72 border-l-2 border-lightGray'>
			<div className='flex gap-6 mb-4 text-base'>
				<button
					className={clsx(
						isEditing
							? 'text-stone-400 hover:text-white transition-all'
							: 'text-white'
					)}
					onClick={onExitEditMode}
				>
					Components
				</button>
				<button
					className={clsx(
						!isEditing ? 'text-stone-400 cursor-not-allowed' : 'text-white'
					)}
				>
					Properties
				</button>
			</div>

			{!isEditing && (
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
							const isDisabled =
								(isCanvasEmpty && !isSection) || (isSection && !isCanvasEmpty)
									? true
									: false
							return (
								<div
									key={type}
									draggable={!isDisabled}
									onDragStart={event =>
										!isDisabled && onDragStart(type, position, event)
									}
									onDragEnd={onDragEnd}
									className={`flex flex-col items-center justify-center gap-2 p-2 mb-2 text-white bg-white border-2 border-purple-800 cursor-pointer aspect-square rounded-xl bg-opacity-10 hover:brightness-125 transition-all ${
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

			{isEditing && (
				<div className='flex flex-col gap-4'>
					{/* Background Section */}
					{isBlock && (
						<div className='group'>
							<SectionHeading
								name='background'
								isOpen={activeSections.includes('background')}
								onSwitch={toggleSection}
							/>
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
					)}

					{/* Border Section */}
					{isBlock && (
						<div className='group'>
							<SectionHeading
								name='border'
								isOpen={activeSections.includes('border')}
								onSwitch={toggleSection}
							/>
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
										value={
											componentStyle.borderColor ||
											componentStyle.backgroundColor ||
											'#000000'
										}
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
					)}

					{/* Padding & Margin Section */}
					<SectionHeading
						name='spacing'
						isOpen={activeSections.includes('spacing')}
						onSwitch={toggleSection}
					/>
					{activeSections.includes('spacing') && (
						<>
							<SelectStyleSelector
								label='Mode'
								name='mode'
								value={spacingMode}
								onChange={e => setSpacingMode(+e.target.value as ESpacing)}
								options={[
									{label: 'All Sides', value: '1'},
									{label: 'Axis (Vertical/Horizontal)', value: '2'},
									{label: 'Individual Sides', value: '3'},
								]}
							/>
							{renderSpacingSection('Padding', 'padding')}
							{renderSpacingSection('Margin', 'margin')}
							{isFirstComponent && (
								<p className='text-xs text-yellow-500'>
									Margin change is disabled for the root component.
								</p>
							)}
						</>
					)}

					{/* Display Section */}
					{isBlock && (
						<div className='group'>
							<SectionHeading
								name='display'
								isOpen={activeSections.includes('display')}
								onSwitch={toggleSection}
							/>
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
													const updatedStyle = {
														...componentStyle,
														[name]: value,
													}
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
													const updatedStyle = {
														...componentStyle,
														[name]: value,
													}
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

											<label className='block mb-2 text-white'>
												Align Items
											</label>
											<select
												name='alignItems'
												value={componentStyle.alignItems || 'stretch'}
												onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
													const {name, value} = e.target
													const updatedStyle = {
														...componentStyle,
														[name]: value,
													}
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
												step={0.1}
												min='0'
												max='10'
												value={parseFloat(componentStyle.gap as string) || 0}
												onChange={handleSimpleRangeChange}
												className='w-full'
											/>
											<span className='text-white'>
												{parseFloat(componentStyle.gap as string) || 0}rem
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
					)}

					{renderHeadingSection()}
					{renderInputSection()}
					{renderConstraintsSection()}

					{/* Width & Height Section */}
					{!isFirstComponent &&
						isBlock &&
						editingComponent?.type !== EHTMLTag.BUTTON && (
							<div className='group'>
								<SectionHeading
									name='dimensions'
									isOpen={activeSections.includes('dimensions')}
									onSwitch={toggleSection}
								/>
								{activeSections.includes('dimensions') && (
									<div className='mt-2'>
										<label className='block mb-2 text-white'>Width (%)</label>
										<input
											type='range'
											name='width'
											min={minWidth}
											max='100'
											value={
												dimensions.isEditing
													? dimensions.width.length
														? dimensions.width
														: 0
													: roundTo(parseFloat(componentStyle.width as string))
											}
											onChange={handleRangePercentageChange}
											className='w-full'
										/>
										<input
											type='number'
											name='width'
											value={
												dimensions.isEditing
													? dimensions.width
													: roundTo(parseFloat(componentStyle.width as string))
											}
											onChange={e => handleDimensionInputChange(e, 'width')}
											onBlur={e => handleBlur(e.target as HTMLElement, 'width')}
											onKeyDown={e => handleKeyDown(e, 'width')}
											onFocus={() =>
												setDimensions(prev => ({...prev, isEditing: true}))
											}
											className='w-16 p-1 ml-2 text-white rounded bg-stone-700'
											style={{appearance: 'textfield'}}
										/>

										<label className='block mt-4 mb-2 text-white'>
											Height (%)
										</label>
										<input
											type='range'
											name='height'
											min={minHeight}
											max='minWidth'
											value={
												dimensions.isEditing
													? dimensions.height.length
														? dimensions.height
														: 0
													: roundTo(parseFloat(componentStyle.height as string))
											}
											onChange={handleRangePercentageChange}
											className='w-full'
										/>
										<input
											type='number'
											name='height'
											value={
												dimensions.isEditing
													? dimensions.height
													: roundTo(parseFloat(componentStyle.height as string))
											}
											onChange={e => handleDimensionInputChange(e, 'height')}
											onBlur={e =>
												handleBlur(e.target as HTMLElement, 'height')
											}
											onKeyDown={e => handleKeyDown(e, 'height')}
											onFocus={() =>
												setDimensions(prev => ({...prev, isEditing: true}))
											}
											className='w-16 p-1 ml-2 text-white rounded bg-stone-700'
											style={{appearance: 'textfield'}}
										/>
									</div>
								)}
							</div>
						)}
				</div>
			)}
		</aside>
	)
}

export default Sidebar
