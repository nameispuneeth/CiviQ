// Thin wrapper over the Web Speech API. Recognition happens entirely in the
// browser vendor's stack — no CiviQ backend involvement, no API cost.
//
// Support is uneven: Chrome and Edge ship it prefixed, Safari ships it
// prefixed from 14.1, Firefox does not ship it at all. Callers must handle
// isSpeechSupported() === false rather than assuming a recognizer exists.

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export function isSpeechSupported() {
  return Boolean(SpeechRecognition);
}

// en-IN biases the language model toward Indian English place names and
// accents, which is most of what gets dictated into a civic issue tracker.
export function createRecognizer(lang = "en-IN") {
  if (!SpeechRecognition) return null;

  const recognizer = new SpeechRecognition();
  recognizer.lang = lang;
  recognizer.interimResults = true; // show words as they are spoken
  recognizer.continuous = false; // stop on a natural pause
  recognizer.maxAlternatives = 1;

  return recognizer;
}

// Chrome reports these through onerror, and each one needs different wording:
// a denied permission is sticky (the browser will not re-prompt), while
// no-speech just means they said nothing.
export function describeSpeechError(code) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "🎤 Microphone access is blocked. Enable it in your browser's site settings.";
    case "no-speech":
      return "🎤 Didn't catch that — try again.";
    case "audio-capture":
      return "🎤 No microphone found.";
    case "network":
      return "🎤 Speech service unreachable. Check your connection.";
    default:
      return "🎤 Voice input failed. Please type instead.";
  }
}
