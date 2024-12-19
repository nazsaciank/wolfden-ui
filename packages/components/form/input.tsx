import { ControlProps, FormControl, useFormControl, useTextfield, ValidatorError } from "@lib/form"
import { classnames, Kick } from "@lib/system"
import React, { forwardRef, useEffect } from "react"

type InputVariant = "outline" | "fill" | "underline"

export interface InputProps extends Kick<React.ComponentProps<"input">, "name">, ControlProps {
	variant?: InputVariant

	label?: React.ReactNode

	before?: React.ReactNode

	after?: React.ReactNode

	errorTip?: React.ReactNode | ((error: ValidatorError | null, control: FormControl) => React.ReactNode)

	infoTip?: React.ReactNode
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
	const {
		name,
		control: groupControl,
		debounce,
		value,
		disabled,
		validators,
		asyncValidators,
		mask,
		parse,
		onChangeValue,
		onChangeStatus,
		onChangeError,
		variant = "outline",
		label,
		before,
		after,
		errorTip,
		infoTip,
		className,
		...rest
	} = props
	const control = useFormControl({ value, disabled, validators, asyncValidators, mask, parse }, { name, control: groupControl, debounce })
	const textfield = useTextfield(control)

	useEffect(() => onChangeStatus && onChangeStatus(control.status, control), [control.status])
	useEffect(() => onChangeError && onChangeError(control.error, control), [control.error])
	useEffect(() => onChangeValue && onChangeValue(control.value, control), [control.value])

	return (
		<fieldset className={classnames("relative group mb-5 rounded-xl p-[2px]", className)}>
			<div className="absolute left-0 top-0 w-full h-full bg-content-100 overflow-hidden rounded-[inherit]">
				<div className="absolute left-0 top-0 w-5 h-5 shadow-cube shadow-content-600 animate-outline bg-content-600 rounded-[inherit]"></div>
			</div>
			<label className="block relative pt-2 pb-2 px-4 bg-content rounded-[inherit]">
				{label && <span>{label}</span>}
				<div className="flex flex-nowrap items-center gap-2">
					{before && <div className="flex-shrink-0">{before}</div>}
					<input className="w-full bg-transparent outline-none" {...textfield} {...rest} ref={ref} />
					{after && <div className="flex-shrink-0">{after}</div>}
				</div>
			</label>
			{errorTip && (control.isTouched || control.isDirty) && control.error ? (
				<span className="absolute w-full text-xs -bottom-5 text-danger">{typeof errorTip === "function" ? errorTip(control.error, control) : errorTip}</span>
			) : (
				infoTip && <span className="absolute w-full -bottom-5 text-info">{infoTip}</span>
			)}
		</fieldset>
	)
})
