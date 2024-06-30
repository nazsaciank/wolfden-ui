import { useMemo, useReducer, useRef } from "react"
import { AsyncValidatorFn, ControlStatus, FormControl, FormControlSchema, FormControlState, FormGroup, FormGroupError, FormGroupSchema, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"
import { formGroup } from "../services/reducers"
import { initialControlState, initialGroupState } from "../services/initial-state"
import { initialAsyncValidators, initialMask, initialParse, initialValidators } from "../services/initial-functions"
import { useDebounceMap } from "./use-debounce"

export function useFormGroup<T extends object = any>(schema: FormGroupSchema<T>): FormGroup<T> {
    const initialState = useRef(initialGroupState(schema))
    const [data, dispatch] = useReducer<typeof formGroup<T>>(formGroup, initialState.current)

    const debounce = useDebounceMap(500)
    const validatorsRef = useRef<Record<keyof T, ValidatorFn[]>>(initialValidators(schema))
    const asyncValidatorsRef = useRef<Record<keyof T, AsyncValidatorFn[]>>(initialAsyncValidators(schema))
    const maskRef = useRef<Record<keyof T, MaskFn>>(initialMask(schema))
    const parseRef = useRef<Record<keyof T, ParseFn>>(initialParse(schema))

    const values = useMemo(() => {
        const values: any = {}
        for (const [key, control] of Object.entries(data)) {
            values[key] = control.value
        }

        return values as T
    }, [data])

    const status = useMemo(() => {
        let status: ControlStatus = "VALID"
        for (const control of Object.values(data)) {
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
    }, [data])

    const errors = useMemo(() => {
        const errors: any = {}
        for (const [key, control] of Object.entries(data)) {
            if (control.error) errors[key] = control.error
        }

        return errors as FormGroupError<T>
    }, [data])

    function get(path: keyof T): FormControl<T[keyof T]> | null {
        let control: FormControlState = data[path]
        if (!control) return null

        let validators = validatorsRef.current[path]
        let asyncValidators = asyncValidatorsRef.current[path]
        let mask = maskRef.current[path]
        let parse = parseRef.current[path]

        function setValue(value: T[keyof T]) {
            let masked = ""
            if (mask && typeof value === "string") {
                for (let i = 0; i < value.length; i++) {
                    let character = value[i]
                    masked += mask(character, i, value)
                }
            }

            let parsed = parse ? parse(value) : value
            dispatch({ path, value, masked, parsed })
            if (!control.isDirty) dispatch({ path, isDirty: true })

            validate(parsed)
            asyncValidate(parsed)
        }

        function reset() {
            dispatch({ path, ...initialState.current[path] })
        }

        function validate(value: T[keyof T] = control.value) {
            let error: any = null

            for (const validator of validators) {
                let result = validator(value)
                if (!result) continue
                error = result
                break
            }

            dispatch({ path, error, status: error ? "INVALID" : "VALID" })
        }

        function asyncValidate(value: T[keyof T] = control.value) {
            if (asyncValidators.length === 0) return
            if (control.error) return
            dispatch({ path, status: "PENDING" })
            return debounce(path as string, async () => {
                let error: any = null
                for (const validator of asyncValidators) {
                    let result = await validator(value)
                    if (!result) continue
                    error = result
                    break
                }

                dispatch({ path, error, status: error ? "INVALID" : "VALID" })
            })
        }

        function disable() {
            dispatch({ path, isDisabled: true })
        }

        function enable() {
            dispatch({ path, isDisabled: false })
        }

        function markAsPristine() {
            dispatch({ path, isDirty: false })
        }

        function markAsDirty() {
            dispatch({ path, isDirty: true })
        }

        function markAsTouched() {
            dispatch({ path, isTouched: true })
        }

        function markAsUntouched() {
            dispatch({ path, isTouched: false })
        }

        function setError(error: ValidatorError | null, emitSelf: boolean) {
            dispatch({ path, error, status: error ? "INVALID" : "VALID" })
            if (emitSelf) validate()
        }

        function setValidators(validators: ValidatorFn[], emitSelf: boolean) {
            validatorsRef.current = {
                ...validatorsRef.current,
                [path]: validators,
            }
            if (emitSelf) validate()
        }

        function setMask(mask: MaskFn, emitSelf: boolean) {
            maskRef.current = {
                ...maskRef.current,
                [path]: mask,
            }
            if (emitSelf) setValue(control.value)
        }

        function setParse(parse: ParseFn, emitSelf: boolean) {
            parseRef.current = {
                ...parseRef.current,
                [path]: parse,
            }
            if (emitSelf) setValue(control.value)
        }

        return {
            ...control,
            isValid: control.status === "VALID",
            isInvalid: control.status === "INVALID",
            isPending: control.status === "PENDING",
            setValue,
            reset,
            validate,
            asyncValidate,
            disable,
            enable,
            markAsDirty,
            markAsPristine,
            markAsTouched,
            markAsUntouched,
            setError,
            setValidators,
            setMask,
            setParse,
        }
    }

    function setValue(value: Partial<T>) {
        const newState = { ...data }

        for (const [key, control] of Object.entries(value)) {
            let path = key as keyof T
            let current = newState[path]
            if (!current) continue

            let validators = validatorsRef.current[path]
            let asyncValidators = asyncValidatorsRef.current[path]
            let mask = maskRef.current[path]
            let parse = parseRef.current[path]

            let masked = ""
            if (mask && typeof control === "string") {
                for (let i = 0; i < control.length; i++) {
                    let character = control[i]
                    masked += mask(character, i, control)
                }
            }

            let parsed = parse ? parse(control) : control
            newState[path] = { ...current, value: control, masked, parsed }
            if (!current.isDirty) newState[path] = { ...newState[path], isDirty: true }

            validate(parsed, validators)
            asyncValidate(path, parsed, asyncValidators)
        }

        dispatch(newState)
    }

    function reset() {
        dispatch(initialState.current)
    }

    function addField(name: string, schema: FormControlSchema) {
        let path = name as keyof T
        let control = initialControlState(name, schema)

        dispatch({ path, ...control })
        validatorsRef.current = {
            ...validatorsRef.current,
            [path]: schema.validators,
        }
        asyncValidatorsRef.current = {
            ...asyncValidatorsRef.current,
            [path]: schema.asyncValidators,
        }
        maskRef.current = {
            ...maskRef.current,
            [path]: schema.mask,
        }
        parseRef.current = {
            ...parseRef.current,
            [path]: schema.parse,
        }
    }

    function removeField(path: keyof T) {
        let newState = { ...data }
        delete newState[path]
        dispatch(newState)
        delete validatorsRef.current[path]
        delete asyncValidatorsRef.current[path]
        delete maskRef.current[path]
        delete parseRef.current[path]
    }

    function validate(value: T[keyof T], validators: ValidatorFn[]) {
        let error: any = null
        for (const validator of validators) {
            let result = validator(value)
            if (!result) continue
            error = result
            break
        }

        dispatch({ error, status: error ? "INVALID" : "VALID" })
    }

    function asyncValidate(path: keyof T, value: T[keyof T], asyncValidators: AsyncValidatorFn[]) {
        if (asyncValidators.length === 0) return
        if (data[path].error) return
        dispatch({ path, status: "PENDING" })
        return debounce(path as string, async () => {
            let error: any = null
            for (const validator of asyncValidators) {
                let result = await validator(value)
                if (!result) continue
                error = result
                break
            }

            dispatch({ path, error, status: error ? "INVALID" : "VALID" })
        })
    }

    return {
        values,
        status,
        errors,
        isValid: status === "VALID",
        isInvalid: status === "INVALID",
        isPending: status === "PENDING",
        get,
        setValue,
        reset,
        addField,
        removeField,
        validate: () => {
            for (const [path, control] of Object.entries(data)) {
                const validators = validatorsRef.current[path as keyof T]
                validate(control.value, validators)
            }
        },
        asyncValidate: () => {
            for (const [path, control] of Object.entries(data)) {
                const asyncValidators = asyncValidatorsRef.current[path as keyof T]
                asyncValidate(path as keyof T, control.value, asyncValidators)
            }
        },
    }
}
