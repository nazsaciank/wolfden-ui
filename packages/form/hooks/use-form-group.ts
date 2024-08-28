"use client"
import { useDebounceMap } from "@wolfden-ui/system"
import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import * as groupController from "../services/form-group"
import { initialGroupFn, initialGroupState } from "../services/initial-state"
import { formGroup } from "../services/reducers"
import { AsyncValidatorFn, ControlStatus, FormControlState, FormGroup, FormGroupError, FormGroupSchema, MaskFn, ParseFn, ValidatorFn } from "../types"

export type UseFormGroupOptions = {
	debounce?: number
}

export function useFormGroup<T extends object = any>(schema: FormGroupSchema<T>, { debounce: debounceTime = 500 }: UseFormGroupOptions = {}): FormGroup<T> {
	const initialState = useRef(initialGroupState(schema))
	const [state, dispatch] = useReducer<typeof formGroup<T>>(formGroup, initialState.current)

	const initialFn = useRef(initialGroupFn(schema))
	const [validators, setValidators] = useState<Record<keyof T, ValidatorFn[]>>(initialFn.current.validators)
	const [asyncValidators, setAsyncValidators] = useState<Record<keyof T, AsyncValidatorFn[]>>(initialFn.current.asyncValidators)
	const [mask, setMask] = useState<Record<keyof T, MaskFn | null>>(initialFn.current.mask)
	const [parse, setParse] = useState<Record<keyof T, ParseFn | null>>(initialFn.current.parse)

	const debounce = useDebounceMap(debounceTime)

	useEffect(() => {
		groupController.asyncValidate({ state, dispatch, debounce, asyncValidators })
	}, [])

	const values = useMemo(() => {
		const values: any = {}
		for (const [k, v] of Object.entries(state)) {
			const key = k as keyof T
			const control = v as FormControlState
			values[key] = control.parsed
		}

		return values as T
	}, [state])

	const status = useMemo(() => {
		let status: ControlStatus = "VALID"
		for (const v of Object.values(state)) {
			const control = v as FormControlState
			if (control.status === "INVALID") {
				status = "INVALID"
				break
			}

			if (control.status === "PENDING") {
				status = "PENDING"
				break
			}
		}

		return status
	}, [state])

	const errors = useMemo(() => {
		const errors: any = {}
		for (const [k, v] of Object.entries(state)) {
			const key = k as keyof T
			const control = v as FormControlState
			if (control.error) errors[key] = control.error
		}

		return errors as FormGroupError<T>
	}, [state])

	return {
		values,
		status,
		isValid: status === "VALID",
		isInvalid: status === "INVALID",
		isPending: status === "PENDING",
		errors,
		find: groupController.find({ state, initialState: initialState.current, dispatch, debounce, validators, asyncValidators, mask, parse, setValidators, setAsyncValidators, setMask, setParse }),
		add: groupController.add({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
		remove: groupController.remove({ state, dispatch, setValidators, setAsyncValidators, setMask, setParse }),
		setValue: groupController.setValue({ state, dispatch, debounce, validators, asyncValidators, mask, parse }),
		reset: groupController.reset({ state: initialState.current, dispatch }),
		validate: groupController.validate({ state, dispatch, validators }),
		asyncValidate: groupController.asyncValidate({ state, dispatch, debounce, asyncValidators }),
	}
}
