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
	isHint?: boolean
	isCurrentInFocus?: boolean
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const Div: FC<Props> = ({
	id,
	style,
	children,
	isHint,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	isCurrentHovered,
	isParametersTab,
	onHoverGUI,
	resizeHandles,
	isCurrentInFocus,
}) => {
	return !isHint ? (
		<div
			className={clsx(
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0 border-yellow-400 border-2 border-dashed',
				'h-24 bg-gray-300 min-h-24'
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
		</div>
	) : (
		<div className='w-full border-2 bg-hint border-hintBorder min-h-24 bg-opacity-30 canvas-grid2' />
	)
}

export default Div
