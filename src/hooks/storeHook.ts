// src/hooks.ts
import {
	TypedUseSelectorHook,
	useDispatch as useReduxDispatch,
	useSelector as useReduxSelector,
} from 'react-redux'
import type {AppDispatch, RootState} from '../store/store'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useDispatch: () => AppDispatch = () =>
	useReduxDispatch<AppDispatch>()
