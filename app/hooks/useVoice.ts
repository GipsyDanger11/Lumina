import { useState, useCallback, useRef } from "react";
import { Audio } from "expo-av";
import { transcribeAudio } from "../lib/whisper";
import { speak, stopSpeaking } from "../lib/tts";

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      await stopSpeaking();
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) return null;

    setIsRecording(false);
    setIsTranscribing(true);

    try {
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

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
  }, []);

  const speakText = useCallback(async (text: string) => {
    await speak(text);
  }, []);

  const stopSpeakingVoice = useCallback(async () => {
    await stopSpeaking();
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking: stopSpeakingVoice,
    setTranscript,
  };
}
