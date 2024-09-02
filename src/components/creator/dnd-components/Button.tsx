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
	isErrorHint?: boolean
	content?: string | undefined
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
	content,
	isErrorHint,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
	const isEditing = editingComponentId === id

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
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
				isCurrentInFocus && !isEditing && 'shadow-hoverGUI',
				isEditing && 'shadow-editGUI',
				'cursor-pointer border-2'
			)}
			type={type}
			id={id}
			style={{
				...style,
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{content ? content : type === 'button' ? 'Button' : 'Submit'}
			{children}
			{!isResizing && onHoverGUI}
		</button>
	) : (
		<button
			className={clsx(
				isErrorHint ? 'bg-red-500 border-red-700' : 'bg-hint border-hintBorder',
				'border-2 rounded-lg px-[25px] pt-[11px] pb-[9px] bg-opacity-30 text-sm'
			)}
			data-hint={true}
		>
			Button
		</button>
	)
}

export default Button
