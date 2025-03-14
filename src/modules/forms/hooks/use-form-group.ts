import { useDebounceMap } from "@lib/system/dist"
import { useEffect, useRef } from "react"
import { useStore } from "zustand"
import { formGroup } from "../contexts/group"
import { ControlStatus } from "../interfaces/common"
import { ControlStore } from "../interfaces/control"
import { AbstractError, FormGroupSchema, FormGroupStore } from "../interfaces/group"

export function useFormGroup<T extends Object = any>(schema: FormGroupSchema<T>) {
	const formGroupRef = useRef<FormGroupStore<T>>()

	const debounceMap = useDebounceMap(500)
	if (!formGroupRef.current) formGroupRef.current = formGroup(schema, debounceMap)

	useEffect(() => {
		if (!formGroupRef.current) return

		const group = formGroupRef.current
		const unsubscribers = Object.values(group.getState().controls).map((control: ControlStore) => {
			return control.subscribe(() => {
				const states = Object.values(group.getState().controls).map((control) => control.getState())

				const values: T = states.reduce((acc, state) => {
					acc[state.name] = state.value
					return acc
				}, {} as T)
				const errors: AbstractError<T> = states.reduce((acc, state) => {
					acc[state.name] = state.error
					return acc
				}, {})

				const isValid = states.every((state) => state.isValid)
				const isInvalid = states.some((state) => state.isInvalid)
				const isPending = states.some((state) => state.isPending)
				const status: ControlStatus = isPending ? "validating" : isInvalid ? "invalid" : "valid"

				const isAllTouched = states.every((state) => state.isTouched)

				group.setState({
					values,
					status,
					errors,
					isValid,
					isInvalid,
					isPending,
					isAllTouched,
				})
			})
		})

		return () => unsubscribers.forEach((unsub) => unsub())
	}, [])

	return useStore(formGroupRef.current)
}
