"use client"
import { PolymorphicProps } from "@wolfden-ui/system"
import { ElementType, FormEvent, ForwardedRef, forwardRef, useMemo } from "react"
import { FormContext } from "../context"
import { FormGroup } from "../types"

export type FormProps<E extends ElementType, T extends object = any> = Omit<PolymorphicProps<E>, "onSubmit"> & {
	group: FormGroup<T>

	onSubmit?: (values: T) => void
}

export const Form = forwardRef(function Form<E extends ElementType = "form", F = HTMLFormElement>({ as, group, onSubmit, children, ...props }: FormProps<E>, ref: ForwardedRef<F>) {
	const As = useMemo(() => as || "form", [as])

	function handleOnSubmit(ev: FormEvent<HTMLFormElement>) {
		ev.preventDefault()

		if (onSubmit) onSubmit(group.values)
	}

	return (
		<FormContext.Provider value={{ findControl: group?.find }}>
			{/* @ts-expect-error - ref is not supported on polymorphic components */}
			<As ref={ref} onSubmit={handleOnSubmit} {...props}>
				{children}
			</As>
		</FormContext.Provider>
	)
})
