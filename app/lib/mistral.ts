const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-large-latest";

export const LUMINA_TOOLS = [
  {
    type: "function",
    function: {
      name: "log_water",
      description: "Log water or fluid intake for the user. Call this whenever the user mentions drinking anything.",
      parameters: {
        type: "object",
        properties: {
          amount_ml: { type: "number", description: "Amount in milliliters. Estimate if not explicit: glass=250ml, bottle=500ml, cup=200ml, coffee=150ml" },
          beverage_type: { type: "string", description: "Type of beverage: water, coffee, tea, juice, other" },
          timestamp: { type: "string", description: "ISO timestamp. Use current time unless user specifies otherwise." },
        },
        required: ["amount_ml"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_sleep",
      description: "Log sleep data. Call when user mentions sleep, waking up, going to bed, or sleep quality.",
      parameters: {
        type: "object",
        properties: {
          hours: { type: "number", description: "Total sleep duration in hours" },
          quality: { type: "string", enum: ["poor", "okay", "good", "great"] },
          bedtime: { type: "string", description: "ISO timestamp of when they went to bed" },
          wake_time: { type: "string", description: "ISO timestamp of when they woke up" },
          date: { type: "string", description: "YYYY-MM-DD date of the sleep night" },
        },
        required: ["hours"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "complete_habit",
      description: "Mark an existing habit as completed or skipped for today.",
      parameters: {
        type: "object",
        properties: {
          habit_name: { type: "string", description: "Name or partial name of the habit to match" },
          status: { type: "string", enum: ["completed", "skipped"] },
          timestamp: { type: "string", description: "ISO timestamp of completion" },
        },
        required: ["habit_name", "status"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_habit",
      description: "Create a new habit for the user.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          frequency: { type: "string", enum: ["daily", "weekdays", "weekends"] },
          time_of_day: { type: "string", enum: ["morning", "afternoon", "evening", "anytime"] },
          icon: { type: "string", description: "Suggested icon name from: meditation, walk, read, journal, water, sleep, exercise, stretch, supplement, breathe" },
        },
        required: ["name", "frequency"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_meal",
      description: "Log a meal or food item.",
      parameters: {
        type: "object",
        properties: {
          meal_type: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
          description: { type: "string", description: "What they ate" },
          calories: { type: "number", description: "Estimated calories if inferable" },
          timestamp: { type: "string", description: "ISO timestamp" },
        },
        required: ["meal_type", "description"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_mood",
      description: "Log mood and energy level.",
      parameters: {
        type: "object",
        properties: {
          mood: { type: "number", description: "1-5 scale. 1=very bad, 5=excellent" },
          energy: { type: "number", description: "1-5 scale. 1=exhausted, 5=very energetic" },
          note: { type: "string", description: "Optional context from what user said" },
        },
        required: ["mood"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_health_summary",
      description: "Fetch and summarize the user's health data for a given period.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", enum: ["today", "yesterday", "this_week", "last_week", "this_month"] },
        },
        required: ["period"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_insight",
      description: "Generate a personalized health insight or recommendation.",
      parameters: {
        type: "object",
        properties: {
          focus_area: { type: "string", enum: ["hydration", "sleep", "habits", "nutrition", "overall", "auto"] },
        },
        required: ["focus_area"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_goal",
      description: "Update a user's health goal or daily target.",
      parameters: {
        type: "object",
        properties: {
          goal_type: { type: "string", enum: ["water_ml", "sleep_hours", "bedtime", "wake_time"] },
          value: { type: "string", description: "New value for the goal" },
        },
        required: ["goal_type", "value"],
      },
    },
  },
];

export interface HealthContext {
  user: {
    name: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
    wake_time: string;
    bedtime: string;
    activity_level: string;
    goals: string[];
    water_goal_ml: number;
    sleep_goal_hours: number;
  };
  today: {
    date: string;
    water_ml: number;
    water_goal_ml: number;
    sleep_hours: number;
    sleep_quality: string;
    sleep_avg: number;
    habits_done: number;
    habits_total: number;
    meals_logged: number;
    mood: number | null;
    streak_days: number;
  };
  memories: string[];
  week_summary: Record<string, any>;
}

export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export async function callMistral(messages: Message[], tools?: any[]) {
  const apiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY;
  if (!apiKey) throw new Error("Mistral API key not configured");

  const body: any = {
    model: MISTRAL_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral API error: ${err}`);
  }

  return response.json();
}

export async function parseVoiceInput(text: string, fieldName: string): Promise<{ value: any; confidence: string }> {
  const messages: Message[] = [
    {
      role: "system",
      content: `Extract the following from this voice input: ${fieldName}.\n\nReturn ONLY a JSON object: { "value": <extracted_value>, "confidence": "high|low" }\n\nIf confidence is low, set value to null.`,
    },
    { role: "user", content: text },
  ];

  const response = await callMistral(messages);
  try {
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}
  return { value: null, confidence: "low" };
}

export async function extractObservations(
  messages: Message[],
  existingMemories: string[],
): Promise<string[]> {
  const recentMessages = messages.slice(-6);
  const chatText = recentMessages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const promptMessages: Message[] = [
    {
      role: "system",
      content: `You are extracting health observations from a conversation. Existing observations: ${existingMemories.join("; ") || "none"}. 
Return ONLY a JSON array of 1-2 concise new observations about this user's health, habits, preferences, or patterns. 
Each observation should be a single sentence (max 100 chars). Example: ["User prefers morning workouts", "User struggles with afternoon hydration"]. 
If there's nothing new, return an empty array.`,
    },
    { role: "user", content: chatText },
  ];

  try {
    const response = await callMistral(promptMessages);
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return [];
}

export async function runAgentLoop(
  userMessage: string,
  context: HealthContext,
  conversationHistory: Message[],
  userId: string,
  onToolCall?: (toolName: string, result: string) => void
): Promise<string> {
  const { buildSystemPrompt } = await import("./prompts");
  const { executeToolCall } = await import("./toolExecutor");

  const messages: Message[] = [
    { role: "system", content: buildSystemPrompt(context) },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 5;

  while (iterations < MAX_ITERATIONS) {
    const response = await callMistral(messages, LUMINA_TOOLS);
    const choice = response.choices[0];

    if (choice.finish_reason === "tool_calls") {
      const toolCalls = choice.message.tool_calls;
      messages.push(choice.message);

      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeToolCall(toolCall.function.name, args, userId);
        onToolCall?.(toolCall.function.name, result.confirmation);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
      iterations++;
    } else {
      return choice.message.content;
    }
  }
  return "I've updated your health data. Is there anything else you'd like to track?";
}
