"use client"
import { ControlRef, FormControl } from "../types"

export function useCheckbox<R extends HTMLInputElement>(control: FormControl): ControlRef<R> {
	function onChange(event: React.ChangeEvent<R>) {
		const target = event.target
		control.setValue(target.checked)
	}

	function onFocus(event: React.FocusEvent<R>) {
		if (!control.isTouched) control.markAsTouched()
	}

	return {
		checked: control.value || false,
		disabled: control.isDisabled,
		indeterminate: control.isIndeterminate ? "true" : undefined,
		onChange,
		onFocus,
	}
}
