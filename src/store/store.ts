import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import formReducer from './formSlice'

export const store = configureStore({
	reducer: {
		forms: formReducer,
		auth: authReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
