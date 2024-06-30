import { FormGroup } from "./types";
export interface FormContextProps {
    findControl?: FormGroup<any>["get"];
}
export declare const FormContext: import("react").Context<FormContextProps | undefined>;
