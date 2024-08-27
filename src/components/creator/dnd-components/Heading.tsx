import {Resize} from '@phosphor-icons/react'
import clsx from 'clsx'
import React, {ElementType, FC, useEffect, useRef, useState} from 'react'
import {resizeHandlers} from '../../../data/resizeHandles'
import useResizable from '../../../hooks/useResizable'
import {IExtendedCSSProperties} from '../../../types/IExtendedCSSProperties'
import {getParentDimensions} from '../../../utils/getParentDimensions'

interface HeadingProps {
	id: string
	style?: IExtendedCSSProperties
	level: number
	isCurrentInFocus?: boolean
	isHint?: boolean
	editingComponentId?: string | null
	isResizing?: boolean
	onHoverGUI?: JSX.Element
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
	onEditComponent?: (editID: string) => void
}

const Heading: FC<HeadingProps> = ({
	id,
	style,
	isCurrentInFocus,
	isHint,
	editingComponentId,
	level,
	isResizing,
	onHoverGUI,
	onUpdateStyle,
	setIsResizing,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
	const Tag: ElementType = `h${level}` as ElementType

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
			? (parentDimension.width / 100) * parseInt(style.width as string)
			: 0
	const resizeInitHeight =
		parentDimension?.height && style?.height
			? (parentDimension.height / 100) * parseInt(style.height as string)
			: 0

	const {dimensions, startResize} = useResizable(
		resizeInitWidth,
		resizeInitHeight,
		resizableRef,
		isCenteredX,
		isCenteredY
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
				width: `${(localDimensions.width / parentDimension.width) * 100}%`,
				height: `${(localDimensions.height / parentDimension.height) * 100}%`,
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

	return !isHint ? (
		<Tag
			className={clsx(
				isCurrentInFocus && !isEditing && 'border-dashed',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'cursor-pointer border-2'
			)}
			id={id}
			style={{
				...style,
				borderColor:
					!isEditing && !isCurrentInFocus
						? style?.borderColor || style?.backgroundColor
						: isCurrentInFocus && !isEditing
						? '#facc15'
						: 'transparent',
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter as React.DragEventHandler<HTMLDivElement>}
			onDragLeave={onDragLeave as React.DragEventHandler<HTMLDivElement>}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{style?.text || 'Heading'}
			{!isResizing && onHoverGUI}
			{isEditing && (
				<>
					{resizeHandlers?.map(handle => (
						<div
							className='bg-gray-500'
							onMouseDown={e => handleResize(e, handle.direction, true)}
							aria-expanded={true}
							key={handle.direction}
							style={{
								position: 'absolute',
								...handle.styles,
							}}
						/>
					))}
					<div
						className='absolute bottom-0 right-0 grid w-8 h-8 transition-all bg-black rounded place-items-center hover:brightness-110 cursor-se-resize'
						onMouseDown={e => handleResize(e, 'bottom-right', true)}
						aria-expanded={true}
						key='bottom-right'
					>
						<Resize size={20} aria-expanded={true} />
					</div>
				</>
			)}
		</Tag>
	) : (
		<Tag className='w-full p-2 border-2 bg-hint border-hintBorder bg-opacity-30 hint-grid'>
			{style?.text || 'Heading'}
		</Tag>
	)
}

export default Heading
