import { FormArraySchema, FormArrayState, FormControlSchema, FormControlState, FormGroupSchema, FormGroupState } from "../types";
export declare function initialControlState(name: string, schema: FormControlSchema): FormControlState;
export declare function initialGroupState(schema: FormGroupSchema): FormGroupState;
export declare function initialArrayState(schema: FormArraySchema): FormArrayState;
