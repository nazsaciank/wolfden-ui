"use client"
import React, { forwardRef, useEffect } from "react"
import { useFormControl } from "../hooks/use-form-control"
import { useTextfield } from "../hooks/use-textfield"
import { ControlProps } from "../types"

export type InputProps = ControlProps & React.ComponentProps<"input">

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ name, control, value, defaultValue, validators, asyncValidators, mask, parse, disabled, onChangeValue, onChangeError, onChangeStatus, debounce, ...props },
	ref
) {
	const fControl = useFormControl({ value: value ?? defaultValue, validators, asyncValidators, mask, parse, disabled }, { name, control, debounce })
	const inputProps = useTextfield<HTMLInputElement>(fControl)

	useEffect(() => {
		onChangeValue?.(fControl.value, fControl)
	}, [fControl.value])

	useEffect(() => {
		onChangeError?.(fControl.error, fControl)
	}, [fControl.error])

	useEffect(() => {
		onChangeStatus?.(fControl.status, fControl)
	}, [fControl.status])

	return <input ref={ref} {...props} {...inputProps} />
})
