import clsx from 'clsx'
import React, {useState} from 'react'

interface AuthModalProps {
	onLogin: (username: string) => void
	onRegister: (username: string) => void
}

const AuthModal: React.FC<AuthModalProps> = ({onLogin, onRegister}) => {
	const [isRegister, setIsRegister] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<string[]>([])

	const handleSwitchMode = () => setIsRegister(!isRegister)

	const handleSubmit = () => {
		const newErrors = []

		if (username.length < 3) {
			newErrors.push('Username must be at least 3 characters long.')
		}

		if (password.length < 6) {
			newErrors.push('Password must be at least 6 characters long.')
		}

		setErrors(newErrors)

		if (newErrors.length === 0) {
			isRegister ? onRegister(username) : onLogin(username)
		}
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
			<div className='relative py-8 border-2 border-gray-400 rounded shadow-lg px-7 bg-dark'>
				<h3 className='mb-4 text-lg font-bold uppercase'>
					{isRegister ? 'Register' : 'Login'}
				</h3>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={e => setUsername(e.target.value)}
					className='w-full p-2 mb-2 text-white rounded bg-stone-700'
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
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
						isRegister ? 'bg-green-500' : 'bg-blue-500'
					)}
					onClick={handleSubmit}
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

export default AuthModal
