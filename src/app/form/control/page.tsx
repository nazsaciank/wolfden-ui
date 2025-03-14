"use client"
import { ControlError, useFormControl } from "@/modules/forms"
import { PageProps } from "@lib/system"

function required(value: string) {
	if (value == null || value == undefined || value == "") return { required: true }
	return null
}

function promise(value: string) {
	return new Promise<ControlError | null>((resolve) => {
		setTimeout(() => {
			resolve(null)
			// resolve({ promise: true })
		}, 2000)
	})
}

interface FormControlPageProps extends PageProps<any> {}

export default function FormControlPage({}: FormControlPageProps) {
	const controller = useFormControl({ value: "Nazareno", validators: [required], asyncValidators: [promise] })

	return (
		<div className="w-1/2 mx-auto my-20 bg-slate-900 p-4 rounded-md">
			<input name="name" value={controller.value} onChange={(e) => controller.setValue(e.currentTarget.value)} className="bg-slate-600 rounded-md p-2" />
			<pre>{JSON.stringify(controller, null, 2)}</pre>
		</div>
	)
}
