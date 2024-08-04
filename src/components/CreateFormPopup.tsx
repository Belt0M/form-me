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
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-dark px-6 py-5 rounded-xl w-1/3 relative border-2 border-purple-800'>
				<button
					onClick={onClose}
					className='absolute top-2 right-2 hover:text-white transition-all p-2 text-stone-400'
				>
					<X weight='bold' size={18} />
				</button>
				<h2 className='text-xl mb-4 font-bold'>Create New Form</h2>
				<label htmlFor='name' className='font-semibold'>
					Form Name
				</label>
				<input
					id='name'
					type='text'
					value={data.name}
					onChange={e => setData(prev => ({...prev, name: e.target.value}))}
					placeholder='Name of your form...'
					className={clsx(
						data.name ? 'border-purple-600' : 'border-stone-500',
						'w-full mt-2 pt-2 px-3 pb-2.5 border-2 focus:border-purple-600 focus:outline-none rounded-lg'
					)}
				/>
				<label htmlFor='desc' className='mt-3 block font-semibold'>
					Description
				</label>
				<textarea
					id='desc'
					value={data.desc}
					onChange={e => setData(prev => ({...prev, desc: e.target.value}))}
					placeholder='Description of your form...'
					className={clsx(
						data.desc ? 'border-purple-600' : 'border-stone-500',
						'w-full mt-2 pt-2 px-3 pb-2.5 border-2 focus:border-purple-600 focus:outline-none rounded-lg'
					)}
				/>
				<button
					onClick={onCreate}
					className='bg-purple-800 text-white pt-2.5 pb-[0.7rem] rounded-xl w-full mt-6 disabled:cursor-not-allowed disabled:bg-stone-600 text-base font-semibold enabled:hover:brightness-110 transition-all'
					disabled={!data.name || !data.desc}
				>
					Create Form
				</button>
			</div>
		</div>
	)
}

export default CreateFormPopup
