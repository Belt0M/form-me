import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {Bounce, toast, ToastContainer} from 'react-toastify'
import {useAppDispatch} from '../hooks/storeHook'
import {useLoginMutation, useRegisterMutation} from '../store/auth.api'
import {login as loginAction} from '../store/authSlice'

const AuthPage = () => {
	const [isRegister, setIsRegister] = useState(false)
	const [formData, setFormData] = useState({username: '', password: ''})
	const [errors, setErrors] = useState<string[]>([])

	const dispatch = useAppDispatch()

	const [login, {isLoading: isLoginLoading, isError: isLoginError}] =
		useLoginMutation()
	const [register, {isLoading: isRegisterLoading, isError: isRegisterError}] =
		useRegisterMutation()

	const handleSwitchMode = () => setIsRegister(!isRegister)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setFormData(prev => ({...prev, [name]: value}))
	}

	const handleSubmit = async () => {
		const newErrors = []

		if (formData.username.length < 3) {
			newErrors.push('Username must be at least 3 characters long.')
		}

		if (formData.password.length < 6) {
			newErrors.push('Password must be at least 6 characters long.')
		}

		setErrors(newErrors)

		if (newErrors.length === 0) {
			let response = null

			if (isRegister) {
				response = await register(formData)
			} else {
				response = await login(formData)
			}

			if (
				'data' in response &&
				response.data &&
				'token' in response.data &&
				response.data.token &&
				'username' in response.data &&
				response.data.username
			) {
				handleLogin(response.data.token, response.data.username as string)
			}
		}
	}

	const handleLogin = (token: string, username: string) => {
		if (token && username) {
			toast.success(
				isRegister ? 'Registration successful!' : 'Login successful!'
			)

			setTimeout(() => {
				dispatch(loginAction({token, username}))
			}, 1500)
		}
	}

	useEffect(() => {
		if (isLoginError || isRegisterError) {
			toast.error('Incorrect login or password')
		}
	}, [isLoginError, isRegisterError])

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
			<ToastContainer
				position='top-center'
				autoClose={1500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
				transition={Bounce}
			/>
			<div className='relative py-8 border-2 border-gray-400 rounded shadow-lg px-7 bg-dark'>
				<h3 className='mb-4 text-lg font-bold uppercase'>
					{isRegister ? 'Register' : 'Login'}
				</h3>
				<input
					type='text'
					placeholder='Username'
					name='username'
					value={formData.username}
					onChange={handleChange}
					className='w-full p-2 mb-2 text-white rounded bg-stone-700'
				/>
				<input
					type='password'
					placeholder='Password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					className='w-full p-2 mb-4 text-white rounded bg-stone-700'
				/>
				{errors.length > 0 && (
					<ul className='mb-4 text-sm text-red-500'>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
				<button
					className={clsx(
						'mb-2 w-full p-2 rounded text-white',
						isRegister ? 'bg-green-500' : 'bg-blue-500',
						(isLoginLoading || isRegisterLoading) && 'cursor-not-allowed'
					)}
					onClick={handleSubmit}
					disabled={isLoginLoading || isRegisterLoading}
				>
					{isRegister ? 'Register' : 'Login'}
				</button>
				<button
					className='w-full p-2 mb-2 text-white bg-gray-500 rounded'
					onClick={handleSwitchMode}
				>
					{isRegister ? 'Switch to Login' : 'Switch to Register'}
				</button>
			</div>
		</div>
	)
}

export default AuthPage
