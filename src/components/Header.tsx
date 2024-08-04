import React from 'react'
import {Link} from 'react-router-dom'
import Logo from '../assets/img/logo.png'

interface Props {
	actions?: React.ReactNode
}

const Header: React.FC<Props> = ({actions}) => {
	return (
		<header className='p-2 flex justify-between items-center border-b border-b-purple-800 font-bold'>
			<Link to='/' className='text-white text-lg flex items-center'>
				<img src={Logo} alt='Logo' className='h-16' />
				Form...me
			</Link>
			<div>{actions}</div>
		</header>
	)
}

export default Header
