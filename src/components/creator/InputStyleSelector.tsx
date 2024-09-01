import clsx from 'clsx'
import _ from 'lodash'
import React, {useCallback, useRef} from 'react'

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
	debounce?: boolean
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
	disabled = false,
	placeholder,
	debounce,
	onChange,
	onBlur,
	onKeyDown,
	onFocus,
}) => {
	const isNotColorType = type !== 'color'

	const debouncedOnChange = useRef(
		debounce ? _.debounce(onChange, 300) : onChange
	).current

	const handleValueChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			debouncedOnChange(event)
		},
		[debouncedOnChange]
	)

	return (
		<div className='text-sm text-white'>
			{label && <p>{label}</p>}
			<input
				type={type}
				name={name}
				value={value}
				onChange={handleValueChange}
				onBlur={isNotColorType && useAdvancedHandlers ? onBlur : undefined}
				onKeyDown={
					isNotColorType && useAdvancedHandlers ? onKeyDown : undefined
				}
				min={min != undefined ? min : undefined}
				max={max != undefined ? max : undefined}
				disabled={disabled}
				onFocus={isNotColorType && useAdvancedHandlers ? onFocus : undefined}
				placeholder={placeholder || undefined}
				className={clsx(
					type === 'color' ? 'mt-1' : 'w-full px-2.5 pt-2.5 pb-2 mt-2',
					'rounded bg-stone-700'
				)}
			/>
		</div>
	)
}

export default InputStyleSelector
