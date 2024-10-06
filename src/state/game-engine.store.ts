import { ID_TEXT_AREA } from '@/config/ids.config'
import words from '@/config/words.config'
import { timerStore } from './timer.store'
import { createSelector } from 'better-zustand-selector'
import { create } from 'zustand'

export type EngineStore = {
  text: string[]
  textString: string
  caretPosition: { x: number; y: number }
  userInput: string
  textAreaFocus: boolean

  setTextAreaFocus: (textAreaFocus: boolean) => void
  setText: (text: EngineStore['text']) => void
  setCaretPosition: (newPos: EngineStore['caretPosition']) => void
  setUserInput: (newUserInput: EngineStore['userInput']) => void

  restart: () => void
  generateText: () => void
  appendText: () => void
  focusTextArea: () => void
}

export const engineStore = create<EngineStore>((set, get) => ({
  text: [],
  textString: '',
  caretPosition: { x: 0, y: 0 },
  userInput: '',
  textAreaFocus: true,
  /********************************************************************/
  setTextAreaFocus: (textAreaFocus: boolean) => {
    timerStore.getState().pauseTimer()
    set({ textAreaFocus })
  },
  setCaretPosition: (caretPosition: EngineStore['caretPosition']) => {
    set({ caretPosition })
  },
  setUserInput: (userInput: EngineStore['userInput']) => {
    set({ userInput })
  },
  setText: (text: EngineStore['text']) => {
    set({ text, textString: text.join(' ') })
  },

  restart: () => {
    const { focusTextArea, setUserInput, setCaretPosition } = get()

    focusTextArea()
    setUserInput('')
    setCaretPosition({ x: 0, y: 0 })

    timerStore.getState().resetTimer()
  },
  generateText: () => {
    const { focusTextArea, restart, setText } = get()
    const { setHasTimerEnded, resetTimer } = timerStore.getState()

    focusTextArea()
    setHasTimerEnded(false)
    resetTimer()

    const currText = []

    while (currText.length < 45) {
      const index = (Math.random() * (words.length - 1)) >> 0
      currText.push(words[index])
    }

    restart()
    setText(currText)
  },
  appendText: () => {
    const { text, setText } = get()
    const newWords = [...text]

    while (newWords.length < text.length + 45) {
      const index = (Math.random() * words.length) >> 0
      newWords.push(words[index])
    }

    setText(newWords)
  },
  focusTextArea: () => document.getElementById(ID_TEXT_AREA)?.focus(),
}))

export const useEngine = createSelector(engineStore)
