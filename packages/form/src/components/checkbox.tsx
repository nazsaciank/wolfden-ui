"use client"
import React, { forwardRef, useEffect } from "react"
import { useCheckbox } from "../hooks/use-checkbox"
import { useFormControl } from "../hooks/use-form-control"
import { ControlProps } from "../types"

export type CheckboxProps = ControlProps & Omit<React.ComponentProps<"input">, "type">

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ name, control, checked, defaultChecked, validators, asyncValidators, mask, parse, disabled, onChangeValue, onChangeError, onChangeStatus, debounce, ...props },
	ref
) {
	const fControl = useFormControl({ value: checked ?? defaultChecked, validators, asyncValidators, mask, parse, disabled }, { name, control, debounce })
	const inputProps = useCheckbox(fControl)

	useEffect(() => {
		onChangeValue?.(fControl.value, fControl)
	}, [fControl.value])

	useEffect(() => {
		onChangeError?.(fControl.error, fControl)
	}, [fControl.error])

	useEffect(() => {
		onChangeStatus?.(fControl.status, fControl)
	}, [fControl.status])

	return <input ref={ref} type="checkbox" {...props} {...inputProps} />
})
