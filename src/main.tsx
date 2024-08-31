import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import RootApp from './App'
import './index.css'
import {store} from './store/store'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container!)

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<RootApp />
		</Provider>
	</React.StrictMode>
)
