# TypeLabs

A modern, customizable typing application inspired by [monkeytype](https://monkeytype.com) built with React, TypeScript, and Vite. Practice your typing skills with a beautiful interface and extensive theme customization.

## Features

- 🎨 160+ Built-in themes
- 🎵 Spotify integration for music playback
- ⚡️ Fast and responsive typing experience
- ⌨️ Keyboard shortcuts support
- Sound effects and volume controls
- 🎯 Custom font support

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Query
- Shadcn UI Components
- Spotify Web API

## Getting Started


### Installation

1. Clone the repository:

```bash
git clone https://github.com/frstycodes/typelabs.git
cd typelabs
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory with your Spotify API credentials:

```bash
VITE_SPOTIFY_CLIENT_ID=your_client_id
```

4. Start the development server:

```bash
bun run dev
```


## Building for Production

To create a production build:

```bash
bun run build
```

## Project Structure

```
typelabs/
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── state/         # Zustand store and state management
│   ├── styles/        # Theme definitions and global styles
│   ├── utils/         # Utility functions
│   └── config/        # Configuration files
├── public/            # Static assets
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [monkeytype](https://monkeytype.com) and themes used from [monkeytype's github repo](https://github.com/monkeytypegame/monkeytype)
- Built with [shadcn/ui](https://ui.shadcn.com/) components
