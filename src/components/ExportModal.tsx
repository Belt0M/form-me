import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atomOneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface ExportModalProps {
	isOpen: boolean
	onClose: () => void
	exportedCode: string
}

const ExportModal: React.FC<ExportModalProps> = ({
	isOpen,
	onClose,
	exportedCode,
}) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='flex flex-col w-3/4 p-4 rounded shadow-lg bg-dark'>
				<h2 className='mb-4 text-lg font-bold'>Preview</h2>
				<div className='flex justify-center w-full p-4'>
					{/* <div
						className='p-4 overflow-auto border border-gray-300 rounded h-96'
						dangerouslySetInnerHTML={{__html: exportedCode}}
					/> */}
					<div className='w-1/3 h-52'>
						<section
							style={{
								position: 'relative',
								padding: '.5rem',
								width: '100%',
								height: '100%',
								borderColor: '#3c0a6e',
								backgroundColor: '#3c0a6e',
								borderWidth: '2px',
							}}
						>
							<div
								style={{
									position: 'relative',
									padding: '.5rem',
									width: '100%',
									height: '19%',
									borderColor: '#461478',
									backgroundColor: '#461478',
									borderWidth: '2px',
								}}
							></div>
						</section>
					</div>
				</div>

				<div className='w-full text-white'>
					<h2 className='mb-4 text-lg font-bold'>Exported Code</h2>
					<div className='p-4 border border-gray-300 rounded'>
						<SyntaxHighlighter
							language='html'
							style={atomOneDark}
							customStyle={{
								padding: '.7rem 1rem',
								fontSize: '12px',
								height: '10rem',
							}}
							showLineNumbers
						>
							{exportedCode}
						</SyntaxHighlighter>
						<button
							className='px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700'
							onClick={() => navigator.clipboard.writeText(exportedCode)}
						>
							Copy Code
						</button>
					</div>
				</div>

				{/* <button
					onClick={onClose}
					className='absolute text-gray-500 top-2 right-2 hover:text-gray-700'
				>
					&times;
				</button> */}
			</div>
		</div>
	)
}

export default ExportModal
