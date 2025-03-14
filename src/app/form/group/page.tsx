"use client"
import { useFormGroup } from "@/modules/forms"
import { PageProps } from "@lib/system"
import { useEffect } from "react"

interface FormGroupPageProps extends PageProps<any> {}

export default function FormGroupPage({}: FormGroupPageProps) {
	const fForm = useFormGroup({
		name: { value: "" },
		email: { value: "nazareno.ciancaglini" },
		password: { value: "" },
	})

	useEffect(() => {
		console.log(fForm)

		fForm.controls.email.getState().setValue("nazareno.ciancaglini@gmail.com")
	}, [])

	return (
		<div className="w-1/2 mx-auto my-20 bg-content-800 text-black p-4 rounded-md">
			<form className="flex flex-col gap-4">
				<input name="name" />
				<input name="email" value={fForm.get("email").value} onChange={(e) => fForm.get("email").setValue(e.currentTarget.value)} />
			</form>
			<pre>{JSON.stringify(fForm, null, 2)}</pre>
		</div>
	)
}
