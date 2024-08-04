import {StackPlus} from '@phosphor-icons/react'
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {addForm, deleteForm} from '../store/formSlice'
import {RootState} from '../store/store'
import {ICreateForm} from '../types/ICreateForm'
import CreateFormPopup from './CreateFormPopup'
import FormCard from './FormCard'

const defaultFormData: ICreateForm = {name: '', desc: ''}

const HomeScreen: React.FC = () => {
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [formData, setFormData] = useState<ICreateForm>(defaultFormData)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const forms = useSelector((state: RootState) => state.forms.forms)

	const openPopup = () => {
		setIsPopupOpen(true)
	}

	const closePopup = () => {
		setIsPopupOpen(false)
		setFormData(defaultFormData)
	}

	const handleFormCreate = () => {
		const formId = crypto.randomUUID()
		dispatch(
			addForm({
				id: formId,
				name: formData.name,
				description: formData.desc,
				components: [],
			})
		)
		navigate(`/form/${formId}`)
		closePopup()
	}

	const handleFormDelete = (id: string) => {
		dispatch(deleteForm(id))
	}

	return (
		<main className='py-12 px-24 flex flex-col'>
			<h1 className='font-bold text-4xl'>All Your Forms</h1>
			<div className='my-6 w-full h-[0.05rem] bg-purple-800' />

			<section className='grid grid-cols-3 gap-6'>
				<button
					onClick={openPopup}
					className='border bg-stone-900 border-stone-600 text-white rounded self-end transition-all hover:bg-purple-800 hover:bg-opacity-10 hover:text-purple-800 hover:border-purple-800 h-[19rem] text-xl duration-200 font-semibold grid place-items-center'
				>
					<StackPlus size={45} className='mb-1.5' />
				</button>

				{forms.map(form => (
					<FormCard data={form} onDelete={handleFormDelete} key={form.id} />
				))}
			</section>

			{isPopupOpen && (
				<CreateFormPopup
					data={formData}
					setData={setFormData}
					onClose={closePopup}
					onCreate={handleFormCreate}
				/>
			)}
		</main>
	)
}

export default HomeScreen
