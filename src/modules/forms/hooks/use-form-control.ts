import { useDebounce } from "@lib/system/dist"
import { useContext, useEffect, useRef } from "react"
import { useStore } from "zustand"
import { createControl } from "../contexts/control"
import { FormGroupContext } from "../contexts/group"
import { ControlStore, FormControl, FormControlSchema } from "../interfaces/control"
import { FormGroup, FormGroupStore } from "../interfaces/group"

type SelectorFn<T> = ((state: FormControl<T>) => FormControl<T>) | ((state: FormGroup) => FormControl<T>)

export type UseFormControl = {
	name?: string
	control?: ControlStore
	debounce?: number
}

export function useFormControl<T = any>(schema: FormControlSchema<T>, opt: UseFormControl = {}) {
	const controllerRef = useRef<ControlStore | FormGroupStore>()
	const debounce = useDebounce(opt.debounce || 500)

	const context = useContext(FormGroupContext)
	if (context && opt.name) controllerRef.current = context

	if (opt.control) controllerRef.current = opt.control
	if (!controllerRef.current) controllerRef.current = createControl(schema, debounce)

	useEffect(() => {
		if (!controllerRef.current) return
		const state = controllerRef.current.getState()
		if ("error" in state) {
			if (!state.error && state.asyncValidators.length > 0) {
				state.asyncValidate()
			}
		}
	}, [])

	return useStore(controllerRef.current, (state) => {
		if ("controls" in state && opt.name) {
			return state.controls[opt.name]
		}
		return state
	})
}
