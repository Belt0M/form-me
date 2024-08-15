import clsx from 'clsx'
import React, {CSSProperties, FC, ReactElement} from 'react'

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
	resizeHandles,
	isCurrentHovered,
	isEditing,
	isCurrentInFocus,
	isHint,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
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
			className={clsx(
				isEditing && 'border-orange-400',
				isCurrentInFocus && !isEditing && 'border-dashed border-yellow-400',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'h-full min-h-[200px] cursor-pointer border-2'
			)}
			id={id}
			style={{
				...style,
				borderColor:
					!isEditing && !isCurrentInFocus ? style?.backgroundColor : '',
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
			{/* {isCurrentHovered && isParametersTab && resizeHandles} */}
		</section>
	) : (
		<section className='w-full border-2 bg-hint border-hintBorder min-h-36 bg-opacity-30 canvas-grid2' />
	)
}

export default Section
