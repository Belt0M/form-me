import {Resize} from '@phosphor-icons/react'
import clsx from 'clsx'
import React, {
	CSSProperties,
	FC,
	ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react'
import useResizable from '../../../hooks/useResizable'
import {getParentDimensions} from '../../../utils/getParentDimensions'
import {roundTo} from '../../../utils/roundTo'

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
	onDragEnter?: (
		event: React.DragEvent<HTMLDivElement | HTMLFormElement>
	) => void
	onDragLeave?: (
		event: React.DragEvent<HTMLDivElement | HTMLFormElement>
	) => void
	onMouseEnter?: (
		event: React.MouseEvent<HTMLDivElement | HTMLFormElement>
	) => void
	onMouseLeave?: (
		event: React.MouseEvent<HTMLDivElement | HTMLFormElement>
	) => void
	onEditComponent?: (editID: string) => void
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
}

const Form: FC<Props> = ({
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
	onUpdateStyle,
}) => {
	const resizableRef = useRef<HTMLFormElement>(null)
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
		isCenteredY,
		384,
		384
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

	const borderSize = style?.borderWidth
		? (style?.borderWidth as string).includes('px')
			? parseFloat(style?.borderWidth as string) / 8
			: parseFloat(style?.borderWidth as string)
		: 0

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

	return !isHint ? (
		<form
			ref={resizableRef}
			className={clsx(
				isCurrentInFocus && !isEditing && !isResizing && 'shadow-hoverGUI',
				'h-full min-h-96 cursor-pointer border-2 min-w-96'
			)}
			id={id}
			style={{
				...style,
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
					{['top', 'right', 'bottom', 'left'].map(handler => (
						<div
							className={clsx(
								handler === 'top' || handler === 'bottom'
									? 'cursor-n-resize'
									: 'cursor-e-resize',
								'absolute bg-teal-500 cursor-n-resize'
							)}
							onMouseDown={e => handleResize(e, handler, true)}
							aria-expanded={true}
							key={handler}
							style={{
								width:
									handler === 'left' || handler === 'right'
										? '5px'
										: `calc(100% + ${borderSize * 2 + 0.1 * 2}rem)`,
								height:
									handler === 'top' || handler === 'bottom'
										? '5px'
										: `calc(100% + ${borderSize * 2 + 0.1 * 2}rem)`,
								top:
									handler !== 'bottom' ? -borderSize - 0.1 + 'rem' : undefined,
								bottom:
									handler === 'bottom' ? -borderSize - 0.1 + 'rem' : undefined,
								left:
									handler !== 'right' ? -borderSize - 0.1 + 'rem' : undefined,
								right:
									handler === 'right' ? -borderSize - 0.1 + 'rem' : undefined,
							}}
						/>
					))}
					<div
						className='absolute grid w-8 h-8 bg-black rounded-tl place-items-center hover:brightness-110 cursor-se-resize'
						style={{
							bottom: -borderSize - 0.1 + 'rem',
							right: -borderSize - 0.1 + 'rem',
						}}
						onMouseDown={e => handleResize(e, 'bottom-right', true)}
						aria-expanded={true}
						key='bottom-right'
					>
						<Resize size={20} aria-expanded={true} />
					</div>
				</>
			)}
		</form>
	) : (
		<form className='w-full border-2 bg-hint border-hintBorder min-h-36 bg-opacity-30 hint-grid' />
	)
}

export default Form
