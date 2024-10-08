import {FC, useState} from 'react'

interface ButtonTypeModalProps {
	onSelectType: (
		inputType?: string | null,
		buttonType?: 'button' | 'submit' | null
	) => void
	onClose: () => void
	hasSubmit: boolean
}

const buttonTypes = ['button', 'submit']

const ButtonTypeModal: FC<ButtonTypeModalProps> = ({
	onSelectType,
	onClose,
	hasSubmit,
}) => {
	const [selectedType, setSelectedType] = useState<string | null>(null)
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
			<div className='relative w-1/3 py-8 border-2 border-gray-400 rounded shadow-lg px-7 bg-dark'>
				<div className='flex items-center gap-4 mb-4'>
					<h3 className='text-lg font-bold uppercase'>Select Button Type</h3>
					<span className='mt-0.5 text-xs font-bold'>
						type="{selectedType || '...'}"
					</span>
				</div>
				<ul className='grid grid-cols-2 gap-4'>
					{buttonTypes.map(type => {
						const isDisabled = hasSubmit && type === 'submit'

						return (
							<li
								key={type}
								onMouseEnter={() =>
									!isDisabled ? setSelectedType(type) : undefined
								}
								onMouseLeave={() =>
									!isDisabled ? setSelectedType(null) : undefined
								}
							>
								<button
									type='button'
									className='w-full h-full p-2 pt-4 pb-3.5 text-white transition-all border-2 rounded-lg bg-stone-800 enabled:border-primary hover:enabled:brightness-110 disabled:bg-stone-600 disabled:cursor-not-allowed'
									onClick={() =>
										onSelectType(null, type as 'button' | 'submit' | null)
									}
									disabled={isDisabled}
								>
									{type}
								</button>
							</li>
						)
					})}
				</ul>
				<button
					className='absolute p-2 text-white transition-all bg-red-500 rounded-full top-4 right-3.5 hover:brightness-75'
					onClick={onClose}
				></button>
			</div>
		</div>
	)
}

export default ButtonTypeModal
