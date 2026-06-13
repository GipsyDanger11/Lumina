import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "lumina_token";

let cachedToken: string | null = null;

async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  return cachedToken;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export async function clearToken() {
  cachedToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(method: string, path: string, body?: any): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error: ${res.status}`);
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: any) => request<T>("POST", path, body),
  put: <T>(path: string, body?: any) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};

// --- Auth ---
export type AuthResponse = { token: string; user: { id: string; email?: string; name: string } };

export const authApi = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>("/api/auth/register", { email, password, name }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/login", { email, password }),

  google: (email: string, name: string, googleId: string) =>
    api.post<AuthResponse>("/api/auth/google", { email, name, googleId }),

  apple: (email: string, name: string, appleId: string) =>
    api.post<AuthResponse>("/api/auth/apple", { email, name, appleId }),

  me: () => api.get<{ user: any }>("/api/auth/me"),
};

// --- Profile ---
export const profileApi = {
  get: () => api.get<{ profile: any }>("/api/profile"),
  update: (data: any) => api.put<{ profile: any }>("/api/profile", data),
};

// --- Hydration ---
export const hydrationApi = {
  get: (date: string) => api.get<{ log: { total_ml: number; entries: any[] } }>(`/api/hydration/${date}`),
  put: (date: string, data: any) => api.put(`/api/hydration/${date}`, data),
  add: (date: string, ml: number) => api.post(`/api/hydration/${date}/add`, { ml }),
};

// --- Sleep ---
export const sleepApi = {
  get: (date: string) => api.get<{ log: any }>(`/api/sleep/${date}`),
  put: (date: string, data: any) => api.put(`/api/sleep/${date}`, data),
};

// --- Meals ---
export const mealsApi = {
  get: (date: string) => api.get<{ meals: any[] }>(`/api/meals/${date}`),
  add: (date: string, data: any) => api.post(`/api/meals/${date}`, data),
  del: (id: string) => api.del(`/api/meals/${id}`),
};

// --- Habits ---
export const habitsApi = {
  list: () => api.get<{ habits: any[] }>("/api/habits"),
  create: (data: any) => api.post("/api/habits", data),
  update: (id: string, data: any) => api.put(`/api/habits/${id}`, data),
  del: (id: string) => api.del(`/api/habits/${id}`),
};

// --- Habit Logs ---
export const habitLogsApi = {
  get: (date: string) => api.get<{ logs: Record<string, string> }>(`/api/habit-logs/${date}`),
  put: (date: string, habitId: string, status: string) =>
    api.put(`/api/habit-logs/${date}/${habitId}`, { status }),
};

// --- Memories ---
export const memoriesApi = {
  get: () => api.get<{ items: string[] }>("/api/memories"),
  add: (items: string[]) => api.post("/api/memories", { items }),
};

// --- Health ---
export type HealthSummary = {
  hydration: { total_ml: number; entries: any[] };
  sleep: any;
  meals: any[];
  habits: any[];
  todayHabitLogs: Record<string, string>;
};

export const healthApi = {
  summary: () => api.get<HealthSummary>("/api/health/summary"),
  weeklyHydration: () => api.get<{ data: Record<string, number> }>("/api/health/weekly-hydration"),
  streak: () => api.get<{ streak: number }>("/api/health/streak"),
};
