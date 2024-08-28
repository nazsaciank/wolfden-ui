"use client"
import { Form, Input, Masks, useFormGroup, Validators } from "@lib/form"
import { PageProps } from "@lib/system"

interface FormGroupPageProps extends PageProps<any> {}

export default function FormGroupPage({}: FormGroupPageProps) {
	const fForm = useFormGroup({
		name: { value: "", validators: [Validators.required], mask: Masks.formatDate() },
		email: { value: "", validators: [Validators.required, Validators.email] },
		password: { value: "", validators: [Validators.required] },
	})

	return (
		<div className="w-1/2 mx-auto my-20 bg-slate-800 p-4 rounded-md">
			<Form group={fForm} className="flex flex-col gap-4">
				<Input name="name" placeholder="Nombre" className="bg-slate-600 rounded-md p-2" />
				<Input name="email" type="email" placeholder="Email" className="bg-slate-600 rounded-md p-2" />
				<Input name="password" type="password" placeholder="Contraseña" className="bg-slate-600 rounded-md p-2" />
				<button>Enviar</button>
			</Form>
		</div>
	)
}
