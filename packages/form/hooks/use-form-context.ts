"use client"
import { useContext } from "react"
import { FormContext } from "../context"

export function useFormContext<T extends object = any>(path: keyof T) {
	const context = useContext(FormContext)
	if (!context || !context.findControl) return null
	return context.findControl(path)
}
