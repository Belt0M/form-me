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
		<div className='relative flex items-center justify-center min-h-screen bg-[#575968]'>
			<div className='relative w-1/3 p-10 shadow-custom bg-dark-700 rounded-xl bg-gradient-to-tr from-[#2f313f] to-[#555665] from-[20%]'>
				<h2 className='mb-4 text-3xl font-semibold text-white'>
					{isRegister ? 'Create new account' : 'Log in'}
				</h2>
				<p className='mb-6 text-sm text-gray-400'>
					{isRegister ? 'Already have an account? ' : "Don't have an account? "}
					<span
						className='text-blue-500 cursor-pointer'
						onClick={handleSwitchMode}
					>
						{isRegister ? 'Log in' : 'Sign up'}
					</span>
				</p>
				<div className='space-y-4'>
					{isRegister && (
						<div className='flex gap-4'>
							<input
								type='text'
								placeholder='First Name'
								name='firstName'
								className='flex-1 px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
								onChange={handleChange}
							/>
							<input
								type='text'
								placeholder='Last Name'
								name='lastName'
								className='flex-1 px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
								onChange={handleChange}
							/>
						</div>
					)}
					<input
						type='email'
						placeholder='Email'
						name='email'
						value={formData.username}
						onChange={handleChange}
						className='w-full px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
					/>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						className='w-full px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
					/>
				</div>
				{errors.length > 0 && (
					<ul className='mt-4 mb-4 text-sm text-red-500'>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
				<div className='flex items-center justify-between mt-6'>
					<button
						className={clsx(
							'px-6 py-3 pt-[0.9rem] rounded bg-blue-600 text-white font-semibold',
							isLoginLoading || isRegisterLoading
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-blue-700'
						)}
						onClick={handleSubmit}
						disabled={isLoginLoading || isRegisterLoading}
					>
						{isRegister ? 'Create account' : 'Log in'}
					</button>
				</div>
			</div>
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
		</div>
	)
}

export default AuthPage
