import {Check, X} from '@phosphor-icons/react'
import clsx from 'clsx'
import {FC} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Logo from '../assets/img/logo.png'
import {useAppDispatch, useAppSelector} from '../hooks/storeHook'
import {logout} from '../store/authSlice'
import UserMenu from './modals/UserMenu'

interface RequirementIndicatorProps {
	label: string
	isCompleted: boolean
}

const RequirementIndicator: React.FC<RequirementIndicatorProps> = ({
	label,
	isCompleted,
}) => (
	<div className='flex items-center gap-2 select-none'>
		<div className={isCompleted ? 'text-green-500' : 'text-red-500'}>
			{isCompleted ? (
				<Check weight='bold' size={22} />
			) : (
				<X weight='bold' size={20} />
			)}
		</div>
		<span
			className={clsx(
				isCompleted && 'line-through',
				'text-sm text-stone-300 mt-1'
			)}
		>
			{label}
		</span>
	</div>
)

interface Props {
	actions?: React.ReactNode
	hasInput?: boolean
	hasSubmitButton?: boolean
}

const Header: FC<Props> = ({actions, hasInput, hasSubmitButton}) => {
	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleLogout = () => {
		dispatch(logout())
		navigate('/auth')
	}

	return (
		<header
			className={clsx(
				actions
					? 'border-lightGray border-b-2'
					: 'border-b-purple-800 border-b',
				'flex items-center justify-between px-5 py-2 font-bold bg-stone-900'
			)}
		>
			<Link
				to='/'
				className='flex items-center w-1/5 text-lg text-white'
				draggable={false}
			>
				<img src={Logo} alt='Logo' className='h-16' draggable={false} />
				Form...me
			</Link>
			{hasInput != undefined && (
				<div className='flex gap-4'>
					<RequirementIndicator
						label='At least one input'
						isCompleted={!!hasInput}
					/>
					<RequirementIndicator
						label='Submit button'
						isCompleted={!!hasSubmitButton}
					/>
				</div>
			)}
			<div className='flex items-center justify-end w-1/5 gap-8 pr-4'>
				<div className='flex gap-3'>{actions}</div>
				{isAuthenticated && <UserMenu onLogout={handleLogout} />}
			</div>
		</header>
	)
}

export default Header
