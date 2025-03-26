import { Dispatch } from "react"
import { AsyncValidatorFn, FormControlSchema, FormControlState, FormGroupState, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"
import { initialControlState } from "./initial-state"

type ControlOptions<T = any> = {
	group?: FormGroupState
	state: FormControlState<T>
	dispatch: Dispatch<Partial<FormControlState<T>>>
	debounce: (fn: (...args: any[]) => void, ...args: any[]) => void
	validators: ValidatorFn[]
	asyncValidators: AsyncValidatorFn[]
	mask: MaskFn | null
	parse: ParseFn | null
}

export const CONTROL_STATE: FormControlState = {
	name: "",
	value: null,
	parsed: null,
	error: null,
	status: "VALID",
	isDisabled: false,
	isDirty: false,
	isTouched: false,
	isIndeterminate: false,
}

export function setSchema<T = any>({ dispatch, debounce, group, asyncValidators: oldAsyncValidators }: Pick<ControlOptions<T>, "dispatch" | "debounce" | "group" | "asyncValidators">) {
	return function (schema: FormControlSchema<T>) {
		const state = initialControlState("", schema)
		dispatch(state)

		if (state.status === "PENDING") {
			const asyncValidators = schema.asyncValidators || oldAsyncValidators

			debounce(async () => {
				let error: ValidatorError | null = null
				for await (const validator of asyncValidators) {
					let result = await validator(state.parsed, group)
					if (!result) continue
					error = result
					break
				}

				dispatch({ error, status: error ? "INVALID" : "VALID" })
			})
		}
	}
}

export function setValue<T = any>({ group, state, dispatch, debounce, validators, asyncValidators, mask, parse }: ControlOptions<T>) {
	return function (value: T) {
		if (state.isDisabled) return

		let masked = mask ? mask(value, state.value) : value
		let parsed = parse ? parse(value) : value

		dispatch({ value: masked, parsed })
		if (!state.isDirty) dispatch({ isDirty: true })

		let error: ValidatorError | null = null
		for (const validator of validators) {
			let result = validator(parsed, group)
			if (!result) continue
			error = result
			break
		}

		dispatch({ error, status: error ? "INVALID" : "VALID" })
		if (error || asyncValidators.length === 0) return

		dispatch({ status: "PENDING" })
		debounce(async () => {
			let error: ValidatorError | null = null
			for await (const validator of asyncValidators) {
				let result = await validator(parsed, group)
				if (!result) continue
				error = result
				break
			}

			dispatch({ error, status: error ? "INVALID" : "VALID" })
		})
	}
}

export function reset<T = any>({ state, dispatch }: Pick<ControlOptions<T>, "state" | "dispatch">) {
	return function () {
		dispatch({ value: state.value, parsed: state.parsed, error: null, status: "VALID" })
	}
}

export function validate({ group, state, dispatch, validators }: Pick<ControlOptions, "group" | "state" | "dispatch" | "validators">) {
	return function () {
		let error: ValidatorError | null = null
		for (const validator of validators) {
			let result = validator(state.parsed, group)
			if (!result) continue
			error = result
			break
		}

		dispatch({ error, status: error ? "INVALID" : "VALID" })
	}
}

export function asyncValidate({ group, state, dispatch, asyncValidators, debounce }: Pick<ControlOptions, "group" | "state" | "dispatch" | "asyncValidators" | "debounce">) {
	return function () {
		if (state.error || asyncValidators.length === 0) return

		if (state.status !== "PENDING") dispatch({ status: "PENDING" })
		debounce(async () => {
			let error: ValidatorError | null = null
			for await (const validator of asyncValidators) {
				let result = await validator(state.parsed, group)
				if (!result) continue
				error = result
				break
			}

			dispatch({ error, status: error ? "INVALID" : "VALID" })
		})
	}
}

export function setError({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function (error: ValidatorError | null) {
		dispatch({ error, status: error ? "INVALID" : "VALID" })
	}
}

export function disable({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		dispatch({ isDisabled: true })
	}
}

export function enable({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		dispatch({ isDisabled: false })
	}
}

export function markAsDirty({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		return dispatch({ isDirty: true })
	}
}

export function markAsPristine({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		return dispatch({ isDirty: false })
	}
}

export function markAsTouched({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		return dispatch({ isTouched: true })
	}
}

export function markAsUntouched({ dispatch }: Pick<ControlOptions, "dispatch">) {
	return function () {
		return dispatch({ isTouched: false })
	}
}
