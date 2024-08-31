import React, {useEffect} from 'react'
import {
	Route,
	BrowserRouter as Router,
	Routes,
	useNavigate,
} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from './hooks/storeHook'
import AuthPage from './pages/AuthPage'
import FormCreator from './pages/FormCreator'
import HomePage from './pages/HomePage'
import {useVerifyTokenMutation} from './store/auth.api'
import {login} from './store/authSlice'

const App: React.FC = () => {
	const dispatch = useAppDispatch()
	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
	const [verifyToken] = useVerifyTokenMutation()
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token && !isAuthenticated) {
			verifyToken(token).then(response => {
				if ('data' in response && response.data) {
					dispatch(login({token, username: response.data.username}))

					navigate('/', {replace: true})
				} else {
					navigate('/auth', {replace: true})
				}
			})
		} else if (!isAuthenticated) {
			navigate('/auth', {replace: true})
		} else {
			navigate('/', {replace: true})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, verifyToken])

	return (
		<Routes>
			<Route path='/auth' element={<AuthPage />} />
			<Route path='/' element={isAuthenticated ? <HomePage /> : null} />
			<Route
				path='/form/:id'
				element={isAuthenticated ? <FormCreator /> : null}
			/>
		</Routes>
	)
}

const RootApp: React.FC = () => {
	return (
		<Router>
			<App />
		</Router>
	)
}

export default RootApp
