import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {RootState} from './store'

export interface Form {
	id: string
	title: string
	description: string
	content: string
}

export type CreateFormRequest = Omit<Form, 'id'>

export type UpdateFormRequest = Omit<Form, 'description' | 'title'>

export const formsApi = createApi({
	reducerPath: 'formsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3000/',
		prepareHeaders: (headers, {getState}) => {
			const token = (getState() as RootState).auth.token
			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	tagTypes: ['Forms'],
	endpoints: builder => ({
		getForms: builder.query<Form[], void>({
			query: () => '/forms',
			providesTags: () => ['Forms'],
		}),
		getFormById: builder.query<Form, string>({
			query: id => `/forms/${id}`,
		}),
		addForm: builder.mutation<Form, CreateFormRequest>({
			query: newForm => ({
				url: '/forms',
				method: 'POST',
				body: newForm,
			}),
			invalidatesTags: ['Forms'],
		}),
		updateForm: builder.mutation<Form, UpdateFormRequest>({
			query: ({id, content}) => ({
				url: `/forms/${id}`,
				method: 'PUT',
				body: {content},
			}),
			invalidatesTags: ['Forms'],
		}),
		deleteForm: builder.mutation<void, string>({
			query: id => ({
				url: `/forms/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Forms'],
		}),
	}),
})

export const {
	useGetFormsQuery,
	useGetFormByIdQuery,
	useAddFormMutation,
	useUpdateFormMutation,
	useDeleteFormMutation,
} = formsApi
