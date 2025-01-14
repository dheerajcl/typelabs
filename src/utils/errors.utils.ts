export type Result<TError, TData> = [null, TData] | [TError, null]

export function failable<TError extends Error, TData>(
  failable: () => TData,
): Result<TError, TData> {
  try {
    return [null, failable()]
  } catch (err) {
    return [err as TError, null]
  }
}
failable.async = canFailAsync

async function canFailAsync<TError extends Error, TData>(
  failable: () => TData,
): Promise<Result<TError, TData>> {
  try {
    return [null, await failable()]
  } catch (err) {
    return [err as TError, null]
  }
}
