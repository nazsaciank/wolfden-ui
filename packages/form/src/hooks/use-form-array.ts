"use client"
import { useDebounceMap } from "@wolfden-ui/system"
import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import * as arrayController from "../services/form-array"
import { initialArrayFn, initialArrayState } from "../services/initial-state"
import { formArray } from "../services/reducers"
import { AsyncValidatorFn, ControlStatus, FormArray, FormArraySchema, FormControlState, FormGroupError, FormGroupState, MaskFn, ParseFn, ValidatorFn } from "../types"

export type UseFormArrayOptions = {
	debounce?: number
}

export function useFormArray<T extends object = any>(schema: FormArraySchema<T>, { debounce: debounceTime = 500 }: UseFormArrayOptions = {}): FormArray<T> {
	const initialState = useRef(initialArrayState(schema))
	const [state, dispatch] = useReducer<typeof formArray<T>>(formArray, initialState.current)

	const initialFn = useRef(initialArrayFn(schema))
	const [validators, setValidators] = useState<Record<keyof T, ValidatorFn[]>[]>(initialFn.current.validators)
	const [asyncValidators, setAsyncValidators] = useState<Record<keyof T, AsyncValidatorFn[]>[]>(initialFn.current.asyncValidators)
	const [mask, setMask] = useState<Record<keyof T, MaskFn | null>[]>(initialFn.current.mask)
	const [parse, setParse] = useState<Record<keyof T, ParseFn | null>[]>(initialFn.current.parse)

	const debounce = useDebounceMap(debounceTime)

	useEffect(() => {
		arrayController.asyncValidate({ state, dispatch, debounce, asyncValidators })()
	}, [validators])

	const values = useMemo(() => {
		return state.map((item: FormGroupState) => {
			const values: any = {}

			for (const [k, v] of Object.entries(item)) {
				const key = k as keyof T
				const control = v as FormControlState
				values[key] = control.parsed
			}

			return values as T
		})
	}, [state])

	const status = useMemo(() => {
		let status: ControlStatus = "VALID"
		for (const formGroup of state) {
			for (const c of Object.values(formGroup)) {
				let control = c as FormControlState
				if (control.status === "INVALID") {
					status = "INVALID"
					break
				}
				if (control.status === "PENDING") {
					status = "PENDING"
					break
				}
			}
		}
		return status
	}, [state])

	const errors = useMemo(() => {
		const errors: FormGroupError<T>[] = []
		for (const formGroup of state) {
			let error: FormGroupError<T> = {} as FormGroupError<T>
			for (const [k, v] of Object.entries(formGroup)) {
				const key = k as keyof T
				const control = v as FormControlState
				error[key] = control.error
			}
			errors.push(error)
		}

		return errors
	}, [state])

	const length = useMemo(() => state.length, [state.length])

	return {
		values,
		status,
		isValid: status === "VALID",
		isInvalid: status === "INVALID",
		isPending: status === "PENDING",
		errors,
		length,
		find: arrayController.find({ state, initialState: initialState.current, dispatch, debounce, validators, asyncValidators, mask, parse, setValidators, setAsyncValidators, setMask, setParse }),
		map: arrayController.map({ state, initialState: initialState.current, dispatch, debounce, validators, asyncValidators, mask, parse, setValidators, setAsyncValidators, setMask, setParse }),
		push: arrayController.push({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
		unshift: arrayController.unshift({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
		remove: arrayController.remove({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
		reset: arrayController.reset({ state: initialState.current, dispatch }),
		validate: arrayController.validate({ state, dispatch, validators }),
		asyncValidate: arrayController.asyncValidate({ state, dispatch, debounce, asyncValidators }),
	}
}
