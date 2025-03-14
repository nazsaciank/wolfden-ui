import { StoreApi } from "zustand"
import { ControlError, ControlStatus } from "./common"
import { ControlStore, FormControl, FormControlSchema } from "./control"

export type FormGroupSchema<T = any> = {
	[K in keyof T]: FormControlSchema<T[K]>
}

export type AbstractControl<T extends object = any> = {
	[K in keyof T]: ControlStore<T[K]>
}

export type AbstractError<T extends Object = any> = {
	[K in keyof T]?: ControlError
}

export type FormGroupState<T extends Object = any> = {
	schema: FormGroupSchema<T>
	controls: AbstractControl<T>

	values: T
	errors: AbstractError<T>
	status: ControlStatus

	isValid: boolean
	isInvalid: boolean
	isPending: boolean

	isAllTouched: boolean
}

export type FormGroupAction<T extends Object = any> = {
	get: (path: keyof T) => FormControl<T[keyof T]>
	add: <T>(name: string, schema: FormControlSchema<T>) => void
	remove: (path: keyof T) => void

	setValues: (values: Partial<T>) => void
	reset: () => void
	validate: () => void
	asyncValidate: () => void

	markAsDirty: () => void
	markAsPristine: () => void
	markAsTouched: () => void
	markAsUntouched: () => void

	toJSON: () => T
	toForm: () => FormData
	toUrlEncoded: () => string
}

export type FormGroup<T extends Object = any> = Readonly<FormGroupState<T>> & FormGroupAction<T>

export type FormGroupStore<T extends Object = any> = StoreApi<FormGroup<T>>
