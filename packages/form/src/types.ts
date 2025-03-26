export type ControlStatus = "VALID" | "INVALID" | "PENDING"

export type ValidatorFn = (value: any, state?: FormGroupState) => ValidatorError | null

export type AsyncValidatorFn = (value: any, state?: FormGroupState) => Promise<ValidatorError | null>

export type MaskFn = (nextValue: any, prevValue?: any) => any

export type ParseFn = (value: any) => any

export type ValidatorError = { [key: string]: any }

export type FormGroupError<T extends object = any> = { [K in keyof T]: ValidatorError | null }

export type FormFnState = {
	/** List of synchronous validation functions. */
	validators: ValidatorFn[]
	/** List of asynchronous validation functions. */
	asyncValidators: AsyncValidatorFn[]
	/** Function to apply a mask to the value. */
	mask: MaskFn | null
	/** Function to transform the value before using it. */
	parse: ParseFn | null
}

export type FormControlSchema<T = any> = Partial<FormFnState> & {
	/** Initial value of the control. */
	value: T | null
	/** Indicates whether the control is disabled. */
	disabled?: boolean
}

export type FormGroupSchema<T extends object = any> = {
	[K in keyof T]: FormControlSchema<T[K]>
}

export type FormArraySchema<T extends object = any> = FormGroupSchema<T>[]

export type FormControlState<T = any> = {
	/** Name of the control. */
	name: string
	/** Current value of the control. */
	value: T
	/** Value parsed according to the parse function. */
	parsed: any

	/** Current state of the `VALID`, `INVALID`, or `PENDING` control. */
	status: ControlStatus
	/** Current validation error, if any. */
	error: ValidatorError | null

	/** Indicates whether the control has been touched. */
	isTouched: boolean
	/** Indicates whether the value of the control has been modified. */
	isDirty: boolean
	/** Indicates whether the control is disabled. */
	isDisabled: boolean
	/** Indicates whether the value is indeterminate. */
	isIndeterminate: boolean
}

export type FormGroupState<T extends object = any> = {
	[K in keyof T]: FormControlState<T[K]>
}

export type FormArrayState<T extends object = any> = FormGroupState<T>[]

export type FormControl<T = any> = Readonly<FormControlState<T>> &
	Readonly<FormFnState> & {
		/** Indicates whether the value is valid. */
		readonly isValid: boolean
		/** Indicates whether the value is invalid. */
		readonly isInvalid: boolean
		/** Indicates whether validation is pending. */
		readonly isPending: boolean

		/** Sets a new schema for the control. */
		setSchema(schema: FormControlSchema<T>): void
		/** Sets a new value for the control. */
		setValue(value: T): void
		/** Resets the control to its initial state. */
		reset(): void
		/** Run synchronous validations manually */
		validate(): void
		/** Run asynchronous validations manually */
		asyncValidate(): void

		/** Establishes new validation functions. */
		setValidators(validators: ValidatorFn[], revalidate?: boolean): void
		/** Establishes new asynchronous validation functions. */
		setAsyncValidators(validators: AsyncValidatorFn[], revalidate?: boolean): void
		/** Sets a new mask function. */
		setMask(mask: MaskFn, emitSelf?: boolean): void
		/** Sets a new parsing function. */
		setParse(parse: ParseFn, emitSelf?: boolean): void
		/** Set an error manually. */
		setError(errors: ValidatorError | null): void

		/** Habilita el control. */
		enable(): void
		/** Disables control. */
		disable(): void

		/** Mark the control as modified */
		markAsDirty(): void
		/** Mark the control as unmodified. */
		markAsPristine(): void
		/** Mark the control as touched. */
		markAsTouched(): void
		/** Mark the control as untouched. */
		markAsUntouched(): void
	}

export type FormGroup<T extends object = any> = {
	/** Current value of the form. */
	readonly values: T

	/** Current state of the form: `VALID`, `INVALID` or `PENDING`. */
	readonly status: ControlStatus
	/** Object that indicates which controls have validation errors. */
	readonly errors: FormGroupError<T>

	/** Indicates if the form is valid. */
	readonly isValid: boolean
	/** Indicates if any control within the form is invalid. */
	readonly isInvalid: boolean
	/** Indicates if any control within the form is pending. */
	readonly isPending: boolean

	/** Finds and returns a `FormControl` corresponding to a specific field. */
	find(path: keyof T): FormControl<T[keyof T]> | null
	/** Adds a new control to the form at the specified path. */
	add<T>(name: string, schema: FormControlSchema<T>): void
	/** Removes the control at the specified path from the form. */
	remove(path: keyof T): void

	/** Set new values ​​on the form */
	setValue(value: Partial<T>): void
	/** Resets the form to its initial state. */
	reset(): void
	/** Manually validate all controls within the form. */
	validate(): void
	/** Performs asynchronous validation of all form controls. */
	asyncValidate(): void
}

export type FormArray<T extends object = any> = {
	/** Current value of the forms array. */
	readonly values: T[]

	/** Current state of the forms array: `VALID`, `INVALID` or `PENDING`. */
	readonly status: ControlStatus
	/** Errors present in the array forms. */
	readonly errors: FormGroupError<T>[]

	/** Indicates whether all forms in the array are valid. */
	readonly isValid: boolean
	/** Indicates if any form in the array is invalid. */
	readonly isInvalid: boolean
	/** Indicates if any form in the array is pending. */
	readonly isPending: boolean

	/** Number of forms in the array. */
	readonly length: number
	/** Iterate over the forms in the array and apply the `mapFn` function to each one. */
	map(fn: (group: FormGroup<T>, index: number) => any): any[]

	/** Find a form in the array by its index. */
	find(index: number): FormGroup<T> | null
	/** Add a new form to the end of the array. */
	push(schema: FormGroupSchema<T>): void
	/** Add a new form to the start of the array. */
	unshift(schema: FormGroupSchema<T>): void
	/** Removes a form from the array by its index. */
	remove(index: number): void

	/** Resets all forms in the array to their initial state. */
	reset: () => void
	/** Validate all forms in the array. */
	validate(): void
	/** Asynchronously validates all forms in the array. */
	asyncValidate(): void
}

export type FormArrayFn<T extends object = any> = (state: FormArrayState<T>) => FormArrayState<T>

export type FormGroupFn<T extends object = any> = (state: FormGroupState<T>) => FormGroupState<T>

export type FormControlFn<T = any> = (state: FormControlState<T>) => FormControlState<T>

export type ControlRef<R extends HTMLElement = any> = {
	name?: string
	value?: any
	checked?: boolean
	disabled?: boolean
	indeterminate?: string
	onChange?: (event: React.ChangeEvent<R>) => void
	onFocus?: (event: React.FocusEvent<R>) => void
}

export type ControlProps<T = any> = {
	/** Name of the Control */
	name?: string
	/** Control */
	control?: FormControl<T>
	/** List of synchronous validation functions. */
	validators?: ValidatorFn[]
	/** List of asynchronous validation functions. */
	asyncValidators?: AsyncValidatorFn[]
	/** Function to apply a mask to the value. */
	mask?: MaskFn
	/** Function to transform the value before using it. */
	parse?: ParseFn
	/** Value Change Event */
	onChangeValue?: (value: T, control: FormControl) => void
	/** Status Change Event */
	onChangeStatus?: (status: ControlStatus, control: FormControl) => void
	/** Error Change Event */
	onChangeError?: (error: ValidatorError | null, control: FormControl) => void
	/** Indicates whether the control is disabled. */
	disabled?: boolean
	/**  */
	debounce?: number
}
