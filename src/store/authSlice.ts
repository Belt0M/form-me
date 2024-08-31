import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface AuthState {
	isAuthenticated: boolean
	email: string | null
	token: string | null
}

const initialState: AuthState = {
	isAuthenticated: false,
	email: null,
	token: localStorage.getItem('token') || null,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<{email: string; token: string}>) {
			state.isAuthenticated = true
			state.email = action.payload.email
			state.token = action.payload.token
			localStorage.setItem('token', action.payload.token)
		},
		logout(state) {
			state.isAuthenticated = false
			state.email = null
			state.token = null
			localStorage.removeItem('token')
		},
	},
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer
