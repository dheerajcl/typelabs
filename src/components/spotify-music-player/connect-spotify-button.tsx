import { ChevronUp, Loader2, Music2Icon } from 'lucide-react'
import sf from 'seconds-formater'
import { cn } from '@/utils/class-names.utils'
import { Button } from '@/components/ui/button'
import spotifyIcon from '@/assets/svgs/spotify-icon.svg'
import { useUserQuery } from '@/react-query/queries/current-user.query'

sf.change('MM:SS')

export const ConnectSpotifyButton = () => {
  const { data, isLoading } = useUserQuery()

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <img className='h-4 w-4' src={spotifyIcon} />
          Loading
          <Loader2 className='h-4 w-4 animate-spin' />
        </>
      )
    }
    if (data) {
      const userImage = data.images?.[0].url
      return (
        <>
          <img
            className={cn('mr-1 h-4 w-4 rounded-full', {
              'h-6 w-6 outline outline-1 outline-offset-2 outline-primary':
                userImage,
            })}
            src={data.images?.[0].url || spotifyIcon}
          />
          <div className='flex items-center gap-1'>
            {data?.display_name}
            <Music2Icon className='h-4 w-4 text-muted-foreground' />
          </div>
          <ChevronUp className='h-4 w-4' />
        </>
      )
    }

    return (
      <button
        // onClick={() => spotifyClient.authenticate()}
        className='flex items-center gap-2'
      >
        <img className='h-4 w-4' src={spotifyIcon} /> Connect Spotify
      </button>
    )
  }

  return (
    <Button variant='ghost' className='grouprelative items-center gap-2'>
      {renderContent()}
    </Button>
  )
}
