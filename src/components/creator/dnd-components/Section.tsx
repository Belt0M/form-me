import clsx from 'clsx'
import React, {CSSProperties, FC, ReactElement} from 'react'

interface Props {
	id: string
	style?: CSSProperties
	children?: ReactElement | ReactElement[]
	onHoverGUI?: JSX.Element
	resizeHandles?: JSX.Element
	isParametersTab?: boolean
	isCurrentHovered?: boolean
	isCurrentInFocus?: boolean
	isHint?: boolean
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const Section: FC<Props> = ({
	id,
	style,
	children,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	isParametersTab,
	onHoverGUI,
	resizeHandles,
	isCurrentHovered,
	isCurrentInFocus,
	isHint,
}) => {
	return !isHint ? (
		<section
			className={clsx(
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0 border-yellow-400 border-2 border-dashed',
				'h-full min-h-[200px] bg-gray-500'
			)}
			id={id}
			style={style}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{children}
			{!isParametersTab && onHoverGUI}
			{isCurrentHovered && isParametersTab && resizeHandles}
		</section>
	) : (
		<section className='w-full border-2 bg-hint border-hintBorder min-h-36 bg-opacity-30 canvas-grid2' />
	)
}

export default Section
