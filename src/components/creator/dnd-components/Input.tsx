/* eslint-disable no-mixed-spaces-and-tabs */
import {Resize} from '@phosphor-icons/react'
import clsx from 'clsx'
import React, {FC, useEffect, useRef, useState} from 'react'
import useResizable from '../../../hooks/useResizable'
import {IExtendedCSSProperties} from '../../../types/IExtendedCSSProperties'
import {getParentDimensions} from '../../../utils/getParentDimensions'
import {roundTo} from '../../../utils/roundTo'

interface InputProps {
	id: string
	style?: IExtendedCSSProperties
	type: string
	isCurrentInFocus?: boolean
	isHint?: boolean
	editingComponentId?: string | null
	isResizing?: boolean
	onHoverGUI?: JSX.Element
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onEditComponent?: (editID: string) => void
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
}

const Input: FC<InputProps> = ({
	id,
	style,
	type,
	isCurrentInFocus,
	isHint,
	editingComponentId,
	isResizing,
	onHoverGUI,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
	setIsResizing,
	onUpdateStyle,
}) => {
	const resizableRef = useRef<HTMLDivElement>(null)
	const parentElement = resizableRef.current
		?.parentElement as HTMLElement | null

	const parentDimension = getParentDimensions(resizableRef.current)

	const computedStyles = parentElement ? getComputedStyle(parentElement) : null

	const isEditing = editingComponentId === id

	const isCenteredX = !!(
		style &&
		parentElement &&
		computedStyles &&
		((computedStyles.display === 'flex' &&
			computedStyles.justifyContent === 'center') ||
			(computedStyles.display === 'grid' &&
				computedStyles.placeItems === 'center'))
	)
	const isCenteredY = !!(
		style &&
		parentElement &&
		computedStyles &&
		((computedStyles.display === 'flex' &&
			computedStyles.alignItems === 'center') ||
			(computedStyles.display === 'grid' &&
				computedStyles.placeItems === 'center'))
	)

	const resizeInitWidth =
		parentDimension?.width && style?.width
			? (parentDimension.width / 100) *
			  roundTo(parseFloat(style.width as string))
			: 0
	const resizeInitHeight =
		parentDimension?.height && style?.height
			? (parentDimension.height / 100) *
			  roundTo(parseFloat(style.height as string))
			: 0

	const {dimensions, startResize} = useResizable(
		resizeInitWidth,
		resizeInitHeight,
		resizableRef,
		isCenteredX,
		isCenteredY,
		100,
		30
	)

	const [localDimensions, setLocalDimensions] = useState({
		width: dimensions.width,
		height: dimensions.height,
	})

	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		setLocalDimensions(dimensions)
	}, [dimensions])

	useEffect(() => {
		if (!isResizing && parentDimension && onUpdateStyle && isUpdating) {
			const updatedStyle = {
				width: `${roundTo(
					(localDimensions.width / parentDimension.width) * 100
				)}%`,
				height: `${roundTo(
					(localDimensions.height / parentDimension.height) * 100
				)}%`,
			}

			onUpdateStyle(id, updatedStyle)
			setIsUpdating(false)
		}
	}, [
		isResizing,
		localDimensions,
		parentDimension,
		onUpdateStyle,
		id,
		isUpdating,
	])

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation()

		if (
			e.target &&
			(e.target as HTMLElement).getAttribute('aria-atomic') &&
			onEditComponent
		) {
			onEditComponent(id)
		}
	}

	const onMouseUp = () => {
		setIsResizing && setIsResizing(false)
		setIsUpdating(true)

		document.removeEventListener('mouseup', onMouseUp)
	}

	const handleResize = (
		e: React.MouseEvent,
		direction: string,
		isStart: boolean
	) => {
		setIsResizing && setIsResizing(true)

		if (isStart) {
			document.addEventListener('mouseup', onMouseUp)
			startResize(e, direction)
		}
	}

	let width: number | string =
		isResizing || isUpdating
			? localDimensions.width
			: style?.width
			? style.width
			: '50%'
	let height: number | string =
		isResizing || isUpdating
			? localDimensions.height
			: style?.height
			? style.height
			: '50%'

	const borderSize = style?.borderWidth
		? (style?.borderWidth as string).includes('px')
			? parseFloat(style?.borderWidth as string) / 8
			: parseFloat(style?.borderWidth as string)
		: 0

	if (
		isResizing &&
		parentDimension &&
		parentDimension.width &&
		parentDimension.height &&
		width &&
		height
	) {
		width = (+width / parentDimension.width) * 100 + '%'
		height = (+height / parentDimension.height) * 100 + '%'
	}

	console.log(
		dimensions,
		style?.width,
		style?.height,
		width,
		height,
		isResizing,
		parentDimension
	)

	return !isHint ? (
		<div
			className='relative block'
			style={{
				width,
				height,
			}}
			ref={resizableRef}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<input
				type={type}
				className={clsx(
					isCurrentInFocus && !isEditing && !isResizing && 'shadow-hoverGUI',
					'border-2 outline-none cursor-pointer focus:outline-none'
				)}
				id={id}
				style={{
					...style,
					width: '100%',
					height: '100%',
				}}
				onClick={handleClick}
				aria-atomic={true}
				placeholder={style?.placeholder || ''}
			/>
			{!isResizing && onHoverGUI}
			{!isResizing && onHoverGUI}
			{isEditing && (
				<>
					{['top', 'right', 'bottom', 'left'].map(handler => (
						<div
							className={clsx(
								handler === 'top' || handler === 'bottom'
									? 'cursor-n-resize'
									: 'cursor-e-resize',
								'absolute bg-teal-500'
							)}
							onMouseDown={e => handleResize(e, handler, true)}
							aria-expanded={true}
							key={handler}
							style={{
								width:
									handler === 'left' || handler === 'right'
										? '4px'
										: `calc(100% + ${borderSize * 2}rem)`,
								height:
									handler === 'top' || handler === 'bottom'
										? '4px'
										: `calc(100% + ${borderSize * 2}rem)`,
								top: handler !== 'bottom' ? -borderSize + 'rem' : undefined,
								bottom: handler === 'bottom' ? -borderSize + 'rem' : undefined,
								left: handler !== 'right' ? -borderSize + 'rem' : undefined,
								right: handler === 'right' ? -borderSize + 'rem' : undefined,
							}}
						/>
					))}
					<div
						className='absolute grid w-6 h-6 bg-black rounded-tl place-items-center hover:brightness-110 cursor-se-resize'
						style={{
							bottom: -borderSize + 'rem',
							right: -borderSize + 'rem',
						}}
						onMouseDown={e => handleResize(e, 'bottom-right', true)}
						aria-expanded={true}
						key='bottom-right'
					>
						<Resize size={16} aria-expanded={true} />
					</div>
				</>
			)}
		</div>
	) : (
		<div className='block w-[205px] h-[40px] border-2 rounded-lg bg-hint border-hintBorder bg-opacity-30' />
	)
}

export default Input
