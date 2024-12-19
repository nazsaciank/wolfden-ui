export type Kick<T, K extends keyof T> = Omit<T, K>;

export type Nullable<V> = V | null;

export type NullableObject<T extends object> = { [K in keyof T]: Nullable<T[K]> };
