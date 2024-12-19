"use client"
import React, { FormEvent, forwardRef } from "react"
import { FormContext } from "../context"
import { FormGroup } from "../types"

export type FormProps<T extends object = any> = Omit<React.ComponentProps<"form">, "onSubmit"> & {
	group: FormGroup<T>

	onSubmit?: (values: T) => void
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form({ group, onSubmit, children, ...props }, ref) {
	function handleOnSubmit(ev: FormEvent<HTMLFormElement>) {
		ev.preventDefault()

		if (onSubmit) onSubmit(group.values)
	}

	return (
		<FormContext.Provider value={{ findControl: group?.find }}>
			<form ref={ref} onSubmit={handleOnSubmit} {...props}>
				{children}
			</form>
		</FormContext.Provider>
	)
})
