import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHasFocus } from '@/hooks/use-has-focus.hook';
import { VALID_CHARACTERS_SET } from '@/config/game.config';
import { engineStore } from '@/state/game-engine.store';
import { useMetricsStore } from '@/state/metrics.store';
import { TimerStore } from '@/state/timer.store';
import { AppStore } from '@/state/app-store';
import { KeyStats } from '@/state/statistics.store';
import { useStatisticsStore } from '@/state/statistics.store';
import { calculateConsistency } from '@/utils/statistics.utils';
import { metricsStore } from '@/state/metrics.store';

export const EngineProvider = () => {
  const {
    textAreaFocus: hasFocus,
    userInput,
    textString,
    setTextAreaFocus,
    setCaretPosition,
    setUserInput,
    generateText,
  } = engineStore();

  const { updateMetrics } = useMetricsStore('updateMetrics');
  const { totalTime, hasTimerEnded, isRunning, startTimer } = TimerStore.useStore(
    'totalTime',
    'hasTimerEnded',
    'isRunning',
    'startTimer'
  );

  useHasFocus({
    onBlur: () => setTextAreaFocus(false),
  });

  const backspace = () => setUserInput(userInput.slice(0, -1));

  const ctrlBackspace = () => {
    const userInputArr = userInput.split('');
    userInputArr.pop();
    while (userInputArr.at(-1)?.trim()) userInputArr.pop();
    setUserInput(userInputArr.join(''));
  };

  const handleKeyInput = (e: KeyboardEvent) => {
    if (VALID_CHARACTERS_SET.has(e.key)) {
      const { isPaused } = TimerStore.store.getState();
      const { userInput, textString } = engineStore.getState();

      if (isPaused || !userInput) {
        startTimer();
        metricsStore.getState().resetMetrics();
      }

      const newInput = userInput + e.key;
      setUserInput(newInput);

      const elapsed = (Date.now() - TimerStore.store.getState().startTime) / 1000;
      if (elapsed > 0) {
        const instantRawWpm = Math.round((newInput.length / 5) / (elapsed / 60));
        const isError = e.key !== textString[newInput.length - 1];

        let errors = 0;
        for (let i = 0; i < newInput.length; i++) {
          if (newInput[i] !== textString[i]) errors++;
        }
        const accuracy = (newInput.length - errors) / newInput.length;
        const instantWpm = Math.round(instantRawWpm * accuracy);

        metricsStore.getState().addInstantMetrics(instantWpm, isError);
      }
    }
  };

  const updateCaretPosition = () => {
    const { userInput } = engineStore.getState();
    const letter = document.getElementById(`letter-${userInput.length}`);
    if (!letter) return;

    const fontSize = AppStore.store.getState().fontSize;

    const newPos = {
      x: letter.offsetLeft,
      y: letter.offsetTop + fontSize * 1.6,
    };
    setCaretPosition(newPos);
  };

  const calculateResults = () => {
    if (!hasTimerEnded) return;

    const errorPercentage = getErrorPercentage(userInput, textString);
    const cpm = (userInput.length / totalTime) * 60;
    const rawWpm = cpm / 5;
    const accuracy = 100 - errorPercentage;
    const wpm = (accuracy / 100) * rawWpm;

    const { keyStrokes, errorKeys } = collectKeyStats();

    updateMetrics({
      errorPercentage,
      cpm,
      rawWpm,
      wpm,
      keyStrokes,
      errorKeys,
      instantWpm: wpm,
      wpmHistory: metricsStore.getState().wpmHistory,
      errorHistory: metricsStore.getState().errorHistory,
    });

    useStatisticsStore.getState().addTestResult({
      wpm,
      rawWpm,
      accuracy,
      duration: totalTime,
      keyStrokes,
      errorKeys,
      consistencyScore: calculateConsistency(keyStrokes),
      originalText: textString,
    });
  };

  const collectKeyStats = () => {
    const { userInput, textString } = engineStore.getState();
    const keyStrokes: KeyStats[] = [];
    const errorKeys: string[] = [];

    for (let i = 0; i < userInput.length; i++) {
      const expected = textString[i];
      const actual = userInput[i];
      const isError = expected !== actual;

      if (isError) {
        errorKeys.push(actual);
      }

      keyStrokes.push({
        key: actual,
        accuracy: isError ? 0 : 1,
        speed: 1,
        usageCount: 1,
      });
    }

    return { keyStrokes, errorKeys };
  };

  useEffect(() => {
    generateText();
    window.addEventListener('resize', updateCaretPosition);
    return () => window.removeEventListener('resize', updateCaretPosition);
  }, []);

  useEffect(() => {
    if (!hasFocus && isRunning) return setTextAreaFocus(false);
    if (isRunning) setTextAreaFocus(true);
  }, [hasFocus]);

  useEffect(updateCaretPosition, [userInput, textString]);
  useEffect(calculateResults, [hasTimerEnded]);

  useHotkeys('backspace', backspace, { ignoreModifiers: !hasFocus });
  useHotkeys('ctrl+backspace', ctrlBackspace, { ignoreModifiers: !hasFocus });
  useHotkeys('*', handleKeyInput, {
    ignoreEventWhen: () => !engineStore.getState().textAreaFocus,
  });

  return null;
};

const getErrorPercentage = (input: string, trueStr: string) => {
  let errors = 0;
  const total = input.length;
  for (const i in input.split('')) {
    if (input[i] !== trueStr[i]) errors++;
  }
  return (errors * 100) / total;
};
