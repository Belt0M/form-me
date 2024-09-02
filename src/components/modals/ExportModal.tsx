import {Check, Clipboard} from '@phosphor-icons/react'
import React, {useState} from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atomOneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {Bounce, toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ExportModalProps {
	onClose: () => void
	exportedCode: string
}

const ExportModal: React.FC<ExportModalProps> = ({onClose, exportedCode}) => {
	const [isCopied, setIsCopied] = useState<boolean>(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(exportedCode)

		toast('The code was successfully copied to the clipboard!', {
			position: 'top-center',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			type: 'success',
			style: {padding: '0.5rem'},
			draggable: true,
			progress: undefined,
			theme: 'dark',
			transition: Bounce,
		})

		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, 2600)
	}

	return (
		<section className='fixed inset-0 flex flex-col items-center z-[1000] bg-dark canvas-grid'>
			<header className='w-full px-6 pt-3.5 pb-4 bg-stone-800 border-b-2 border-pink-600 border-opacity-70'>
				<h1 className='text-xl font-bold'>Form Export</h1>
				<p className='mt-2 text-sm italic font-bold text-stone-400'>
					Here you will find the source code that you can copy and paste into
					your project
				</p>
			</header>

			<div className='relative w-2/3 h-full max-h-full p-4 my-12 overflow-y-auto rounded-xl bg-stone-700'>
				<SyntaxHighlighter
					language='xml'
					style={atomOneDark}
					customStyle={{
						padding: '.7rem 1rem',
						fontSize: '12px',
						height: '100%',
						width: '100%',
					}}
					showLineNumbers
				>
					{exportedCode}
				</SyntaxHighlighter>
				<button
					className='absolute flex items-center justify-center text-white transition-all bg-blue-600 border-2 border-blue-700 rounded-lg w-11 h-11 bg-opacity-20 bottom-11 right-7 hover:enabled:bg-blue-700 disabled:border-green-600 disabled:bg-green-600'
					disabled={isCopied}
					onClick={handleCopy}
				>
					{isCopied ? (
						<Check size={20} weight='bold' />
					) : (
						<Clipboard size={17} weight='bold' />
					)}
				</button>
			</div>

			<button
				className='absolute p-2 text-white transition-all bg-red-500 rounded-full top-4 right-3.5 hover:brightness-75 '
				onClick={onClose}
			></button>
			<ToastContainer
				position='top-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
				transition={Bounce}
			/>
		</section>
	)
}

export default ExportModal
