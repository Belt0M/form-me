import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

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

export const formsApi = createApi({
	reducerPath: 'formsApi',
	baseQuery: fetchBaseQuery({baseUrl: '/api'}),
	endpoints: builder => ({
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
	useGetFormsQuery,
	useAddFormMutation,
	useGetFormByIdQuery,
	useUpdateFormMutation,
	useDeleteFormMutation,
} = formsApi
