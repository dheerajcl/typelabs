export function debounce<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay: number,
): (...args: TArgs) => TReturn {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: TArgs): TReturn {
    clearTimeout(timeoutId)
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    }) as TReturn
  }
}
