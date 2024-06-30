"use client"
import React, { FormEvent } from "react"
import { FormGroup } from "../types"
import { FormContext } from "../context"

type FormProps<T extends object = any> = Omit<React.ComponentProps<"form">, "onSubmit"> & {
    group: FormGroup<T>

    onSubmit?: (values: T) => void
}

export function Form<T extends object = any>({ group, children, onSubmit, ...props }: FormProps<T>) {
    function handleOnSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()

        if (onSubmit) onSubmit(group.values)
    }

    return (
        <FormContext.Provider value={{ findControl: group?.get }}>
            <form onSubmit={handleOnSubmit} {...props}>
                {children}
            </form>
        </FormContext.Provider>
    )
}
