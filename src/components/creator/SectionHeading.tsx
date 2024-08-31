import {Minus, Plus} from '@phosphor-icons/react'
import {FC} from 'react'

interface Props {
	isOpen: boolean
	name: string
	onSwitch: (name: string) => void
}

const SectionHeading: FC<Props> = ({isOpen, name, onSwitch}) => {
	return (
		<div
			className='flex justify-between cursor-pointer'
			onClick={() => onSwitch(name)}
		>
			<span className='text-white'>
				{name[0].toUpperCase() + name.slice(1)}
			</span>
			<span className='text-stone-400'>
				{isOpen ? (
					<Minus size={16} weight='bold' />
				) : (
					<Plus size={16} weight='bold' />
				)}
			</span>
		</div>
	)
}

export default SectionHeading
