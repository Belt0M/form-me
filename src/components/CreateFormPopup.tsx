import {X} from '@phosphor-icons/react'
import clsx from 'clsx'
import {FC} from 'react'
import {ICreateForm} from '../types/ICreateForm'

interface Props {
	onClose: () => void
	onCreate: () => void
	setData: React.Dispatch<React.SetStateAction<ICreateForm>>
	data: ICreateForm
}

const CreateFormPopup: FC<Props> = ({onCreate, onClose, setData, data}) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='relative w-1/3 px-6 py-5 border-2 border-purple-800 bg-dark rounded-xl'>
				<button
					onClick={onClose}
					className='absolute p-2 transition-all top-2 right-2 hover:text-white text-stone-400'
				>
					<X weight='bold' size={18} />
				</button>
				<h2 className='mb-4 text-xl font-bold'>Create New Form</h2>
				<label htmlFor='name' className='font-semibold'>
					Form Name
				</label>
				<input
					id='name'
					type='text'
					value={data.title}
					onChange={e => setData(prev => ({...prev, title: e.target.value}))}
					placeholder='Name of your form...'
					className={clsx(
						data.title ? 'border-purple-600' : 'border-stone-500',
						'w-full mt-2 pt-[0.675rem] px-3 pb-2 border-2 focus:border-purple-600 focus:outline-none rounded-lg'
					)}
				/>
				<label htmlFor='desc' className='block mt-3 font-semibold'>
					Description
				</label>
				<textarea
					id='desc'
					value={data.description}
					onChange={e =>
						setData(prev => ({...prev, description: e.target.value}))
					}
					placeholder='Description of your form...'
					className={clsx(
						data.description ? 'border-purple-600' : 'border-stone-500',
						'w-full mt-2 pt-3 px-3 pb-2.5 border-2 focus:border-purple-600 focus:outline-none rounded-lg'
					)}
				/>
				<button
					onClick={onCreate}
					className='w-full pt-3.5	 pb-2.5 mt-6 text-base font-semibold text-white transition-all bg-purple-800 rounded-xl disabled:cursor-not-allowed disabled:bg-stone-600 enabled:hover:brightness-110'
					disabled={!data.title || !data.description}
				>
					Create Form
				</button>
			</div>
		</div>
	)
}

export default CreateFormPopup
