import React from 'react'

interface Props {
	label: string
	name: string
	value: string | number
	options: {value: string | number; label: string}[]
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectStyleSelector: React.FC<Props> = ({
	label,
	name,
	value,
	options,
	onChange,
}) => {
	return (
		<div className='text-sm text-white'>
			<span>{label}</span>
			<select
				name={name}
				value={value}
				onChange={onChange}
				className='w-full px-2 pt-[0.8rem] pb-2.5 mt-2 text-white rounded bg-stone-700'
			>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}

export default SelectStyleSelector
