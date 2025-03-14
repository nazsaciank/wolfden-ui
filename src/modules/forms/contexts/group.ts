import { createContext } from "react"
import { createStore } from "zustand"
import { ControlStatus, DebounceMapFn } from "../interfaces/common"
import { AbstractControl, AbstractError, FormGroup, FormGroupSchema, FormGroupStore } from "../interfaces/group"
import { createControl } from "./control"

function createInitialState<T extends object = any>(schema: FormGroupSchema<T>, debounceMap: DebounceMapFn) {
	const debounce = (name: string) => (fn: () => void) => debounceMap(name, fn)

	let controls = {} as AbstractControl<T>
	let values = {} as T
	let errors = {} as AbstractError<T>
	let statuses: ControlStatus[] = []
	for (const name in schema) {
		const controlSchema = schema[name]

		controls[name] = createControl({ ...controlSchema, name }, debounce(name))
		let control = controls[name].getState()

		values[name] = control.value
		errors[name] = control.error
		statuses.push(control.status)
	}

	let status: ControlStatus = "valid"
	if (statuses.some((s) => s === "validating")) status = "validating"
	if (statuses.some((s) => s === "invalid")) status = "invalid"

	return {
		controls,
		values,
		errors,
		status,
		isValid: status === "valid",
		isInvalid: status === "invalid",
		isPending: status === "validating",
		isAllTouched: false,
	}
}

export function formGroup<T extends Object = any>(schema: FormGroupSchema<T>, debounce: DebounceMapFn) {
	const initialState = createInitialState(schema, debounce)

	return createStore<FormGroup<T>>()((set, get) => ({
		schema,
		...initialState,
		// @ts-ignore
		get: (path) => {
			const control = get().controls[path]
			if (!control) throw new Error(`Control "${path as string}" not found`)

			return control.getState()
		},
		add: (name, schema) => {},
		remove: (path) => {},
		setValues: (values) => {},
		reset: () => {},
		validate: () => {},
		asyncValidate: () => {},
		markAsDirty: () => {},
		markAsPristine: () => {},
		markAsTouched: () => {},
		markAsUntouched: () => {},
		toForm: () => new FormData(),
		toUrlEncoded: () => "",
		toJSON: () => ({} as T),
	}))
}

export const FormGroupContext = createContext<FormGroupStore | null>(null)
