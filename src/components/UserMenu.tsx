import {FC, useRef, useState} from 'react'
import {useAppSelector} from '../hooks/storeHook'
import useClickOutsideCommon from '../hooks/useClickOutsideCommon'

interface Props {
	onLogout: () => void
}

const UserMenu: FC<Props> = ({onLogout}) => {
	const user = useAppSelector(state => state.auth.user)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useClickOutsideCommon(menuRef, () => setIsMenuOpen(false))

	const handleToggleMenu = () => {
		setIsMenuOpen(prev => !prev)
	}

	const firstLetter = user ? user.charAt(0).toUpperCase() : ''

	return (
		<div className='relative' ref={menuRef}>
			<button
				onClick={handleToggleMenu}
				className='flex items-center justify-center w-11 h-11 text-white bg-gray-800 rounded-full px-[1px] font-normal hover:brightness-110 transition-all'
			>
				{firstLetter}
			</button>
			{isMenuOpen && (
				<button
					onClick={onLogout}
					className='absolute right-0 w-32 mt-3 bg-white rounded-md shadow-lg px-4 pt-2 pb-[0.55rem] text-sm text-left text-gray-700 hover:brightness-90'
				>
					Logout
				</button>
			)}
		</div>
	)
}

export default UserMenu
