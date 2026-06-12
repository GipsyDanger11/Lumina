const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export async function transcribeAudio(uri: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "audio/m4a",
    name: "recording.m4a",
  } as any);
  formData.append("model", "whisper-large-v3-turbo");
  formData.append("language", "en");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Whisper API error: ${err}`);
  }

  const data = await response.json();
  return data.text;
}
