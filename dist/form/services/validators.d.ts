import { AsyncValidatorFn, ValidatorError } from "../types";
export declare class Validators {
    static required(value: any): ValidatorError | null;
    static email(value: any): ValidatorError | null;
    static delay(ms: number): AsyncValidatorFn;
}
