import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {authApi} from './auth.api'
import {authSlice} from './authSlice'
import {formSlice} from './formSlice'
import {formsApi} from './forms.api'

const rootReducer = combineReducers({
	[authApi.reducerPath]: authApi.reducer,
	[formsApi.reducerPath]: formsApi.reducer,
	[authSlice.name]: authSlice.reducer,
	[formSlice.name]: formSlice.reducer,
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({serializableCheck: false})
			.concat(authApi.middleware)
			.concat(formsApi.middleware),
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
