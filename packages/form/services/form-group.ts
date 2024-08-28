import { Dispatch, SetStateAction } from "react"
import { AsyncValidatorFn, FormControl, FormControlSchema, FormControlState, FormGroupState, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"
import * as controller from "./form-control"
import { initialControlState } from "./initial-state"
import { GroupPayload } from "./reducers"

type DebounceMapFn = (path: string, fn: (...args: any[]) => void, ...args: any[]) => void

type GroupOptions<T extends object = any> = {
	state: FormGroupState<T>
	initialState: FormGroupState<T>
	dispatch: Dispatch<GroupPayload>
	debounce: DebounceMapFn
	validators: Record<keyof T, ValidatorFn[]>
	asyncValidators: Record<keyof T, AsyncValidatorFn[]>
	mask: Record<keyof T, MaskFn | null>
	parse: Record<keyof T, ParseFn | null>
}

type ControlOptions<T extends object = any> = {
	setValidators: Dispatch<SetStateAction<Record<keyof T, ValidatorFn[]>>>
	setAsyncValidators: Dispatch<SetStateAction<Record<keyof T, AsyncValidatorFn[]>>>
	setMask: Dispatch<SetStateAction<Record<keyof T, MaskFn | null>>>
	setParse: Dispatch<SetStateAction<Record<keyof T, ParseFn | null>>>
}

function controlDispatch<T extends object = any>(path: keyof T, dispatch: Dispatch<Partial<GroupPayload>>) {
	return function (value: Partial<FormControlState>) {
		dispatch({ path, ...value })
	}
}

function controlDebounce(path: string, debounceMapFn: DebounceMapFn) {
	return function (fn: () => void) {
		debounceMapFn(path, fn)
	}
}

export function setValue<T extends object = any>({ state, dispatch, debounce, validators, asyncValidators, mask, parse }: Omit<GroupOptions<T>, "initialState">) {
	return function (values: Partial<T>) {
		for (const [k, v] of Object.entries(values)) {
			const path = k as keyof T
			let value = v as T[keyof T]
			let control = state[path]
			if (!control) continue

			let _validators = validators[path]
			let _asyncValidators = asyncValidators[path]
			let _mask = mask[path]
			let _parse = parse[path]

			const _controlDispatch = controlDispatch(path, dispatch)
			const _controlDebounce = controlDebounce(path as string, debounce)

			controller.setValue({
				state: control,
				dispatch: _controlDispatch,
				debounce: _controlDebounce,
				validators: _validators,
				asyncValidators: _asyncValidators,
				mask: _mask,
				parse: _parse,
			})(value)
		}
	}
}

export function reset<T extends object = any>({ state, dispatch }: Pick<GroupOptions<T>, "state" | "dispatch">) {
	return function () {
		dispatch(state)
	}
}

export function validate<T extends object = any>({ state, dispatch, validators }: Pick<GroupOptions, "state" | "dispatch" | "validators">) {
	return function () {
		for (const [k, v] of Object.entries(state)) {
			const path = k as keyof T
			const control = v as FormControlState

			let error: ValidatorError | null = null
			for (const validator of validators[path]) {
				let result = validator(control.parsed, state)
				if (!result) continue
				error = result
				break
			}
			dispatch({ path, error, status: error ? "INVALID" : "VALID" })
		}
	}
}

export function asyncValidate<T extends object = any>({ state, dispatch, asyncValidators, debounce }: Pick<GroupOptions, "state" | "dispatch" | "asyncValidators" | "debounce">) {
	return function () {
		for (const [k, v] of Object.entries(state)) {
			const path = k as keyof T
			const control = v as FormControlState

			const _asyncValidators = asyncValidators[path]

			if (control.error || _asyncValidators.length === 0) continue
			if (control.status !== "PENDING") dispatch({ status: "PENDING" })
			debounce(path as string, async () => {
				let error: ValidatorError | null = null
				for await (const validator of _asyncValidators) {
					let result = await validator(control.parsed, state)
					if (!result) continue
					error = result
					break
				}

				dispatch({ path, error, status: error ? "INVALID" : "VALID" })
			})
		}
	}
}

export function add<T extends object = any>({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }: Pick<GroupOptions<T>, "state" | "dispatch"> & ControlOptions<T>) {
	return function (name: string, schema: FormControlSchema) {
		const path = name as keyof T
		if (state[path]) return
		const control = initialControlState(path as string, schema)
		dispatch({ path, ...control })
		setValidators((prev) => ({ ...prev, [path]: schema.validators ?? [] }))
		setAsyncValidators((prev) => ({ ...prev, [path]: schema.asyncValidators ?? [] }))
		setMask((prev) => ({ ...prev, [path]: schema.mask ?? null }))
		setParse((prev) => ({ ...prev, [path]: schema.parse ?? null }))
	}
}

export function remove<T extends object = any>({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }: Pick<GroupOptions<T>, "state" | "dispatch"> & ControlOptions<T>) {
	return function (path: keyof T) {
		let newState = { ...state }
		delete newState[path]
		dispatch(newState)
		setValidators((prev) => {
			delete prev[path]
			return prev
		})
		setAsyncValidators((prev) => {
			delete prev[path]
			return prev
		})
		setMask((prev) => {
			delete prev[path]
			return prev
		})
		setParse((prev) => {
			delete prev[path]
			return prev
		})
	}
}

export function find<T extends object = any>({
	state,
	initialState,
	dispatch: gDispatch,
	debounce: gDebounce,
	validators: gValidators,
	asyncValidators: gAsyncValidators,
	mask: gMask,
	parse: gParse,
	setValidators: gSetValidators,
	setAsyncValidators: gSetAsyncValidators,
	setMask: gSetMask,
	setParse: gSetParse,
}: GroupOptions<T> & ControlOptions<T>) {
	return function (path: keyof T): FormControl<T[keyof T]> | null {
		let control: FormControlState = state[path]
		if (!control) {
			console.warn(`Control at path ${path as string} not found`)
			return null
		}

		let _initialState = initialState && initialState[path] ? initialState[path] : ({ ...controller.CONTROL_STATE, name: path } as FormControlState)
		let validators = gValidators[path]
		let asyncValidators = gAsyncValidators[path]
		let mask = gMask[path]
		let parse = gParse[path]

		const dispatch = controlDispatch(path, gDispatch)
		const debounce = controlDebounce(path as string, gDebounce)

		function setValidators(validators: ValidatorFn[], revalidate: boolean = true) {
			gSetValidators((prev) => ({ ...prev, [path]: validators }))
			if (!revalidate) return
			controller.validate({ state: control, dispatch, validators })()
		}

		function setAsyncValidators(validators: AsyncValidatorFn[], revalidate: boolean = true) {
			gSetAsyncValidators((prev) => ({ ...prev, [path]: validators }))
			if (!revalidate) return
			controller.asyncValidate({ state: control, dispatch, asyncValidators: validators, debounce })()
		}

		function setMask(mask: MaskFn, emitSelf: boolean = true) {
			gSetMask((prev) => ({ ...prev, [path]: mask }))
			if (!emitSelf) return
			controller.setValue({ state: control, dispatch, debounce, validators, asyncValidators, mask, parse })(control.value)
		}

		function setParse(parse: ParseFn, emitSelf: boolean = true) {
			gSetParse((prev) => ({ ...prev, [path]: parse }))
			if (!emitSelf) return
			controller.setValue({ state: control, dispatch, debounce, validators, asyncValidators, mask, parse })(control.value)
		}

		return {
			...control,
			isInvalid: control.status === "INVALID",
			isValid: control.status === "VALID",
			isPending: control.status === "PENDING",
			setValue: controller.setValue({ state: control, dispatch, debounce, validators, asyncValidators, mask, parse }),
			reset: controller.reset({ state: _initialState, dispatch }),
			validate: controller.validate({ state: control, dispatch, validators }),
			asyncValidate: controller.asyncValidate({ state: control, dispatch, asyncValidators, debounce }),
			setError: controller.setError({ dispatch }),
			disable: controller.disable({ dispatch }),
			enable: controller.enable({ dispatch }),
			markAsDirty: controller.markAsDirty({ dispatch }),
			markAsPristine: controller.markAsPristine({ dispatch }),
			markAsTouched: controller.markAsTouched({ dispatch }),
			markAsUntouched: controller.markAsUntouched({ dispatch }),
			setValidators,
			setAsyncValidators,
			setMask,
			setParse,
		}
	}
}
