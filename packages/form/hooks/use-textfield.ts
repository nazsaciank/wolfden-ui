"use client"
import { useMemo } from "react"
import { ControlRef, FormControl } from "../types"

export function useTextfield<R extends HTMLElement>(control: FormControl): ControlRef<R> {
	function onChange(event: React.ChangeEvent<R>) {
		const target = event.target

		if (target instanceof HTMLInputElement) control.setValue(target.value)
		if (target instanceof HTMLTextAreaElement) control.setValue(target.value)
		if (target instanceof HTMLSelectElement) control.setValue(target.value)
	}

	function onFocus(event: React.FocusEvent<R>) {
		if (!control.isTouched) control.markAsTouched()
	}

	const value = useMemo(() => {
		if (!control.value) return ""

		return control.value
	}, [control.value])

	return {
		value,
		onChange,
		onFocus,
	}
}
