import * as Speech from "expo-speech";

let isSpeaking = false;

export async function speak(text: string, onDone?: () => void) {
  if (isSpeaking) {
    await Speech.stop();
  }
  isSpeaking = true;
  Speech.speak(text, {
    language: "en-US",
    rate: 0.95,
    pitch: 1.0,
    onDone: () => {
      isSpeaking = false;
      onDone?.();
    },
    onError: () => {
      isSpeaking = false;
      onDone?.();
    },
  });
}

export async function stopSpeaking() {
  if (isSpeaking) {
    await Speech.stop();
    isSpeaking = false;
  }
}

export function getIsSpeaking() {
  return isSpeaking;
}
