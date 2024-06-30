"use client"
import { useEffect, useReducer, useRef } from "react"
import { AsyncValidatorFn, FormControl, FormControlSchema, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"
import { useFormContext } from "./use-form-context"
import { useDebounce } from "./use-debounce"
import { formControl } from "../services/reducers"
import { initialControlState } from "../services/initial-state"

export function useFormControl<T = any>(name: string, schema: FormControlSchema<T>): FormControl<T> {
    const initialState = useRef(initialControlState(name, schema))
    const [data, dispatch] = useReducer(formControl, initialState.current)

    const debounce = useDebounce(500)
    const validatorsRef = useRef<ValidatorFn[]>(schema.validators || [])
    const asyncValidatorsRef = useRef<AsyncValidatorFn[]>(schema.asyncValidators || [])
    const maskRef = useRef<MaskFn | null>(schema.mask || null)
    const parseRef = useRef<ParseFn | null>(schema.parse || null)

    const control = useFormContext(name)

    useEffect(() => {
        if (control) return
        asyncValidate()
    }, [])

    if (control) return control

    function setValue(value: T) {
        let masked = ""
        if (maskRef.current && typeof value === "string") {
            for (let i = 0; i < value.length; i++) {
                let character = value[i]
                masked += maskRef.current(character, i, value)
            }
        }

        let parsed = parseRef.current ? parseRef.current(masked) : value
        dispatch({ value, masked, parsed })
        if (!data.isDirty) markAsDirty()

        validate(parsed)
        asyncValidate(parsed)
    }

    function reset() {
        dispatch({ ...initialState.current })
    }

    function validate(value: T = data.value) {
        let error: ValidatorError | null = null
        for (const validator of validatorsRef.current) {
            let result = validator(value)
            if (!result) continue
            error = result
            break
        }

        dispatch({ error, status: error ? "INVALID" : "VALID" })
    }

    function asyncValidate(value: T = data.value) {
        if (asyncValidatorsRef.current.length === 0) return
        if (data.error) return
        dispatch({ status: "PENDING" })
        return debounce(async () => {
            let error: ValidatorError | null = null
            for (const validator of asyncValidatorsRef.current) {
                let result = await validator(value)
                if (!result) continue
                error = result
                break
            }

            dispatch({ error, status: error ? "INVALID" : "VALID" })
        })
    }

    function markAsPristine() {
        dispatch({ isDirty: false })
    }

    function markAsDirty() {
        dispatch({ isDirty: true })
    }

    function markAsTouched() {
        dispatch({ isTouched: true })
    }

    function markAsUntouched() {
        dispatch({ isTouched: false })
    }

    function disable() {
        dispatch({ isDisabled: true })
    }

    function enable() {
        dispatch({ isDisabled: false })
    }

    function setError(errors: ValidatorError | null) {
        dispatch({ error: errors, status: errors ? "INVALID" : "VALID" })
    }

    function setValidators(validators: ValidatorFn[], emitSelf: boolean = true) {
        validatorsRef.current = validators
        if (emitSelf) validate()
    }

    function setMask(mask: MaskFn, emitSelf: boolean = true) {
        maskRef.current = mask
        if (emitSelf) setValue(data.value)
    }

    function setParse(parse: ParseFn, emitSelf: boolean = true) {
        parseRef.current = parse
        if (emitSelf) setValue(data.value)
    }

    return {
        ...data,
        isValid: data.status === "VALID",
        isInvalid: data.status === "INVALID",
        isPending: data.status === "PENDING",
        setValue,
        reset,
        validate: () => validate(),
        asyncValidate: () => asyncValidate(),
        markAsPristine,
        markAsDirty,
        markAsTouched,
        markAsUntouched,
        disable,
        enable,
        setError,
        setValidators,
        setMask,
        setParse,
    }
}
