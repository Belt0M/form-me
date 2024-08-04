import {PencilLine, Trash} from '@phosphor-icons/react'
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {IForm} from '../types/IForm'

interface Props {
	data: IForm
	onDelete: (id: string) => void
}

const FormCard: FC<Props> = ({data, onDelete}) => {
	return (
		<div className='border bg-stone-900 border-stone-600 text-white px-6 pb-1 rounded self-end transition-all hover:bg-purple-800 hover:bg-opacity-10 hover:border-purple-800 h-[19rem] text-xl duration-200 font-semibold relative flex justify-center items-center flex-col'>
			<h2>{data.name}</h2>
			<p className='mt-2 text-stone-400 text-sm'>{data.description}</p>

			<div className='absolute bottom-4 right-4 flex items-center gap-2'>
				<Link to={`/form/${data.id}`}>
					<PencilLine
						size={40}
						color='#3b82f6'
						className='p-2 bg-blue-500 bg-opacity-15 rounded-full cursor-pointer hover:bg-opacity-25 transition-all'
					/>
				</Link>
				<Trash
					size={40}
					color='#ef4444 '
					className='p-2 bg-red-500 bg-opacity-15 rounded-full cursor-pointer hover:bg-opacity-25 transition-all'
					onClick={() => onDelete(data.id)}
				/>
			</div>
		</div>
	)
}

export default FormCard
