import React, {useState} from 'react'

interface Props {
	onSelectUrl: (url: string) => void
	onClose: () => void
}

const ImageModal: React.FC<Props> = ({onSelectUrl, onClose}) => {
	const [url, setUrl] = useState<string>('')

	const handleSubmit = () => {
		if (url) {
			onSelectUrl(url)
		}

		onClose()
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='relative w-1/3 py-8 border-2 border-gray-400 rounded shadow-lg px-7 bg-dark'>
				<h3 className='mb-4 text-lg font-semibold'>Enter Image URL</h3>
				<input
					type='text'
					className='w-full p-2 border border-gray-300 rounded'
					value={url}
					onChange={e => setUrl(e.target.value)}
					placeholder='https://example.com/image.jpg'
				/>
				<div className='flex justify-end mt-4'>
					<button
						className='absolute p-2 text-white transition-all bg-red-500 rounded-full top-4 right-3.5 hover:brightness-75'
						onClick={onClose}
					></button>
					<button
						className='px-6 pt-3 pb-2 mt-4 text-white bg-blue-600 rounded'
						onClick={handleSubmit}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	)
}

export default ImageModal
