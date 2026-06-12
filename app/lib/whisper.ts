const OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions";

export async function transcribeAudio(uri: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key not configured");

  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "audio/m4a",
    name: "recording.m4a",
  } as any);
  formData.append("model", "whisper-1");
  formData.append("language", "en");

  const response = await fetch(OPENAI_API_URL, {
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
