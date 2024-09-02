/* eslint-disable no-mixed-spaces-and-tabs */
import {StackPlus} from '@phosphor-icons/react'
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAppSelector} from '../hooks/storeHook'
import {
	useAddFormMutation,
	useDeleteFormMutation,
	useGetFormsQuery,
} from '../store/forms.api'
import {ICreateForm} from '../types/ICreateForm'
import {IForm} from '../types/IForm'
import FormCard from './FormCard'
import CreateFormPopup from './modals/CreateFormPopup'

const defaultFormData: ICreateForm = {title: '', description: ''}

const HomeScreen: React.FC = () => {
	const {data: forms, refetch} = useGetFormsQuery()
	const [addForm] = useAddFormMutation()
	const [deleteForm] = useDeleteFormMutation()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [formData, setFormData] = useState<ICreateForm>(defaultFormData)
	const navigate = useNavigate()
	const email = useAppSelector(state => state.auth.email)

	useEffect(() => {
		if (email?.length) {
			refetch()
		}
	}, [email, refetch])

	const openPopup = () => setIsPopupOpen(true)
	const closePopup = () => {
		setIsPopupOpen(false)
		setFormData(defaultFormData)
	}

	const handleFormCreate = async () => {
		const newForm = await addForm({...formData, content: ''}).unwrap()
		closePopup()
		navigate(`/form/${newForm.id}`, {state: {content: newForm.content}})
	}

	const handleFormDelete = async (id: string) => {
		await deleteForm(id).unwrap()
	}

	const formattedForms: IForm[] | null = forms
		? forms.map(form => {
				const {content, ...formWithoutContent} = form
				const newForm = {
					...formWithoutContent,
					components: content.length ? JSON.parse(content) : [],
				}

				return newForm
		  })
		: null

	return (
		<main className='flex flex-col px-24 py-12'>
			<h1 className='text-4xl font-bold'>All Your Forms</h1>
			<div className='my-6 w-full h-[0.05rem] bg-purple-800' />
			<section className='grid grid-cols-3 gap-6'>
				<button
					onClick={openPopup}
					className='border bg-stone-900 border-stone-600 text-white rounded self-end transition-all hover:bg-purple-800 hover:bg-opacity-10 hover:text-purple-800 hover:border-purple-800 h-[19rem] text-xl duration-200 font-semibold grid place-items-center'
				>
					<StackPlus size={45} className='mb-1.5' />
				</button>
				{formattedForms?.map(form => (
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
