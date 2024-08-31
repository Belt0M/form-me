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
		verifyToken: builder.mutation<{username: string}, string>({
			query: token => ({
				url: '/verify-token',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				invalidatesTags: ['Forms'],
			}),
		}),
	}),
})

export const {useLoginMutation, useRegisterMutation, useVerifyTokenMutation} =
	authApi
