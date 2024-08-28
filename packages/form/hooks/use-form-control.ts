"use client"
import { useDebounce } from "@wolfden-ui/system"
import { useEffect, useReducer, useRef, useState } from "react"
import * as controller from "../services/form-control"
import { initialControlState } from "../services/initial-state"
import { formControl } from "../services/reducers"
import { AsyncValidatorFn, FormControl, FormControlSchema, MaskFn, ParseFn, ValidatorFn } from "../types"
import { useFormContext } from "./use-form-context"

export type UseFormControlOptions = {
	name?: string
	control?: FormControl
	debounce?: number
}

export function useFormControl<T = any>(schema: FormControlSchema<T>, { name = "", control, debounce: debounceTime = 500 }: UseFormControlOptions = {}): FormControl<T> {
	const initialState = useRef(initialControlState(name, schema))
	const [state, dispatch] = useReducer(formControl, initialState.current)

	const debounce = useDebounce(debounceTime)
	const [validators, setValidators] = useState<ValidatorFn[]>(schema.validators || [])
	const [asyncValidators, setAsyncValidators] = useState<AsyncValidatorFn[]>(schema.asyncValidators || [])
	const [mask, setMask] = useState<MaskFn | null>(schema.mask || null)
	const [parse, setParse] = useState<ParseFn | null>(schema.parse || null)

	const contextControl = useFormContext(name)
	if (!control && contextControl) control = contextControl

	useEffect(() => {
		if (control) return
		controller.asyncValidate({ state, dispatch, debounce, asyncValidators })
	}, [])

	if (control) return control

	function _setValidators(validators: ValidatorFn[], revalidate: boolean = true) {
		setValidators(validators)
		if (!revalidate) return
		controller.validate({ state, dispatch, validators })()
	}

	function _setAsyncValidators(asyncValidators: AsyncValidatorFn[], revalidate: boolean = true) {
		setAsyncValidators(asyncValidators)
		if (!revalidate) return
		controller.asyncValidate({ state, dispatch, debounce, asyncValidators })()
	}

	function _setMask(mask: MaskFn | null, emitSelf: boolean = true) {
		setMask(mask)
		if (!emitSelf) return
		controller.setValue({ state, dispatch, debounce, validators, asyncValidators, mask, parse })(state.value)
	}

	function _setParse(parse: ParseFn | null, emitSelf: boolean = true) {
		setParse(parse)
		if (!emitSelf) return
		controller.setValue({ state, dispatch, debounce, validators, asyncValidators, mask, parse })(state.value)
	}

	return {
		...state,
		isValid: state.status === "VALID",
		isInvalid: state.status === "INVALID",
		isPending: state.status === "PENDING",
		setValue: controller.setValue({ state, dispatch, debounce, validators, asyncValidators, mask, parse }),
		reset: controller.reset({ state: initialState.current, dispatch }),
		setError: controller.setError({ dispatch }),
		disable: controller.disable({ dispatch }),
		enable: controller.enable({ dispatch }),
		markAsDirty: controller.markAsDirty({ dispatch }),
		markAsPristine: controller.markAsPristine({ dispatch }),
		markAsUntouched: controller.markAsUntouched({ dispatch }),
		markAsTouched: controller.markAsTouched({ dispatch }),
		validate: controller.validate({ state, dispatch, validators }),
		asyncValidate: controller.asyncValidate({ state, dispatch, debounce, asyncValidators }),
		setValidators: _setValidators,
		setAsyncValidators: _setAsyncValidators,
		setMask: _setMask,
		setParse: _setParse,
	}
}
