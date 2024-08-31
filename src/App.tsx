import React, {useEffect, useState} from 'react'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import AuthModal from './components/AuthModal'
import {useAppDispatch, useAppSelector} from './hooks/storeHook'
import FormCreator from './pages/FormCreator'
import HomePage from './pages/HomePage'
import {useVerifyTokenMutation} from './store/auth.api'
import {login} from './store/authSlice'

const App: React.FC = () => {
	const dispatch = useAppDispatch()
	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [verifyToken] = useVerifyTokenMutation()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token && !isAuthenticated) {
			verifyToken(token).then(response => {
				if ('data' in response && response.data) {
					dispatch(login({token, username: response.data.username}))
				} else {
					setIsModalOpen(true)
				}
			})
		} else {
			setIsModalOpen(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	console.log(isModalOpen)

	return (
		<Router>
			<Routes>
				<Route path='/' element={isAuthenticated ? <HomePage /> : null} />
				<Route
					path='/form/:id'
					element={isAuthenticated ? <FormCreator /> : null}
				/>
			</Routes>
			{isModalOpen && <AuthModal onClose={handleCloseModal} />}
		</Router>
	)
}

export default App
