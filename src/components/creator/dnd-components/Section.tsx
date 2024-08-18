import {Resize} from '@phosphor-icons/react'
import clsx from 'clsx'
import React, {CSSProperties, FC, ReactElement, useRef} from 'react'
import {resizeHandlers} from '../../../data/resizeHandles'
import useResizable from '../../../hooks/useResizable'
import {getParentDimensions} from '../../../utils/getParentDimensions'

interface Props {
	id: string
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onHoverGUI?: JSX.Element
	resizeHandles?: JSX.Element
	isCurrentHovered?: boolean
	isCurrentInFocus?: boolean
	isHint?: boolean
	isEditing?: boolean
	isResizing?: boolean
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onEditComponent?: (editID: string) => void
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
}

const Section: FC<Props> = ({
	id,
	style,
	children,
	onHoverGUI,
	isEditing,
	isCurrentInFocus,
	isHint,
	isResizing,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
	setIsResizing,
}) => {
	const resizableRef = useRef<HTMLDivElement>(null)
	const parentElement = resizableRef.current
		?.parentElement as HTMLElement | null

	const parentDimension = getParentDimensions(resizableRef.current)

	const computedStyles = parentElement ? getComputedStyle(parentElement) : null

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

	const {dimensions, startResize} = useResizable(
		parentDimension?.width || 0,
		parentDimension?.height || 0,
		resizableRef,
		isCenteredX,
		isCenteredY,
		384,
		384
	)

	let width: number | string = dimensions
		? dimensions.width
		: style && style.width
		? style.width
		: 50
	let height: number | string = dimensions
		? dimensions.height
		: style && style.height
		? style.height
		: 50

	if (
		parentDimension &&
		parentDimension.width &&
		parentDimension.height &&
		width &&
		height
	) {
		width = (+width / parentDimension.width) * 100 + '%'
		height = (+height / parentDimension.height) * 100 + '%'
	} else {
		width = width + 'px'
		height = height + 'px'
	}

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

	return !isHint ? (
		<section
			ref={resizableRef}
			className={clsx(
				isCurrentInFocus && !isEditing && 'border-dashed',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'h-full min-h-96 cursor-pointer border-2 min-w-96'
			)}
			id={id}
			style={{
				...style,
				borderColor:
					!isEditing && !isCurrentInFocus
						? style?.borderColor || style?.backgroundColor
						: isCurrentInFocus && !isEditing && !isResizing
						? '#facc15'
						: 'transparent',
				width,
				height,
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{children}
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
		</section>
	) : (
		<section className='w-full border-2 bg-hint border-hintBorder min-h-36 bg-opacity-30 hint-grid' />
	)
}

export default Section
