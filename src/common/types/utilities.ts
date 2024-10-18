/** Type for Object with unknown value type */
export type ObjectType = Record<string, any>;

/** Type that picks one prop from a existing type to be optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
