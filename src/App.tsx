import React from 'react'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import FormCreator from './pages/FormCreator'
import HomePage from './pages/HomePage'

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/form/:id' element={<FormCreator />} />
			</Routes>
		</Router>
	)
}

export default App
