import { useMutation, UseMutationOptions } from '@tanstack/react-query'

export type AuthorizationResponse = {
  accessToken: string
  expiresIn: number
}

type Props = Omit<
  UseMutationOptions<AuthorizationResponse, Error, string>,
  'mutationKey' | 'mutationFn'
>

export const useAuthorizationQuery = (props: Props) =>
  useMutation({
    mutationKey: ['spotify', 'auth'],
    mutationFn: async (code: string) => {
      const res = await fetch('api/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      })
      const { access_token, expires_in } = await res.json()
      return { accessToken: access_token, expiresIn: expires_in }
    },
    ...props,
  })
