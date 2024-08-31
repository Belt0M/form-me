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

export interface Form {
	id: number
	title: string
	description: string
	content: string
	userId: number
}

export interface NewFormRequest {
	title: string
	description: string
	content: string
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
		getForms: builder.query<Form[], void>({
			query: () => '/forms',
		}),
		addForm: builder.mutation<Form, NewFormRequest>({
			query: newForm => ({
				url: '/forms',
				method: 'POST',
				body: newForm,
			}),
		}),
		getFormById: builder.query<Form, number>({
			query: id => `/forms/${id}`,
		}),
		updateForm: builder.mutation<Form, {id: number; data: Partial<Form>}>({
			query: ({id, data}) => ({
				url: `/forms/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		deleteForm: builder.mutation<{success: boolean}, number>({
			query: id => ({
				url: `/forms/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
})

export const {
	useLoginMutation,
	useRegisterMutation,
	useGetFormsQuery,
	useAddFormMutation,
	useGetFormByIdQuery,
	useUpdateFormMutation,
	useDeleteFormMutation,
} = authApi
