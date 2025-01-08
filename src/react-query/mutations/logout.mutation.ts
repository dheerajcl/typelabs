import { UseMutationOptions, useMutation } from '@tanstack/react-query'
type OmittedKeys = 'mutationKey' | 'mutationFn'
type useLogoutOptions = Omit<
  UseMutationOptions<Response, Error, void, unknown>,
  OmittedKeys
>
export const useLogout = (options?: useLogoutOptions) =>
  useMutation({
    mutationKey: ['logout'],
    mutationFn: () =>
      fetch('api/logout', {
        method: 'POST',
        credentials: 'include',
      }),
    onSuccess: (...args) => {
      window.location.reload()
      options?.onSuccess?.(...args)
    },
    ...options,
  })
