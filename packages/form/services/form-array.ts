import { Dispatch, SetStateAction } from "react"
import { AsyncValidatorFn, ControlStatus, FormArrayState, FormControlState, FormGroup, FormGroupError, FormGroupSchema, MaskFn, ParseFn, ValidatorFn } from "../types"
import * as groupController from "./form-group"
import { initialGroupFn, initialGroupState } from "./initial-state"
import { ArrayPayload, GroupPayload } from "./reducers"

type DebounceMapFn = (path: string, fn: (...args: any[]) => void, ...args: any[]) => void

type FnState<T extends object = any, FnState = any> = Record<keyof T, FnState>

type ArrayOptions<T extends object = any> = {
	state: FormArrayState<T>
	initialState: FormArrayState<T>
	dispatch: Dispatch<ArrayPayload<T>>
	debounce: DebounceMapFn
	validators: FnState<T, ValidatorFn[]>[]
	asyncValidators: FnState<T, AsyncValidatorFn[]>[]
	mask: FnState<T, MaskFn | null>[]
	parse: FnState<T, ParseFn | null>[]
}

type ControlOptions<T extends object = any> = {
	setValidators: Dispatch<SetStateAction<FnState<T, ValidatorFn[]>[]>>
	setAsyncValidators: Dispatch<SetStateAction<FnState<T, AsyncValidatorFn[]>[]>>
	setMask: Dispatch<SetStateAction<FnState<T, MaskFn | null>[]>>
	setParse: Dispatch<SetStateAction<FnState<T, ParseFn | null>[]>>
}

function groupDispatch(at: number, dispatch: Dispatch<ArrayPayload>) {
	return function (value: GroupPayload) {
		dispatch({ at, ...value })
	}
}

function groupDebounce(at: number, debounceMapFn: DebounceMapFn) {
	return function (path: string, fn: () => void) {
		debounceMapFn(`${at}.${path}`, fn)
	}
}

function groupSetFn<T extends object = any, Fn = any>(at: number, setStateFn: Dispatch<SetStateAction<FnState<T, Fn>[]>>) {
	return function (value: () => FnState<T, Fn>) {
		setStateFn((prev) => {
			const next = [...prev]
			next[at] = {
				...next[at],
				...value(),
			}
			return next
		})
	}
}

