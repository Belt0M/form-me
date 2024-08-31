import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
	id: number
	firstName: string
	lastName: string
	email: string
}

export interface AuthResponse {
	token: string
	user: User
}

export interface LoginRequest {
	email: string
	password: string
}

export interface RegisterRequest {
	firstName: string
	lastName: string
	email: string
	password: string
}

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/'}),
	tagTypes: ['Forms'],
	endpoints: builder => ({
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: credentials => ({
				url: '/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['Forms'],
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: userData => ({
				url: '/register',
				method: 'POST',
				body: userData,
			}),
			invalidatesTags: ['Forms'],
		}),
		verifyToken: builder.mutation<{email: string}, string>({
			query: token => ({
				url: '/verify-token',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
			invalidatesTags: ['Forms'],
		}),
		checkEmail: builder.mutation<{message: string}, {email: string}>({
			query: emailData => ({
				url: '/check-email',
				method: 'POST',
				body: emailData,
			}),
		}),
	}),
})

export const {
	useLoginMutation,
	useRegisterMutation,
	useVerifyTokenMutation,
	useCheckEmailMutation,
} = authApi
