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
import { AppSettingsProvider } from './providers/app-settings.provider.tsx'

const getOAuthToken = async (callback: (accessToken: string) => void) => {
  if (!window.spotifyClient) return
  const token = await window.spotifyClient.getAccessToken()
  if (token) callback(token.access_token)
}

export const PlayerProvider = (props: { children: React.ReactNode }) => {
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
    <AppSettingsProvider />
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
