import { FormControlState, FormGroupState } from "../types";
export type GroupPayload<T extends object = any> = (Partial<FormGroupState[keyof T]> & {
    path?: keyof T;
}) | FormGroupState;
export declare function formControl(state: FormControlState, payload: Partial<FormControlState>): {
    name: string;
    value: any;
    parsed: any;
    masked: string;
    status: import("../types").ControlStatus;
    error: import("../types").ValidatorError | null;
    isTouched: boolean;
    isDirty: boolean;
    isDisabled: boolean;
    isIndeterminate: boolean;
};
export declare function formGroup<T extends object = any>(state: FormGroupState<T>, payload: GroupPayload): (FormGroupState<T> & {
    [x: string]: (FormGroupState<T>[keyof T] & {
        [x: string]: FormControlState<any>;
    }) | (FormGroupState<T>[keyof T] & {
        name?: string | undefined;
        value?: any;
        parsed?: any;
        masked?: string | undefined;
        status?: import("../types").ControlStatus | undefined;
        error?: import("../types").ValidatorError | null | undefined;
        isTouched?: boolean | undefined;
        isDirty?: boolean | undefined;
        isDisabled?: boolean | undefined;
        isIndeterminate?: boolean | undefined;
    });
}) | (FormGroupState<T> & {
    payload: GroupPayload<any>;
});
