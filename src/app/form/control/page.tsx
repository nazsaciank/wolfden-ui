"use client"
import { Input, useFormControl, Validators } from "@lib/form"
import { PageProps } from "@lib/system"
import { useEffect } from "react"

interface FormControlPageProps extends PageProps<any> {}

export default function FormControlPage({}: FormControlPageProps) {
	const fInput = useFormControl({ value: "nombre", validators: [Validators.required] })

	useEffect(() => {
		console.log(fInput)
	}, [fInput])

	return (
		<div className="w-1/2 mx-auto my-20">
			<Input name="name" control={fInput} className="bg-slate-600 rounded-md p-2" />
		</div>
	)
}
