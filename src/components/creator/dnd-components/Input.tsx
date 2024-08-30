import React, {FC} from 'react'
import {IExtendedCSSProperties} from '../../../types/IExtendedCSSProperties'

interface InputProps {
	id: string
	style?: IExtendedCSSProperties
	type: string
	isCurrentInFocus?: boolean
	isHint?: boolean
	editingComponentId?: string | null
	isResizing?: boolean
	onHoverGUI?: JSX.Element
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onEditComponent?: (editID: string) => void
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
}

const Input: FC<InputProps> = ({
	id,
	style,
	type,
	isCurrentInFocus,
	isHint,
	editingComponentId,
	isResizing,
	onHoverGUI,
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
		<div
			className='relative inline-block'
			style={{
				width: style?.width || 'auto',
				height: style?.height || 'auto',
			}}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<input
				type={type}
				className='border-2 outline-none cursor-pointer focus:outline-none'
				// readOnly={true}
				id={id}
				style={{
					...style,
					borderColor:
						!isEditing && !isCurrentInFocus
							? style?.borderColor || style?.backgroundColor
							: isCurrentInFocus && !isEditing && !isResizing
							? '#facc15'
							: style?.borderColor || 'transparent',
					width: '100%',
					height: '100%',
				}}
				onClick={handleClick}
				aria-atomic={true}
				placeholder={style?.placeholder || ''}
			/>
			{!isResizing && onHoverGUI}
		</div>
	) : (
		<div className='w-[205px] h-[40px] border-2 rounded-lg bg-hint border-hintBorder bg-opacity-30 inline-block' />
	)
}

export default Input
