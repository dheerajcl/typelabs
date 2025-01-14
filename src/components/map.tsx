import { ReactNode } from 'react'

export function For<Data extends unknown[] | readonly unknown[]>(props: {
  each: Data | undefined | null
  children: (instance: Data[number], idx: number) => ReactNode
  whenEmpty?: ReactNode
}) {
  if (!props.each || props.each.length == 0) return props?.whenEmpty || null
  const content = props.each.map((instance, i) => props.children(instance, i))
  return <>{content}</>
}
