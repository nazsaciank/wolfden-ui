import { createContext } from "react"
import { FormGroup } from "./types"

export interface FormContextProps {
	findControl?: FormGroup<any>["find"]
}

export const FormContext = createContext<FormContextProps | undefined>(undefined)
