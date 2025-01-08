import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk'
import App from './App.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { queryClient } from './config/react-query.config.ts'
import './globals.css'
import { EngineProvider } from './providers/engine.provider.tsx'
import { KeyboardAudioProvider } from './providers/keyboard-audio.provider.tsx'
import { StyleProvider } from './providers/style-provider.tsx'
import './styles/themes.css'
import { spotifyClient } from './config/spotify-client.config.ts'

export const PlayerProvider = (props: { children: React.ReactNode }) => {
  const getOAuthToken = async (callback: (accessToken: string) => void) => {
    const token = await spotifyClient.getAccessToken()
    if (token) callback(token.access_token)
  }

  return (
    <WebPlaybackSDK
      getOAuthToken={getOAuthToken}
      initialDeviceName='Typelabs'
      connectOnInitialized={true}
    >
      {props.children}
    </WebPlaybackSDK>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StyleProvider />
    <PlayerProvider>
      <TooltipProvider delayDuration={100}>
        <App />
        <Toaster />
        <EngineProvider />
        <KeyboardAudioProvider />
      </TooltipProvider>
    </PlayerProvider>
  </QueryClientProvider>,
)
