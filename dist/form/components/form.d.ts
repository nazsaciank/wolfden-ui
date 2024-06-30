import React from "react";
import { FormGroup } from "../types";
type FormProps<T extends object = any> = React.ComponentProps<"form"> & {
    group: FormGroup<T>;
    onSubmit?: (values: T) => void;
};
export declare function Form<T extends object = any>({ group, children, onSubmit, ...props }: FormProps<T>): React.JSX.Element;
export {};
