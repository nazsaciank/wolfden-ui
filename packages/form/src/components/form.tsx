"use client"
import { PolymorphicProps } from "@wolfden-ui/system"
import { ElementType, FormEvent, useMemo } from "react"
import { FormContext } from "../context"
import { FormGroup } from "../types"

export type FormProps<E extends ElementType, T extends object = any> = Omit<PolymorphicProps<E>, "onSubmit"> & {
	group: FormGroup<T>

	onSubmit?: (values: T) => void
}

export function Form<E extends ElementType = "form">({ as, group, onSubmit, children, ...props }: FormProps<E>) {
	const As = useMemo(() => as || "form", [as])

	function handleOnSubmit(ev: FormEvent<HTMLFormElement>) {
		ev.preventDefault()

		if (onSubmit) onSubmit(group.values)
	}
	return (
		<FormContext.Provider value={{ findControl: group?.find }}>
			{/* @ts-ignore */}
			<As onSubmit={handleOnSubmit} {...props}>
				{children}
			</As>
		</FormContext.Provider>
	)
}
