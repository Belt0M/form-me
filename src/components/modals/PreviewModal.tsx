import { FC } from 'react'
import JsxParser from 'react-jsx-parser'

interface Props {
	onClose: () => void
	exportedCode: string
}

const PreviewModal: FC<Props> = ({onClose, exportedCode}) => {
	return (
		<section className='fixed inset-0 z-[1000] flex flex-col items-center bg-dark canvas-grid'>
			<header className='w-full px-6 pt-3.5 pb-4 bg-stone-800 border-b-2 border-pink-600 border-opacity-70'>
				<h1 className='text-xl font-bold text-white'>Form Preview</h1>
				<p className='mt-2 text-sm italic font-bold text-stone-400'>
					This is what your form will look like to your users.
				</p>
			</header>

			<div className='flex justify-center flex-1 w-2/3 h-full p-4 m-8 rounded-xl bg-stone-700'>
				<JsxParser
					jsx={exportedCode}
					className='flex items-center justify-center w-full h-full'
				/>
			</div>

			<button
				className='absolute p-2 text-white transition-all bg-red-500 rounded-full top-4 right-3.5 hover:brightness-75 '
				onClick={onClose}
			></button>
		</section>
	)
}

export default PreviewModal
