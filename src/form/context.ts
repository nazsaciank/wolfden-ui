import { createContext } from "react"
import { FormGroup } from "./types"

export interface FormContextProps {
    findControl?: FormGroup<any>["get"]
}

export const FormContext = createContext<FormContextProps | undefined>(undefined)
