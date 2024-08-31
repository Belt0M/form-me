import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export interface User {
	id: number
	username: string
}

export interface AuthResponse {
	token: string
	user: User
}

export interface LoginRequest {
	username: string
	password: string
}

export interface RegisterRequest {
	username: string
	password: string
}

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({baseUrl: '/api'}),
	endpoints: builder => ({
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: credentials => ({
				url: '/auth/login',
				method: 'POST',
				body: credentials,
			}),
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: userData => ({
				url: '/auth/register',
				method: 'POST',
				body: userData,
			}),
		}),
	}),
})

export const {useLoginMutation, useRegisterMutation} = authApi
