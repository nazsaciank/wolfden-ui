"use client"
import { Form, Input, useFormArray, Validators } from "@lib/form/index"
import { PageProps } from "@lib/system"
import { useEffect } from "react"

interface FormArrayPageProps extends PageProps<any> {}

export default function FormArrayPage({}: FormArrayPageProps) {
	const fInput = useFormArray([
		{
			name: {
				value: "",
				validators: [Validators.required],
			},
			email: {
				value: "",
				validators: [Validators.required, Validators.email],
			},
		},
	])

	useEffect(() => {
		console.log(fInput)
	}, [fInput])

	return (
		<div className="w-1/2 mx-auto my-20">
			<div className="bg-slate-800 rounded-md p-4">
				{fInput.map((group, at) => (
					<Form key={at} group={group} className="flex flex-col gap-3">
						<Input name="name" placeholder="Nombre" className="bg-slate-600 rounded-md p-2" />
						<Input name="email" placeholder="Email" className="bg-slate-600 rounded-md p-2" />
						<div className="flex justify-between">
							<button onClick={() => group.find("email")?.setValidators([Validators.required, Validators.email], false)}>Agregar validador</button>
							<button onClick={() => fInput.validate()}>Revalidar</button>
							<button onClick={() => fInput.remove(at)}>Eliminar</button>
						</div>
					</Form>
				))}

				<button
					onClick={() =>
						fInput.push({
							name: { value: "a", validators: [Validators.required] },
							email: { value: "a@a.com", validators: [Validators.required, Validators.email] },
						})
					}
				>
					Agregar
				</button>

				<button onClick={() => fInput.reset()}>Reset</button>
			</div>
		</div>
	)
}
