import { ValidatorError, ValidatorFn } from "../types"

export interface FileValidator {
	types?: string[]
	extensions?: string[]
	maxSize?: number
}

export class Validators {
	static required(value: any): ValidatorError | null {
		if (value === undefined) return { required: true }
		if (value === null) return { required: true }
		if (value === "") return { required: true }
		return null
	}

	static requiredTrue(value: any): ValidatorError | null {
		if (value !== true) return { requiredTrue: true }
		if (value !== "true") return { requiredTrue: true }
		if (value !== 1) return { requiredTrue: true }
		return null
	}

	static pattern(pattern: string | RegExp): ValidatorFn {
		return function patternFn(value: any): ValidatorError | null {
			if (!value) return null
			if (typeof pattern === "string") pattern = new RegExp(pattern)
			if (!pattern.test(value)) return { pattern: { requiredPattern: pattern, actualValue: value } }
			return null
		}
	}

	static email(value: any): ValidatorError | null {
		if (!value) return null
		if (typeof value !== "string") return { email: true }
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return { email: true }
		return null
	}

	static enum(enumValues: any[]): ValidatorFn {
		return function enumFn(value: any): ValidatorError | null {
			if (!value) return null
			if (!enumValues.includes(value)) return { enum: { allowedValues: enumValues, actualValue: value } }
			return null
		}
	}

	static min(min: number): ValidatorFn {
		return function minFn(value: any): ValidatorError | null {
			if (!value) return null
			if (value < min) return { min: { requiredValue: min, actualValue: value } }
			return null
		}
	}

	static max(max: number): ValidatorFn {
		return function maxFn(value: any): ValidatorError | null {
			if (!value) return null
			if (value > max) return { max: { requiredValue: max, actualValue: value } }
			return null
		}
	}

	static minLength(min: number): ValidatorFn {
		return function minLengthFn(value: any): ValidatorError | null {
			if (!value) return null
			if (value.length < min) return { minLength: { requiredLength: min, actualLength: value.length } }
			return null
		}
	}

	static maxLength(max: number): ValidatorFn {
		return function maxLengthFn(value: any): ValidatorError | null {
			if (!value) return null
			if (value.length > max) return { maxLength: { requiredLength: max, actualLength: value.length } }
			return null
		}
	}

	static minDate(min: Date): ValidatorFn {
		return function minDateFn(value: any): ValidatorError | null {
			if (!value) return null
			if (typeof value === "string") value = new Date(value)
			if (typeof value === "number") value = new Date(value)
			if (value < min) return { minDate: { requiredDate: min, actualDate: value } }
			return null
		}
	}

	static maxDate(max: Date): ValidatorFn {
		return function maxDateFn(value: any): ValidatorError | null {
			if (!value) return null
			if (typeof value === "string") value = new Date(value)
			if (typeof value === "number") value = new Date(value)
			if (value > max) return { maxDate: { requiredDate: max, actualDate: value } }
			return null
		}
	}

	static file({ maxSize, types, extensions }: FileValidator = {}): ValidatorFn {
		return function fileFn(value: any): ValidatorError | null {
			if (!value) return null
			if (!(value instanceof File)) return { file: true }
			if (types && !types.includes(value.type)) return { fileType: { allowedTypes: types, actualType: value.type } }
			if (extensions && !extensions.includes(value.name.split(".").pop()!)) return { fileExtension: { allowedExtensions: extensions, actualExtension: value.name.split(".").pop()! } }
			if (maxSize && value.size > maxSize) return { fileSize: { maxSize, actualSize: value.size } }
			return null
		}
	}

	static files({ maxSize, types, extensions }: FileValidator = {}): ValidatorFn {
		return function filesFn(value: any): ValidatorError | null {
			if (!value) return null
			if (!(value instanceof FileList)) return { files: true }
			for (let i = 0; i < value.length; i++) {
				const file = value.item(i)!
				if (types && !types.includes(file.type)) return { fileType: { allowedTypes: types, actualType: file.type } }
				if (extensions && !extensions.includes(file.name.split(".").pop()!)) return { fileExtension: { allowedExtensions: extensions, actualExtension: file.name.split(".").pop()! } }
				if (maxSize && file.size > maxSize) return { fileSize: { maxSize, actualSize: file.size } }
			}
			return null
		}
	}
}
