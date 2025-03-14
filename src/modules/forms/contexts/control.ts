import { createStore } from "zustand"
import { ControlError, ControlStatus, DebounceFn } from "../interfaces/common"
import { FormControl, FormControlSchema } from "../interfaces/control"

export function createControl<T>(schema: FormControlSchema<T>, debounce?: DebounceFn) {
	let { value, isDisabled, validators = [], asyncValidators = [], mask, parse } = schema

	value = mask ? mask(value, null) : value
	let parsed = parse ? parse(value) : value

	let error: ControlError | null = null
	let status: ControlStatus = "valid"

	for (const validator of validators) {
		if (isDisabled) break

		const result = validator(value)
		if (result) {
			error = result
			status = "invalid"
			break
		}
	}

	if (!error && asyncValidators.length > 0) status = "validating"

	return createStore<FormControl>((set, get) => ({
		schema,
		name: schema.name,
		value,
		parsed,
		error,
		status,
		validators,
		asyncValidators,
		isDirty: false,
		isTouched: false,
		isDisabled: schema.isDisabled || false,
		isReadonly: schema.isReadonly || false,
		isIndeterminate: schema.isIndeterminate || false,
		mask: schema.mask || null,
		parse: schema.parse || null,
		setValue: (value) => {
			const { value: oldValue, validators, asyncValidators, mask, parse, isDirty, isDisabled } = get()

			if (isDisabled) return
			if (oldValue === value) return

			value = mask ? mask(value, oldValue) : value
			let parsed = parse ? parse(value) : value

			let error: ControlError | null = null
			let status: ControlStatus = "valid"

			for (const validator of validators) {
				const result = validator(value)
				if (result) {
					error = result
					status = "invalid"
					break
				}
			}

			set({ value, parsed, error, status })
			if (!isDirty) set({ isDirty: true })

			if (!error && asyncValidators.length > 0) {
				set({ status: "validating" })

				if (debounce) {
					debounce(async () => {
						let error: ControlError | null = null
						for await (const validator of asyncValidators) {
							error = await validator(value)
							if (error) break
						}
						set({ error, status: error ? "invalid" : "valid" })
					})
				}
			}
		},
		reset: () => {
			const { schema } = get()
			let { value, isDisabled, validators = [], asyncValidators = [], mask, parse, ...rest } = schema

			value = mask ? mask(value, null) : value
			let parsed = parse ? parse(value) : value

			let error: ControlError | null = null

			for (const validator of validators) {
				error = validator(schema.value)
				if (error) break
			}

			set({ value, parsed, error, status: error ? "invalid" : "valid", ...rest })

			if (!error && asyncValidators.length > 0) {
				set({ status: "validating" })

				if (debounce) {
					debounce(async () => {
						let error: ControlError | null = null
						for await (const validator of asyncValidators) {
							error = await validator(schema.value)
							if (error) break
						}
						set({ error, status: error ? "invalid" : "valid" })
					})
				}
			}
		},
		validate: () => {
			const { value, validators } = get()
			let error: ControlError | null = null
			let status: ControlStatus = "valid"

			for (const validator of validators) {
				const result = validator(value)
				if (result) {
					error = result
					status = "invalid"
					break
				}
			}

			set({ error, status })
		},
		asyncValidate: () => {
			const { value, asyncValidators } = get()

			if (asyncValidators.length === 0) return

			set({ status: "validating" })
			if (debounce) {
				debounce(async () => {
					let error: ControlError | null = null
					for await (const validator of asyncValidators) {
						error = await validator(value)
						if (error) break
					}
					set({ error, status: error ? "invalid" : "valid" })
				})
			}
		},
		setValidators: (validators) => set({ validators }),
		setAsyncValidators: (asyncValidators) => set({ asyncValidators }),
		clearValidators: () => set({ validators: [] }),
		clearAsyncValidators: () => set({ asyncValidators: [] }),
		setError: (error) => set({ error, status: error ? "invalid" : "valid" }),
		markAsDirty: () => set({ isDirty: true }),
		markAsPristine: () => set({ isDirty: false }),
		markAsTouched: () => set({ isTouched: true }),
		markAsUntouched: () => set({ isTouched: false }),
		enable: () => set({ isDisabled: false }),
		disable: () => set({ isDisabled: true }),
		readonly: () => set({ isReadonly: true }),
		readwrite: () => set({ isReadonly: false }),
		indeterminate: () => set({ isIndeterminate: true }),
		undeterminate: () => set({ isIndeterminate: false }),
	}))
}
