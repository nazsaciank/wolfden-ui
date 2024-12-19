import { FormArrayState, FormControlState, FormGroupState } from "../types"

export type GroupPayload<T extends object = any> =
	| (Partial<FormGroupState[keyof T]> & {
			path?: keyof T
			reset?: boolean
	  })
	| FormGroupState

export type ArrayPayload<T extends object = any> = (GroupPayload & { at: number }) | FormArrayState<T>

export function formControl(state: FormControlState, payload: Partial<FormControlState>) {
	return {
		...state,
		...payload,
	}
}

export function formGroup<T extends object = any>(state: FormGroupState<T>, payload: GroupPayload) {
	const { path, ...body } = payload
	if (path) {
		return {
			...state,
			[path as keyof FormGroupState<T>]: {
				...state[path as keyof FormGroupState<T>],
				...body,
			},
		}
	}
	return payload as FormGroupState<T>
}

export function formArray<T extends object = any>(state: FormArrayState<T>, payload: ArrayPayload<T>): FormArrayState<T> {
	if (payload instanceof Array) {
		return payload
	}
	const { at, ...body } = payload
	if (at !== undefined) {
		return state.map((item, index) => {
			if (index !== at) return item
			const { path, ...value } = body
			if (path) {
				return {
					...item,
					[path as keyof FormGroupState<T>]: {
						...item[path as keyof FormGroupState<T>],
						...value,
					},
				}
			}
			return {
				...item,
				...body,
			}
		})
	}
	return state
}
