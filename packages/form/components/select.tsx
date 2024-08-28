"use client"
import React, { forwardRef, useEffect } from "react"
import { useFormControl } from "../hooks/use-form-control"
import { useTextfield } from "../hooks/use-textfield"
import { ControlProps } from "../types"

export type SelectProps = ControlProps & React.ComponentProps<"select">

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ name, control, value, defaultValue, validators, asyncValidators, mask, parse, disabled, onChangeValue, onChangeError, onChangeStatus, debounce, children, ...props },
	ref
) {
	const fControl = useFormControl({ value: value ?? defaultValue, validators, asyncValidators, mask, parse, disabled }, { name, control, debounce })
	const inputProps = useTextfield<HTMLSelectElement>(fControl)

	useEffect(() => {
		onChangeValue?.(fControl.value, fControl)
	}, [fControl.value])

	useEffect(() => {
		onChangeError?.(fControl.error, fControl)
	}, [fControl.error])

	useEffect(() => {
		onChangeStatus?.(fControl.status, fControl)
	}, [fControl.status])

	return (
		<select ref={ref} {...props} {...inputProps}>
			{children}
		</select>
	)
})
