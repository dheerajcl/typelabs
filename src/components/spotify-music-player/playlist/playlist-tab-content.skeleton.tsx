import { Skeleton } from '../../ui/skeleton'

export const PlaylistTabContentSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-4'>
      <Skeleton className='relative flex h-[13rem] w-full min-w-[22rem] items-end overflow-hidden bg-cover bg-center px-4 py-2' />
      <div className='flex h-full w-full flex-col gap-2'>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className='relative flex h-14 w-full min-w-[22rem] items-end overflow-hidden bg-cover bg-center px-4 py-2'
            />
          ))}
      </div>
    </div>
  )
}
