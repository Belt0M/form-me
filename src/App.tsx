import React, {useState} from 'react'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import AuthModal from './components/AuthModal'
import {useAppSelector} from './hooks/storeHook'
import FormCreator from './pages/FormCreator'
import HomePage from './pages/HomePage'

const App: React.FC = () => {
	const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(!isAuthenticated)

	const handleCloseModal = () => setIsModalOpen(false)

	return (
		<Router>
			<Routes>
				<Route path='/' element={isAuthenticated ? <HomePage /> : null} />
				<Route
					path='/form/:id'
					element={isAuthenticated ? <FormCreator /> : null}
				/>
			</Routes>
			{isModalOpen && <AuthModal onClose={handleCloseModal} />}
		</Router>
	)
}

export default App
