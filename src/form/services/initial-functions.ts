import { FormGroupSchema } from "../types"

export function initialValidators(schema: FormGroupSchema) {
    let validators: any = {}
    for (const [key, controlSchema] of Object.entries(schema)) {
        validators[key] = []
        if (controlSchema.validators) {
            validators[key] = controlSchema.validators
        }
    }

    return validators
}

export function initialAsyncValidators(schema: FormGroupSchema) {
    let validators: any = {}
    for (const [key, controlSchema] of Object.entries(schema)) {
        validators[key] = []
        if (controlSchema.asyncValidators) {
            validators[key] = controlSchema.asyncValidators
        }
    }

    return validators
}

export function initialMask(schema: FormGroupSchema) {
    let mask: any = {}
    for (const [key, controlSchema] of Object.entries(schema)) {
        mask[key] = controlSchema.mask || null
    }

    return mask
}

export function initialParse(schema: FormGroupSchema) {
    let parse: any = {}
    for (const [key, controlSchema] of Object.entries(schema)) {
        parse[key] = controlSchema.parse || null
    }

    return parse
}
