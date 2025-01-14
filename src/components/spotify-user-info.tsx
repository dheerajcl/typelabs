import { LogOut, Music2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useUserQuery } from '@/react-query/queries/spotify.query'

export function UserInfo() {
  const { data: user } = useUserQuery()
  if (!user) return null

  function logout() {
    window.spotifyClient.logOut()
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          tooltipContent={
            <div className='max-w-24 whitespace-normal text-left text-muted-foreground'>
              Logged in to spotify as:
              <b> {user.display_name}</b>
            </div>
          }
          tooltipContentProps={{ className: 'text-xs' }}
          className='h-fit gap-1 text-xs text-muted-foreground animate-in slide-in-from-right-10'
        >
          <Music2 className='h-3 w-3' />
          {user.display_name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={logout}
          className='w-full cursor-pointer gap-2 text-destructive'
        >
          <LogOut className='h-5 w-5' /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
