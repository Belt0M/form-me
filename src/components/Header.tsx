import clsx from 'clsx'
import {Link} from 'react-router-dom'
import Logo from '../assets/img/logo.png'

interface RequirementIndicatorProps {
	label: string
	isCompleted: boolean
}

const RequirementIndicator: React.FC<RequirementIndicatorProps> = ({
	label,
	isCompleted,
}) => (
	<div className='flex items-center gap-2'>
		<div
			className={clsx(
				isCompleted ? 'bg-green-500' : 'bg-red-500',
				'w-4 h-4 rounded-full border-2 border-stone-700'
			)}
		></div>
		<span
			className={clsx(isCompleted && 'line-through', 'text-xs text-stone-300')}
		>
			{label}
		</span>
	</div>
)

interface HeaderProps {
	actions?: React.ReactNode
	hasInput?: boolean
	hasSubmitButton?: boolean
}

const Header: React.FC<HeaderProps> = ({
	actions,
	hasInput,
	hasSubmitButton,
}) => {
	return (
		<header className='flex items-center justify-between px-5 py-2 font-bold border-b border-b-purple-800 bg-stone-900'>
			<Link to='/' className='flex items-center w-1/5 text-lg text-white'>
				<img src={Logo} alt='Logo' className='h-16' />
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
			<div className='flex justify-end w-1/5 gap-4 pr-4'>{actions}</div>
		</header>
	)
}

export default Header
