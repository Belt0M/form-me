import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IForm} from '../types/IForm'

export interface FormsState {
	forms: IForm[]
}

const initialState: FormsState = {
	forms: [],
}

export const formSlice = createSlice({
	name: 'forms',
	initialState,
	reducers: {
		addForm: (state, action: PayloadAction<IForm>) => {
			state.forms.push(action.payload)
		},
		deleteForm: (state, action: PayloadAction<string>) => {
			state.forms = state.forms.filter(form => form.id !== action.payload)
		},
		updateForm: (state, action: PayloadAction<IForm>) => {
			const index = state.forms.findIndex(form => form.id === action.payload.id)
			if (index !== -1) {
				state.forms[index] = action.payload
			}
		},
	},
})

export const {addForm, updateForm, deleteForm} = formSlice.actions
export default formSlice.reducer
