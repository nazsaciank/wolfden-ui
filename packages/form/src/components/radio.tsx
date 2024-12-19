"use client"
import React, { forwardRef, useEffect } from "react"
import { useFormControl } from "../hooks/use-form-control"
import { useRadio } from "../hooks/use-radio"
import { ControlProps } from "../types"

export type RadioProps = ControlProps &
	Omit<React.ComponentProps<"input">, "type" | "value"> & {
		value: string
	}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
	{ name, control, value, checked, defaultChecked, validators, asyncValidators, mask, parse, disabled, onChangeValue, onChangeError, onChangeStatus, debounce, ...props },
	ref
) {
	const fControl = useFormControl({ value: checked ?? defaultChecked, validators, asyncValidators, mask, parse, disabled }, { name, control, debounce })
	const inputProps = useRadio(value!, fControl)

	useEffect(() => {
		onChangeValue?.(fControl.value, fControl)
	}, [fControl.value])

	useEffect(() => {
		onChangeError?.(fControl.error, fControl)
	}, [fControl.error])

	useEffect(() => {
		onChangeStatus?.(fControl.status, fControl)
	}, [fControl.status])

	return <input type="radio" ref={ref} {...props} {...inputProps} />
})