export function find<T extends object = any>({
	state,
	initialState: aInitialState,
	dispatch: aDispatch,
	debounce: aDebounce,
	validators: aValidators,
	asyncValidators: aAsyncValidators,
	mask: aMask,
	parse: aParse,
	setValidators: aSetValidators,
	setAsyncValidators: aSetAsyncValidators,
	setMask: aSetMask,
	setParse: aSetParse,
}: ArrayOptions<T> & ControlOptions<T>) {
	return function (at: number): FormGroup<T> | null {
		const group = state[at]
		if (!group) {
			console.warn(`Group at index ${at} not found`)
			return null
		}

		const initialState = aInitialState[at]
		const validators = aValidators[at]
		const asyncValidators = aAsyncValidators[at]
		const mask = aMask[at]
		const parse = aParse[at]

		const dispatch = groupDispatch(at, aDispatch)
		const debounce = groupDebounce(at, aDebounce)

		const values = {} as T
		const errors = {} as FormGroupError<T>
		let status: ControlStatus = "VALID"

		for (const [k, v] of Object.entries(group)) {
			const key = k as keyof T
			const control = v as FormControlState
			values[key] = control.parsed
			if (control.error) errors[key] = control.error
			if (status === "INVALID" || status === "PENDING") continue
			if (control.status === "INVALID") status = "INVALID"
			if (control.status === "PENDING") status = "PENDING"
		}

		const setValidators = groupSetFn(at, aSetValidators) as Dispatch<SetStateAction<FnState<T, ValidatorFn[]>>>
		const setAsyncValidators = groupSetFn(at, aSetAsyncValidators) as Dispatch<SetStateAction<FnState<T, AsyncValidatorFn[]>>>
		const setMask = groupSetFn(at, aSetMask) as Dispatch<SetStateAction<FnState<T, MaskFn | null>>>
		const setParse = groupSetFn(at, aSetParse) as Dispatch<SetStateAction<FnState<T, ParseFn | null>>>

		return {
			values,
			status,
			isValid: status === "VALID",
			isInvalid: status === "INVALID",
			isPending: status === "PENDING",
			errors,
			find: groupController.find({ state: group, initialState, dispatch, debounce, validators, asyncValidators, mask, parse, setValidators, setAsyncValidators, setMask, setParse }),
			add: groupController.add({ state: group, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
			remove: groupController.remove({ state: group, dispatch: dispatch, setValidators, setAsyncValidators, setMask, setParse }),
			setValue: groupController.setValue({ state: group, dispatch, debounce, validators, asyncValidators, mask, parse }),
			reset: groupController.reset({ state: initialState, dispatch }),
			validate: groupController.validate({ state: group, dispatch, validators }),
			asyncValidate: groupController.asyncValidate({ state: group, dispatch, debounce, asyncValidators }),
		}
	}
}

export function map<T extends object = any>({
	state,
	initialState,
	dispatch,
	debounce,
	validators,
	asyncValidators,
	mask,
	parse,
	setValidators,
	setAsyncValidators,
	setMask,
	setParse,
}: ArrayOptions<T> & ControlOptions<T>) {
	return function (mapFn: (group: FormGroup<T>, index: number) => FormGroup<T>) {
		return state.map((_, i) => {
			const group = find({ state, initialState, dispatch, debounce, validators, asyncValidators, mask, parse, setValidators, setAsyncValidators, setMask, setParse })(i)
			return mapFn(group!, i)
		})
	}
}

export function push<T extends object = any>({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }: Pick<ArrayOptions<T>, "state" | "dispatch"> & ControlOptions<T>) {
	return function (schema: FormGroupSchema<T>) {
		const _state = initialGroupState(schema)
		const _fns = initialGroupFn(schema)
		setValidators((prev) => [...prev, _fns.validators as FnState<T, ValidatorFn[]>])
		setAsyncValidators((prev) => [...prev, _fns.asyncValidators as FnState<T, AsyncValidatorFn[]>])
		setMask((prev) => [...prev, _fns.mask as FnState<T, MaskFn | null>])
		setParse((prev) => [...prev, _fns.parse as FnState<T, ParseFn | null>])

		dispatch([...state, _state])
	}
}

export function unshift<T extends object = any>({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }: Pick<ArrayOptions<T>, "state" | "dispatch"> & ControlOptions<T>) {
	return function (schema: FormGroupSchema<T>) {
		const _state = initialGroupState(schema)
		const _fns = initialGroupFn(schema)
		setValidators((prev) => [_fns.validators as FnState<T, ValidatorFn[]>, ...prev])
		setAsyncValidators((prev) => [_fns.asyncValidators as FnState<T, AsyncValidatorFn[]>, ...prev])
		setMask((prev) => [_fns.mask as FnState<T, MaskFn | null>, ...prev])
		setParse((prev) => [_fns.parse as FnState<T, ParseFn | null>, ...prev])

		dispatch([_state, ...state])
	}
}

export function remove<T extends object = any>({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }: Pick<ArrayOptions<T>, "state" | "dispatch"> & ControlOptions<T>) {
	return function (at: number) {
		const next = [...state]
		next.splice(at, 1)
		setValidators((validators) => validators.filter((_, i) => i !== at))
		setAsyncValidators((asyncValidators) => asyncValidators.filter((_, i) => i !== at))
		setMask((mask) => mask.filter((_, i) => i !== at))
		setParse((parse) => parse.filter((_, i) => i !== at))

		dispatch(next)
	}
}

export function reset<T extends object = any>({ state, dispatch }: Pick<ArrayOptions<T>, "state" | "dispatch">) {
	return function () {
		dispatch([...state])
	}
}

export function validate({ state, dispatch: aDispatch, validators: aValidators }: Pick<ArrayOptions, "state" | "dispatch" | "validators">) {
	return function () {
		for (const group of state) {
			let idx = state.indexOf(group)
			let dispatch = groupDispatch(idx, aDispatch)
			let validators = aValidators[idx]
			groupController.validate({ state: group, dispatch, validators })()
		}
	}
}

export function asyncValidate({ state, dispatch: aDispatch, debounce: aDebounce, asyncValidators: aAsyncValidators }: Pick<ArrayOptions, "state" | "dispatch" | "debounce" | "asyncValidators">) {
	return function () {
		for (const group of state) {
			let idx = state.indexOf(group)
			let dispatch = groupDispatch(idx, aDispatch)
			let debounce = groupDebounce(idx, aDebounce)
			let asyncValidators = aAsyncValidators[idx]

			groupController.asyncValidate({ state: group, dispatch, debounce, asyncValidators })()
		}
	}
}
