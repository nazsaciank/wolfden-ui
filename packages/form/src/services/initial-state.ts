import { AsyncValidatorFn, FormArraySchema, FormArrayState, FormControlSchema, FormControlState, FormGroupSchema, FormGroupState, MaskFn, ParseFn, ValidatorError, ValidatorFn } from "../types"

export function initialControlState(name: string, schema: FormControlSchema): FormControlState {
	let { value, validators = [], asyncValidators = [], mask, parse, disabled } = schema

	let masked = mask ? mask(value) : value
	let parsed = parse ? parse(masked) : masked

	let error: ValidatorError | null = null
	for (const validator of validators) {
		let result = validator(parsed)
		if (!result) continue
		error = result
		break
	}

	return {
		name,
		value: value ?? null,
		parsed: parsed ?? null,
		error,
		status: error ? "INVALID" : asyncValidators.length ? "PENDING" : "VALID",
		isDisabled: disabled ?? false,
		isDirty: false,
		isTouched: false,
		isIndeterminate: false,
	}
}

export function initialGroupState(schema: FormGroupSchema): FormGroupState {
	let state: FormGroupState = {}
	for (const [name, controlSchema] of Object.entries(schema)) {
		if (!controlSchema) continue
		state[name] = initialControlState(name, controlSchema)
	}

	return state
}

export function initialArrayState(schema: FormArraySchema): FormArrayState {
	return schema.map(initialGroupState)
}

export function initialControlFn(schema: FormControlSchema) {
	let validators = schema.validators || []
	let asyncValidators = schema.asyncValidators || []
	let mask = schema.mask || null
	let parse = schema.parse || null

	return {
		validators,
		asyncValidators,
		mask,
		parse,
	}
}

export function initialGroupFn<T extends object = any>(schema: FormGroupSchema) {
	let validators: Record<any, ValidatorFn[]> = {}
	let asyncValidators: Record<any, AsyncValidatorFn[]> = {}
	let mask: Record<any, MaskFn | null> = {}
	let parse: Record<any, ParseFn | null> = {}

	for (const [key, controlSchema] of Object.entries(schema)) {
		validators[key] = controlSchema.validators || []
		asyncValidators[key] = controlSchema.asyncValidators || []
		mask[key] = controlSchema.mask || null
		parse[key] = controlSchema.parse || null
	}

	return {
		validators,
		asyncValidators,
		mask,
		parse,
	}
}

export function initialArrayFn(schema: FormArraySchema) {
	let validators: Record<any, ValidatorFn[]>[] = []
	let asyncValidators: Record<any, AsyncValidatorFn[]>[] = []
	let mask: Record<any, MaskFn | null>[] = []
	let parse: Record<any, ParseFn | null>[] = []

	for (const _schema of schema) {
		const initialFn = initialGroupFn(_schema)
		validators.push(initialFn.validators)
		asyncValidators.push(initialFn.asyncValidators)
		mask.push(initialFn.mask)
		parse.push(initialFn.parse)
	}

	return {
		validators,
		asyncValidators,
		mask,
		parse,
	}
}
