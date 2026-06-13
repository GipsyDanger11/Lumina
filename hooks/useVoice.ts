import { useState, useCallback } from "react";
import { useAudioRecorder, RecordingPresets, setAudioModeAsync, requestRecordingPermissionsAsync } from "expo-audio";
import { transcribeAudio } from "../lib/whisper";
import { speak, stopSpeaking } from "../lib/tts";

export function useVoice() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = useCallback(async () => {
    try {
      await stopSpeaking();
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) return;

      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      console.error("Recording error:", error);
    }
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recorder.isRecording) return null;

    setIsTranscribing(true);

    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      const uri = recorder.uri;
      if (uri) {
        const text = await transcribeAudio(uri);
        setTranscript(text);
        setIsTranscribing(false);
        return text;
      }
    } catch (error) {
      console.error("Stop recording error:", error);
    }

    setIsTranscribing(false);
    return null;
  }, [recorder]);

  const speakText = useCallback(async (text: string) => {
    await speak(text);
  }, []);

  return {
    isRecording: recorder.isRecording,
    isTranscribing,
    transcript,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
    setTranscript,
  };
}
