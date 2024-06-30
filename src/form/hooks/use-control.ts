"use client"
import { useRef } from "react"
import { ControlRef, FormControl } from "../types"

export function useControl<R extends HTMLElement>(control: FormControl): ControlRef<R> {
    const inputRef = useRef<R>(null)

    function onChange(event: React.ChangeEvent<R>) {
        const target = event.target

        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") {
                control.setValue(target.checked)
                return
            }
            control.setValue(target.value)
        }

        if (target instanceof HTMLSelectElement) {
            control.setValue(target.value)
        }

        if (target instanceof HTMLTextAreaElement) {
            control.setValue(target.value)
        }
    }

    function onFocus(event: React.FocusEvent<R>) {
        if (control.isTouched) control.markAsTouched()
    }

    if (inputRef.current) {
        const input = inputRef.current

        if (input instanceof HTMLInputElement) {
            if (input.type === "checkbox") {
                return {
                    ref: inputRef,
                    checked: control.value,
                    indeterminate: control.isIndeterminate,
                    disabled: control.isDisabled,
                    onChange,
                    onFocus,
                }
            }
        }
    }

    return {
        ref: inputRef,
        value: control.value,
        disabled: control.isDisabled,
        onChange,
        onFocus,
    }
}
