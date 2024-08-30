import clsx from 'clsx'
import React, {FC, ReactElement} from 'react'
import {IExtendedCSSProperties} from '../../../types/IExtendedCSSProperties'

interface Props {
	id: string
	style?: IExtendedCSSProperties
	children?: ReactElement | ReactElement[]
	onHoverGUI?: JSX.Element
	isCurrentInFocus?: boolean
	isHint?: boolean
	isResizing?: boolean
	editingComponentId?: string | null
	type?: 'button' | 'submit'
	onDragEnter?: (
		event: React.DragEvent<HTMLDivElement | HTMLButtonElement>
	) => void
	onDragLeave?: (
		event: React.DragEvent<HTMLDivElement | HTMLButtonElement>
	) => void
	onMouseEnter?: (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
	) => void
	onMouseLeave?: (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
	) => void
	onEditComponent?: (editID: string) => void
}

const Button: FC<Props> = ({
	id,
	style,
	children,
	onHoverGUI,
	isCurrentInFocus,
	isHint,
	isResizing,
	editingComponentId,
	type,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
	const isEditing = editingComponentId === id

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
		<button
			className={clsx(
				isCurrentInFocus && !isEditing && 'border-dashed',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'cursor-pointer border-2'
			)}
			type={type}
			id={id}
			style={{
				...style,
				borderColor:
					!isEditing && !isCurrentInFocus
						? style?.borderColor || style?.backgroundColor
						: isCurrentInFocus && !isEditing && !isResizing
						? '#facc15'
						: style?.borderColor || 'transparent',
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{style?.text || 'Button'}
			{children}
			{!isResizing && onHoverGUI}
		</button>
	) : (
		<button className='border-2 rounded-lg bg-hint border-hintBorder px-[25px] pt-[9px] pb-[11px] bg-opacity-30'>
			Button
		</button>
	)
}

export default Button
