import { FormControlState, FormGroupState } from "../types"

export type GroupPayload<T extends object = any> =
    | (Partial<FormGroupState[keyof T]> & {
          path?: keyof T
      })
    | FormGroupState

export function formControl(state: FormControlState, payload: Partial<FormControlState>) {
    return {
        ...state,
        ...payload,
    }
}

export function formGroup<T extends object = any>(state: FormGroupState<T>, payload: GroupPayload) {
    const { path, ...body } = payload
    if (path) {
        return {
            ...state,
            [path as keyof FormGroupState<T>]: {
                ...state[path as keyof FormGroupState<T>],
                ...body,
            },
        }
    }
    return {
        ...state,
        payload,
    }
}
