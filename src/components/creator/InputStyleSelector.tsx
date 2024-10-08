import clsx from 'clsx'
import React from 'react'

interface Props {
	label?: string
	name: string
	value: string | number
	type: 'text' | 'color' | 'number' | 'range' | 'pattern'
	useAdvancedHandlers?: boolean
	min?: number
	max?: number
	disabled?: boolean
	placeholder?: string
	infoBelow?: boolean
	units?: string
	step?: number
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const InputStyleSelector: React.FC<Props> = ({
	label,
	name,
	value,
	type,
	useAdvancedHandlers = false,
	max,
	min,
	step,
	disabled = false,
	placeholder,
	infoBelow,
	units = 'rem',
	onChange,
	onBlur,
	onKeyDown,
	onFocus,
}) => {
	const isNotColorType = type !== 'color'

	return (
		<div
			className={clsx(
				type === 'range' ? 'flex-[2]' : type !== 'color' && 'flex-1',
				'flex flex-col justify-center text-sm text-white'
			)}
		>
			{label && <label className='block mb-2'>{label}</label>}
			<input
				type={type}
				name={name}
				value={value}
				min={min != undefined ? min : undefined}
				max={max != undefined ? max : undefined}
				step={step}
				disabled={disabled}
				placeholder={placeholder || undefined}
				className={clsx(
					type === 'color' ? 'mt-1' : type !== 'range' && 'px-2.5 pt-2.5 pb-2',
					'rounded bg-stone-700 w-full'
				)}
				onChange={onChange}
				onKeyDown={
					isNotColorType && useAdvancedHandlers ? onKeyDown : undefined
				}
				onFocus={isNotColorType && useAdvancedHandlers ? onFocus : undefined}
				onBlur={isNotColorType && useAdvancedHandlers ? onBlur : undefined}
			/>
			{infoBelow && units && (
				<span className='mt-2 text-white'>{value + units}</span>
			)}
		</div>
	)
}

export default InputStyleSelector
