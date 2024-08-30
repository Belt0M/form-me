import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import AuthModal from './components/AuthModal'
import FormCreator from './pages/FormCreator'
import HomePage from './pages/HomePage'
import {login} from './store/authSlice'
import {RootState} from './store/store'

const App: React.FC = () => {
	const dispatch = useDispatch()
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(!isAuthenticated)

	const handleLogin = (username: string) => {
		dispatch(login(username))
		setIsModalOpen(false)
	}

	const handleRegister = (username: string) => {
		dispatch(login(username))

		setIsModalOpen(false)
	}

	// const handleLogout = () => {
	// 	dispatch(logout())
	// 	setIsModalOpen(true)
	// }

	return (
		<Router>
			<Routes>
				<Route path='/' element={isAuthenticated ? <HomePage /> : null} />
				<Route
					path='/form/:id'
					element={isAuthenticated ? <FormCreator /> : null}
				/>
			</Routes>
			{isModalOpen && (
				<AuthModal onLogin={handleLogin} onRegister={handleRegister} />
			)}
		</Router>
	)
}

export default App
