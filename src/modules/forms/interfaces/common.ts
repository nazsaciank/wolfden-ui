export type ControlError = Record<string, any> | null

export type ControlStatus = "valid" | "invalid" | "validating"

export type ValidatorFn<T = any> = (value: T) => ControlError | null

export type AsyncValidatorFn<T = any> = (value: T) => Promise<ControlError | null>

export type MaskFn = (newValue: any, oldValue: any) => any

export type ParseFn = (value: any) => any

export type DebounceFn = (fn: () => void) => void

export type DebounceMapFn = (key: string, fn: () => void) => void
