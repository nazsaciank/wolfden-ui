"use client"
import { ControlRef, FormControl } from "../types"

export function useRadio<R extends HTMLInputElement>(value: string, control: FormControl): ControlRef<R> {
    function onChange(event: React.ChangeEvent<R>) {
        const target = event.target

        control.setValue(target.value)
    }

    function onFocus(event: React.FocusEvent<R>) {
        if (!control.isTouched) control.markAsTouched()
    }

    return {
        name: control.name,
        value,
        checked: control.value === value,
        onChange,
        onFocus,
    }
}
