import { StoreApi } from "zustand"
import { AsyncValidatorFn, ControlError, ControlStatus, MaskFn, ParseFn, ValidatorFn } from "./common"

export type FormControlSchema<T = any> = {
	name?: string
	value: T
	isDisabled?: boolean
	isReadonly?: boolean
	isIndeterminate?: boolean
	validators?: ValidatorFn<T>[]
	asyncValidators?: AsyncValidatorFn<T>[]
	mask?: MaskFn
	parse?: ParseFn
}

export type FormControlState<T = any> = {
	schema: FormControlSchema<T>
	name: string | undefined
	value: T
	parsed: T
	isTouched: boolean
	isDirty: boolean
	isDisabled: boolean
	isReadonly: boolean
	isIndeterminate: boolean
	error: ControlError | null
	status: ControlStatus
	validators: ValidatorFn<T>[]
	asyncValidators: AsyncValidatorFn<T>[]
	mask: MaskFn | null
	parse: ParseFn | null
}

export type FormControlAction<T = any> = {
	setValue: (value: T) => void
	reset: () => void
	validate: () => void
	asyncValidate: () => void
	setValidators: (validators: ValidatorFn<T>[]) => void
	setAsyncValidators: (validators: AsyncValidatorFn<T>[]) => void
	clearValidators: () => void
	clearAsyncValidators: () => void
	setError: (error: ControlError | null) => void
	markAsDirty: () => void
	markAsPristine: () => void
	markAsTouched: () => void
	markAsUntouched: () => void
	enable: () => void
	disable: () => void
	readonly: () => void
	readwrite: () => void
	indeterminate: () => void
	undeterminate: () => void
}

export type FormControl<T = any> = FormControlState<T> & FormControlAction<T>

export type ControlStore<T = any> = StoreApi<FormControl<T>>
