"use client"
import Input from "@lib/components/form/input"
import { Form, useFormGroup, Validators } from "@lib/form"
import { PageProps } from "@lib/system"

interface FormGroupPageProps extends PageProps<any> {}

export default function FormGroupPage({}: FormGroupPageProps) {
	const fForm = useFormGroup({
		name: { value: "", validators: [Validators.required] },
		email: { value: "", validators: [Validators.required, Validators.email] },
		password: { value: "", validators: [Validators.required] },
	})

	return (
		<div className="w-1/2 mx-auto my-20 bg-content-800 p-4 rounded-md">
			<Form group={fForm} className="flex flex-col gap-4">
				<Input name="name" errorTip="Requerido" />
			</Form>
		</div>
	)
}
