import clsx from 'clsx'
import React from 'react'

interface Props {
	label: string
	name: string
	value: string | number
	type: 'text' | 'color' | 'number'
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
	useAdvancedHandlers?: boolean
}

const InputStyleSelector: React.FC<Props> = ({
	label,
	name,
	value,
	type,
	onChange,
	onBlur,
	onKeyDown,
	onFocus,
	useAdvancedHandlers = false,
}) => {
	const isNotColorType = type !== 'color'

	return (
		<div className='text-sm text-white'>
			<p>{label}</p>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={isNotColorType && useAdvancedHandlers ? onBlur : undefined}
				onKeyDown={
					isNotColorType && useAdvancedHandlers ? onKeyDown : undefined
				}
				onFocus={isNotColorType && useAdvancedHandlers ? onFocus : undefined}
				className={clsx(
					type === 'color' ? 'mt-1' : 'w-full px-2.5 pt-2.5 pb-2 mt-2',
					'rounded bg-stone-700'
				)}
			/>
		</div>
	)
}

export default InputStyleSelector
