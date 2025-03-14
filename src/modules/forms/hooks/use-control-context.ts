import { useContext } from "react"
import { FormGroupContext } from "../contexts/group"

export function useControlContext(name: string) {
	const context = useContext(FormGroupContext)
	if (!context) throw new Error("FormGroupContext not found")
}
