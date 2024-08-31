import {SpinnerGap} from '@phosphor-icons/react'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {Bounce, toast, ToastContainer} from 'react-toastify'
import {useAppDispatch} from '../hooks/storeHook'
import {
	RegisterRequest,
	useLoginMutation,
	useRegisterMutation,
} from '../store/auth.api'
import {login as loginAction} from '../store/authSlice'

const defaultFormData: RegisterRequest = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
}

const AuthPage = () => {
	const [isRegister, setIsRegister] = useState(false)
	const [formData, setFormData] = useState<RegisterRequest>(defaultFormData)
	const [emailError, setEmailError] = useState<string | null>(null)
	const [passwordValidation, setPasswordValidation] = useState({
		length: false,
		uppercase: false,
		specialChar: false,
		number: false,
	})

	const dispatch = useAppDispatch()

	const [login, {isLoading: isLoginLoading, isError: isLoginError}] =
		useLoginMutation()
	const [register, {isLoading: isRegisterLoading, isError: isRegisterError}] =
		useRegisterMutation()

	const handleSwitchMode = () => {
		setFormData(defaultFormData)
		setEmailError(null)
		setIsRegister(!isRegister)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setFormData(prev => ({...prev, [name]: value}))

		if (name === 'password') {
			validatePassword(value)
		}
	}

	const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.target.name === 'email') {
			const response = await fetch('http://localhost:3000/check-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({email: formData.email}),
			})

			const data = await response.json()
			if (!response.ok) {
				setEmailError(data.error)
			} else {
				setEmailError(null)
			}
		}
	}

	const validatePassword = (password: string) => {
		const length = password.length >= 8
		const uppercase = /[A-Z]/.test(password)
		const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		const number = /\d/.test(password)

		setPasswordValidation({
			length,
			uppercase,
			specialChar,
			number,
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault() // Запобігає перезавантаженню сторінки
		let response = null

		if (isRegister) {
			response = await register(formData)
		} else {
			response = await login({
				email: formData.email,
				password: formData.password,
			})
		}

		if (
			'data' in response &&
			response.data &&
			'email' in response.data &&
			response.data.email &&
			'token' in response.data &&
			response.data.token
		) {
			handleLogin(response.data.token as string, response.data.email as string)
		}
	}

	const handleLogin = (token: string, email: string) => {
		if (token && email) {
			toast.success(
				isRegister ? 'Registration successful!' : 'Login successful!'
			)

			setTimeout(() => {
				dispatch(loginAction({token, email}))
			}, 1500)
		}
	}

	useEffect(() => {
		if (isLoginError || isRegisterError) {
			toast.error('Incorrect login or password')
		}
	}, [isLoginError, isRegisterError])

	const getIsValidPassword = (): boolean => {
		const {length, number, specialChar, uppercase} = passwordValidation

		return length && number && specialChar && uppercase
	}

	function getIsValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		return emailRegex.test(email)
	}

	const getIsButtonDisabled = (): boolean => {
		const {email, firstName, lastName, password} = formData
		const isValidEmail = getIsValidEmail(email)
		let result = false

		if (isRegister) {
			const isValidPassword = getIsValidPassword()

			if (
				isValidPassword &&
				isValidEmail &&
				firstName.length &&
				lastName.length
			) {
				result = true
			}
		} else {
			if (isValidEmail && password.length) {
				result = true
			}
		}

		return !result
	}

	return (
		<div className='relative flex items-center justify-center min-h-screen bg-[#575968]'>
			<form
				className='relative w-1/3 min-w-[30rem] p-10 shadow-custom bg-dark-700 rounded-xl bg-gradient-to-tr from-[#2f313f] to-[#555665] from-[20%]'
				onSubmit={handleSubmit}
			>
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
						value={formData.email}
						onChange={handleChange}
						onBlur={isRegister ? handleBlur : () => {}}
						className='w-full px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
					/>
					{emailError && (
						<div className='text-sm text-red-500'>{emailError}</div>
					)}
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						className='w-full px-3 pb-2.5 pt-[0.8rem] text-white placeholder-gray-500 bg-[#282a37] rounded focus:outline-none focus:border-blue-500 border-opacity-50 border-2 border-transparent'
					/>
					{isRegister && formData.password.length > 0 && (
						<div className='mt-2 space-y-1'>
							<div
								className={clsx(
									'flex items-center',
									passwordValidation.length ? 'text-blue-500' : 'text-red-500'
								)}
							>
								<span
									className={clsx(
										'mr-2 h-1.5 w-1.5 rounded-full mb-[0.2rem]',
										passwordValidation.length ? 'bg-blue-500' : 'bg-red-500'
									)}
								/>
								At least 8 characters
							</div>
							<div
								className={clsx(
									'flex items-center',
									passwordValidation.uppercase
										? 'text-blue-500'
										: 'text-red-500'
								)}
							>
								<span
									className={clsx(
										'mr-2 h-1.5 w-1.5 rounded-full  mb-[0.2rem]',
										passwordValidation.uppercase ? 'bg-blue-500' : 'bg-red-500'
									)}
								/>
								At least one uppercase letter
							</div>
							<div
								className={clsx(
									'flex items-center',
									passwordValidation.specialChar
										? 'text-blue-500'
										: 'text-red-500'
								)}
							>
								<span
									className={clsx(
										'mr-2 h-1.5 w-1.5 rounded-full  mb-[0.2rem]',
										passwordValidation.specialChar
											? 'bg-blue-500'
											: 'bg-red-500'
									)}
								/>
								At least one special character
							</div>
							<div
								className={clsx(
									'flex items-center',
									passwordValidation.number ? 'text-blue-500' : 'text-red-500'
								)}
							>
								<span
									className={clsx(
										'mr-2 h-1.5 w-1.5 rounded-full mb-[0.2rem]',
										passwordValidation.number ? 'bg-blue-500' : 'bg-red-500'
									)}
								/>
								At least one number
							</div>
						</div>
					)}
				</div>
				<div className='flex items-center justify-between mt-6'>
					<button
						className={clsx(
							isRegister ? 'w-48' : 'w-32',
							' h-12 pt-0.5 font-semibold text-white bg-blue-600 rounded min-w-32 disabled:bg-stone-500 disabled:cursor-not-allowed hover:enabled:bg-blue-700'
						)}
						disabled={
							isLoginLoading || isRegisterLoading || getIsButtonDisabled()
						}
						type='submit'
					>
						{isLoginLoading || isRegisterLoading ? (
							<SpinnerGap size={25} className='mx-auto animate-spin' />
						) : isRegister ? (
							'Create account'
						) : (
							'Log in'
						)}
					</button>
				</div>
			</form>
			<ToastContainer
				position='top-center'
				autoClose={1000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				draggable
				theme='dark'
				transition={Bounce}
			/>
		</div>
	)
}

export default AuthPage
