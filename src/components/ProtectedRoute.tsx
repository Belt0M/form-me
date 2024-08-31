import React, {useEffect} from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../hooks/storeHook'
import {useVerifyTokenMutation} from '../store/auth.api'
import {login} from '../store/authSlice'

const ProtectedRoute: React.FC = () => {
	const dispatch = useAppDispatch()
	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
	const [verifyToken, {isLoading}] = useVerifyTokenMutation()

	useEffect(() => {
		const token = localStorage.getItem('token')
		console.log('Token found:', token)

		if (token && !isAuthenticated) {
			verifyToken(token).then(response => {
				if ('data' in response && response.data) {
					dispatch(login({token, username: response.data.username}))
				} else {
					console.log('Token verification failed or expired')
				}
			})
		}
	}, [isAuthenticated, verifyToken, dispatch])

	if (!isAuthenticated && !isLoading) {
		console.log('User not authenticated, redirecting to /auth')
		return <Navigate to='/auth' />
	}

	if (isLoading) {
		return <div>Loading...</div> // Показати стан завантаження під час перевірки токена
	}

	console.log('User authenticated, rendering protected route')
	return <Outlet />
}

export default ProtectedRoute
