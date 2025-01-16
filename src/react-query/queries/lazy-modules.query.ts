import { Theme } from '@/styles/theme.type'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

type Options = UseQueryOptions<Theme[]>
export function useThemes(opts: Partial<Options> = {}) {
  return useQuery({
    queryKey: ['theme-list'],
    queryFn: () =>
      import('@/styles/theme-list.json').then(
        (m) => m.default as unknown as Theme[],
      ),
    ...opts,
  })
}
