import clsx from 'clsx'
import React, {ElementType, FC} from 'react'
import {IExtendedCSSProperties} from '../../../types/IExtendedCSSProperties'

interface HeadingProps {
	id: string
	style?: IExtendedCSSProperties
	level: number
	isCurrentInFocus?: boolean
	isHint?: boolean
	editingComponentId?: string | null
	isResizing?: boolean
	onHoverGUI?: JSX.Element
	content?: string | undefined
	setIsResizing?: React.Dispatch<React.SetStateAction<boolean>>
	onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
	onUpdateStyle?: (id: string, updatedStyle: React.CSSProperties) => void
	onEditComponent?: (editID: string) => void
}

const Heading: FC<HeadingProps> = ({
	id,
	style,
	isCurrentInFocus,
	isHint,
	editingComponentId,
	level,
	isResizing,
	onHoverGUI,
	content,
	onDragEnter,
	onDragLeave,
	onMouseEnter,
	onMouseLeave,
	onEditComponent,
}) => {
	const Tag: ElementType = `h${level}` as ElementType

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

	function getBorderColor() {
		if (!isEditing && !isCurrentInFocus) {
			return style?.borderColor || style?.backgroundColor || 'transparent'
		} else if (isCurrentInFocus && !isEditing) {
			return '#facc15'
		}
		return 'transparent'
	}

	return !isHint ? (
		<Tag
			className={clsx(
				isCurrentInFocus && !isEditing && 'border-dashed',
				isCurrentInFocus &&
					'before:absolute before:inset-0 before:left-0 before:top-0',
				'cursor-pointer border-2 min-h-8'
			)}
			id={id}
			style={{
				...style,
				borderColor: getBorderColor(),
			}}
			onClick={handleClick}
			onDragEnter={onDragEnter as React.DragEventHandler<HTMLDivElement>}
			onDragLeave={onDragLeave as React.DragEventHandler<HTMLDivElement>}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			aria-atomic={true}
		>
			{content != undefined ? content : 'Heading'}
			{!isResizing && onHoverGUI}
		</Tag>
	) : (
		<Tag className='w-full p-2 text-[12.8px] text-white border-2 bg-hint bg-opacity-20 border-hintBorder'>
			{content || 'Heading'}
		</Tag>
	)
}

export default Heading
