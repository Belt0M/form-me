import {PencilLine, Trash} from '@phosphor-icons/react'
import {FC} from 'react'
import {useNavigate} from 'react-router-dom'
import {IForm} from '../types/IForm'

interface Props {
	data: IForm
	onDelete: (id: string) => void
}

const FormCard: FC<Props> = ({data, onDelete}) => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate(`/form/${data.id}`, {state: {content: data.components}})
	}

	return (
		<div className='border bg-stone-900 border-stone-600 text-white px-6 pb-1 rounded self-end transition-all hover:bg-purple-800 hover:bg-opacity-10 hover:border-purple-800 h-[19rem] text-xl duration-200 font-semibold relative flex justify-center items-center flex-col select-none'>
			<h2>{data.title}</h2>
			<p className='mt-2 text-sm text-stone-400'>{data.description}</p>

			<div className='absolute flex items-center gap-2 bottom-4 right-4'>
				<button type='button' onClick={handleClick}>
					<PencilLine
						size={40}
						color='#3b82f6'
						className='p-2 transition-all bg-blue-500 rounded-full cursor-pointer bg-opacity-15 hover:bg-opacity-25'
					/>
				</button>
				<Trash
					size={40}
					color='#ef4444 '
					className='p-2 transition-all bg-red-500 rounded-full cursor-pointer bg-opacity-15 hover:bg-opacity-25'
					onClick={() => onDelete(data.id)}
				/>
			</div>
		</div>
	)
}

export default FormCard
