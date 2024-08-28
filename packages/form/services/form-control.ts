import { Dispatch } from "react"
import { AsyncValidatorFn, FormControlState, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"

type ControlOptions<T = any> = {
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

export function setValue<T = any>({ state, dispatch, debounce, validators, asyncValidators, mask, parse }: ControlOptions<T>) {
	return function (value: T) {
		if (state.isDisabled) return

		let masked = mask ? mask(value, state.value) : value
		let parsed = parse ? parse(value) : value

		dispatch({ value: masked, parsed })
		if (!state.isDirty) dispatch({ isDirty: true })

		let error: ValidatorError | null = null
		for (const validator of validators) {
			let result = validator(parsed)
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
				let result = await validator(parsed)
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

export function validate({ state, dispatch, validators }: Pick<ControlOptions, "state" | "dispatch" | "validators">) {
	return function () {
		let error: ValidatorError | null = null
		for (const validator of validators) {
			let result = validator(state.parsed)
			if (!result) continue
			error = result
			break
		}

		dispatch({ error, status: error ? "INVALID" : "VALID" })
	}
}

export function asyncValidate({ state, dispatch, asyncValidators, debounce }: Pick<ControlOptions, "state" | "dispatch" | "asyncValidators" | "debounce">) {
	return function () {
		if (state.error || asyncValidators.length === 0) return

		if (state.status !== "PENDING") dispatch({ status: "PENDING" })
		debounce(async () => {
			let error: ValidatorError | null = null
			for await (const validator of asyncValidators) {
				let result = await validator(state.parsed)
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
