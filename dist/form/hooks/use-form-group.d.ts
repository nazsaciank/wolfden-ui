import { FormGroup, FormGroupSchema } from "../types";
export declare function useFormGroup<T extends object = any>(schema: FormGroupSchema<T>): FormGroup<T>;
