/**
 * @deprecated use Object#applies instead e.g. new MyType().applies(function(): void {...})
 */
export function apply<T>(it: T, action: (it: T) => void): T {
  action(it);
  return it;
}

/**
 * @deprecated use global withIt instead
 */
export function withIt<T>(it: T, action: (it: T) => void): void {action(it)}

/**
 * checks, whether 'value' is defined
 * @param value
 */
export function isDefined(value: any): boolean {
    return typeof value !== "undefined" && value !== null;
}