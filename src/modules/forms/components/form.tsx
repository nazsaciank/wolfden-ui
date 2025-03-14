import { Kick } from "@lib/system/dist"
import React from "react"
import { useFormGroup } from "../hooks/use-form-group"
import { FormGroup } from "../interfaces/group"

export type FormProps<T extends object = any> = Kick<React.ComponentProps<"form">, "children"> & {
	format: "json" | "form" | "urlencoded"

	group?: FormGroup<T>

	onSubmit?: (data: T, group: FormGroup<T>) => void

	children: React.ReactNode | ((group: FormGroup<T>) => React.ReactNode)
}

export function Form<T extends object = any>({ group, format, onSubmit, children, ...props }: FormProps<T>) {
	const fGroup = useFormGroup({})

	function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (fGroup.isInvalid) return

		let data = fGroup.toJSON()
		if (format === "form") data = fGroup.toForm()
		else if (format === "urlencoded") data = fGroup.toUrlEncoded()

		if (onSubmit) onSubmit(data, fGroup)
	}

	return (
		<form onSubmit={handleOnSubmit} {...props}>
			{typeof children === "function" ? children(fGroup) : children}
		</form>
	)
}
