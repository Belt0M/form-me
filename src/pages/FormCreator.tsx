import React from 'react'
import Canvas from '../components/creator/Canvas'
import Sidebar from '../components/creator/Sidebar'
import Header from '../components/Header'

const FormCreator: React.FC = () => {
	return (
		<>
			<Header
				actions={
					<button className='bg-blue-500 text-white p-2 rounded'>
						Export Form
					</button>
				}
			/>
			<Sidebar />
			<Canvas />
		</>
	)
}

export default FormCreator
