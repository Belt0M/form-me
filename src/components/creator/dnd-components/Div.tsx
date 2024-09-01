/* eslint-disable no-mixed-spaces-and-tabs */
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
	isCurrentInFocus?: boolean
	isHint?: boolean
	isErrorHint?: boolean
	isResizing?: boolean
	editingComponentId?: string | null
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onEditComponent?: (editID: string) => void
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
}

const Div: FC<Props> = ({
	id,
	style,
	children,
	onHoverGUI,
	isCurrentInFocus,
	isHint,
	isErrorHint,
	isResizing,
	editingComponentId,
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

	return !isHint ? (
		<div
			ref={resizableRef}
			className={clsx(
				isCurrentInFocus && !isEditing && !isResizing && 'shadow-hoverGUI',
				'h-full min-h-[100px] cursor-pointer border-2'
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
								'absolute bg-teal-500'
							)}
							onMouseDown={e => handleResize(e, handler, true)}
							aria-expanded={true}
							key={handler}
							style={{
								width:
									handler === 'left' || handler === 'right'
										? '4px'
										: `calc(100% + ${borderSize * 2 + 0.1 * 2}rem)`,
								height:
									handler === 'top' || handler === 'bottom'
										? '4px'
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
		</div>
	) : (
		<div
			className={clsx(
				isErrorHint ? 'bg-red-500 border-red-700' : 'bg-hint border-hintBorder',
				'w-full border-2 min-h-24 bg-opacity-30'
			)}
		/>
	)
}

export default Div
