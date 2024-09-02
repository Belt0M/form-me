import {FC, useState} from 'react'

interface InputTypeModalProps {
	onSelectType: (inputType?: string, buttonType?: 'button' | 'submit') => void
	onClose: () => void
}

const inputTypes = [
	'text',
	'email',
	'number',
	'password',
	// 'submit',
	// 'checkbox',
	// 'color',
	// 'date',
	// 'file',
	// 'range',
]

const InputTypeModal: FC<InputTypeModalProps> = ({onSelectType, onClose}) => {
	const [selectedType, setSelectedType] = useState<string | null>(null)
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
			<div className='relative py-8 border-2 border-gray-400 rounded shadow-lg px-7 bg-dark'>
				<div className='flex items-center gap-4 mb-4 '>
					<h3 className='text-lg font-bold uppercase'>Select Input Type</h3>
					<span className='mt-0.5 text-xs font-bold '>
						type="{selectedType || '...'}"
					</span>
				</div>
				<ul className='grid grid-cols-4 gap-4'>
					{inputTypes.map(type => (
						<li
							key={type}
							className='aspect-square'
							onMouseEnter={() => setSelectedType(type)}
							onMouseLeave={() => setSelectedType(null)}
						>
							<button
								className='w-full h-full p-2 text-white transition-all border-2 rounded-lg bg-stone-800 border-primary hover:brightness-110'
								onClick={() => onSelectType(type)}
							>
								{type}
							</button>
						</li>
					))}
				</ul>
				<button
					className='absolute p-2 text-white transition-all bg-red-500 rounded-full top-4 right-3.5 hover:brightness-75 '
					onClick={onClose}
				></button>
			</div>
		</div>
	)
}

export default InputTypeModal
