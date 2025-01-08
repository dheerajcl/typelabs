export function getOS(): string {
  const osPatterns: Record<string, RegExp> = {
    windows: /Windows NT|Win/,
    mac: /Macintosh|Mac OS X|MacPPC|MacIntel|Mac OS/,
    linux: /Linux|X11/,
    android: /Android/,
    ios: /iPhone|iPad|iPod/,
    unix: /Unix/,
    blackberry: /BlackBerry|BB/,
    webos: /webOS|hpwOS/,
  }

  for (const [os, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(window.navigator.userAgent)) {
      return os
    }
  }

  return 'Unknown'
}
