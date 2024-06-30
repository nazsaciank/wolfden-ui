import { FormArraySchema, FormArrayState, FormControlSchema, FormControlState, FormGroupSchema, FormGroupState, ValidatorError } from "../types"

export function initialControlState(name: string, schema: FormControlSchema): FormControlState {
    let { value, validators = [], asyncValidators = [], mask, parse, isDirty = false, isTouched = false, isDisabled = false, isIndeterminate = false } = schema

    let masked = value
    if (mask && value) {
        if (typeof value !== "string") value = String(value)
        for (let i = 0; i < value.length; i++) {
            let character = value[i]
            masked += mask(character, i, value)
        }
    }

    let parsed = parse ? parse(masked) : value

    let error: ValidatorError | null = null
    for (const validator of validators) {
        let result = validator(value)
        if (!result) continue
        error = result
        break
    }

    return {
        name,
        value: value || null,
        parsed: parsed || null,
        masked: masked || "",
        error: error || null,
        status: asyncValidators.length > 0 ? "PENDING" : error ? "INVALID" : "VALID",
        isDirty,
        isTouched,
        isDisabled,
        isIndeterminate,
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
