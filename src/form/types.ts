import { RefObject } from "react"

export type ControlStatus = "VALID" | "INVALID" | "PENDING"

export type ValidatorFn = (value: any, state?: FormGroupState) => ValidatorError | null

export type AsyncValidatorFn = (value: any, state?: FormGroupState) => Promise<ValidatorError | null>

export type MaskFn = (character: string, index: number, value: string) => string

export type ParseFn = (value: any) => any

export type ValidatorError = {
    [key: string]: any
}

export type FormFnState = {
    /** controller validation functions */
    validators: ValidatorFn[]
    /** controller validation functions */
    asyncValidators: AsyncValidatorFn[]
    /** controller mask function */
    mask: MaskFn
    /** controller parsing function */
    parse: ParseFn
}

export type FormArraySchema<T extends object = any> = FormGroupSchema<T>[]

export type FormGroupSchema<T extends object = any> = {
    [K in keyof T]: FormControlSchema<T[K]>
}

export type FormControlSchema<T = any> = Partial<FormFnState> & {
    /** value state of control */
    value: T | null
    /** touched state of control */
    isTouched?: boolean
    /** dirty state of control */
    isDirty?: boolean
    /** disabled state of control */
    isDisabled?: boolean
    /** indeterminate state of control */
    isIndeterminate?: boolean
}

export type FormArrayState<T extends object = any> = FormGroupState<T>[]

export type FormGroupState<T extends object = any> = {
    [K in keyof T]: FormControlState<T[K]>
}

export type FormControlState<T = any> = {
    /** name of control */
    name: string
    /** value of control */
    value: T
    /** value returned for parse function */
    parsed: T
    /** value returned for mask function */
    masked: string

    /** status of control */
    status: ControlStatus
    /** errors of control */
    error: ValidatorError | null

    /** determines if the control was touched */
    isTouched: boolean
    /** determines if the control was dirty */
    isDirty: boolean
    /** determines if the control is disabled */
    isDisabled: boolean
    /** determines if the control is indeterminate */
    isIndeterminate: boolean
}

export type FormGroupError<T extends object = any> = {
    [K in keyof T]: ValidatorError | null
}

export type FormArray<T extends object = any> = {
    readonly values: T[]

    readonly status: ControlStatus
    readonly errors: FormGroupError<T>[]

    readonly isTouched: boolean
    readonly isDirty: boolean

    readonly isValid: boolean
    readonly isInvalid: boolean
    readonly isPending: boolean

    get(index: number): FormControl<T>

    push(value: T): Promise<void>
    insert(index: number, value: T): Promise<void>
    remove(index: number): Promise<void>
    reset(): Promise<void>

    validate(): Promise<void>
}

export type FormGroup<T extends object = any> = {
    readonly values: T

    readonly status: ControlStatus
    readonly errors: FormGroupError<T>

    readonly isValid: boolean
    readonly isInvalid: boolean
    readonly isPending: boolean

    get(path: keyof T): FormControl<T[keyof T]> | null
    setValue(value: Partial<T>): void
    reset(): void

    addField<T>(name: string, schema: FormControlSchema<T>): void
    removeField(path: keyof T): void

    validate(): void
    asyncValidate(): void
}

export type FormControl<T = any> = Readonly<FormControlState<T>> & {
    readonly isValid: boolean
    readonly isInvalid: boolean
    readonly isPending: boolean

    setValue(value: T): void
    reset(): void
    validate(): void
    asyncValidate(): void

    setValidators(validators: ValidatorFn[], emitSelf?: boolean): void
    setMask(mask: MaskFn, emitSelf?: boolean): void
    setParse(parse: ParseFn, emitSelf?: boolean): void
    setError(errors: ValidatorError, emitSelf?: boolean): void

    enable(): void
    disable(): void

    markAsDirty(): void
    markAsPristine(): void
    markAsTouched(): void
    markAsUntouched(): void
}

export type FormArrayFn<T extends object = any> = (state: FormArrayState<T>) => FormArrayState<T>

export type FormGroupFn<T extends object = any> = (state: FormGroupState<T>) => FormGroupState<T>

export type FormControlFn<T = any> = (state: FormControlState<T>) => FormControlState<T>

export type ControlRef<R extends HTMLElement = any> = {
    ref: RefObject<R>
    value?: any
    checked?: boolean
    disabled: boolean
    indeterminate?: boolean
    onChange: (event: React.ChangeEvent<R>) => void
    onFocus: (event: React.FocusEvent<R>) => void
}

export type ControlProps<T = any> = {
    control?: FormControl<T>

    name?: string

    value?: T

    validators?: ValidatorFn[]

    asyncValidators?: AsyncValidatorFn[]

    mask?: MaskFn

    parse?: ParseFn

    onChangeValue?: (value: T) => void

    onChangeStatus?: (status: ControlStatus) => void

    onChangeError?: (error: ValidatorError | null) => void

    touched?: boolean

    dirty?: boolean

    disabled?: boolean
}
