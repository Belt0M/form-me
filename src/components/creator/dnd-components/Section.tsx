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
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onEditComponent?: (editID: string) => void
}

const Section: FC<Props> = ({
	id,
	style,
	children,
	onHoverGUI,
	isEditing,
	isCurrentInFocus,
	isHint,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
	const resizableRef = useRef<HTMLDivElement>(null)

	const parentDimension = getParentDimensions(resizableRef.current)

	console.log(parentDimension?.width, parentDimension?.height)

	const {dimensions, startResize} = useResizable(
		parentDimension?.width || 0,
		parentDimension?.height || 0,
		resizableRef
	)

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

	return !isHint ? (
		<section
			ref={resizableRef}
			className={clsx(
				isCurrentInFocus && !isEditing && 'border-dashed',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'h-full min-h-[100px] cursor-pointer border-2'
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
				width: dimensions?.width ? `${dimensions.width}px` : style?.width,
				height: dimensions?.height ? `${dimensions.height}px` : style?.height,
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{children}
			{onHoverGUI}
			{isEditing && (
				<>
					{resizeHandlers?.map(handle => (
						<div
							className='bg-gray-500'
							onMouseDown={e => startResize(e, handle.direction)}
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
						onMouseDown={e => startResize(e, 'bottom-right')}
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
