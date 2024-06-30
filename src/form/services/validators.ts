import { AsyncValidatorFn, ValidatorError } from "../types"

export class Validators {
    static required(value: any): ValidatorError | null {
        if (value === undefined) return { required: true }
        if (value === null) return { required: true }
        if (value === "") return { required: true }
        return null
    }

    static email(value: any): ValidatorError | null {
        if (!value) return null
        if (typeof value !== "string") return { email: true }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return { email: true }
        return null
    }

    static delay(ms: number): AsyncValidatorFn {
        return function delayFn(value: any): Promise<ValidatorError | null> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Validators.required(value))
                }, ms)
            })
        }
    }
}
