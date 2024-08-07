import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/img/logo.png'

interface Props {
	actions?: React.ReactNode
}

const Header: React.FC<Props> = ({actions}) => {
	return (
		<header className='flex items-center justify-between px-5 py-2 font-bold border-b border-b-purple-800 bg-stone-900'>
			<Link to='/' className='flex items-center text-lg text-white'>
				<img src={Logo} alt='Logo' className='h-16' />
				Form...me
			</Link>
			<div>{actions}</div>
		</header>
	)
}

export default Header
