import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  increment,
  arrayUnion,
  serverTimestamp,
} from "./firebase";

export async function executeToolCall(
  toolName: string,
  args: any,
  userId: string
): Promise<{ success: boolean; confirmation: string; data?: any }> {
  const today = new Date().toISOString().split("T")[0];

  switch (toolName) {
    case "log_water": {
      const ref = doc(db, `users/${userId}/logs/hydration/${today}`);
      await setDoc(
        ref,
        {
          entries: arrayUnion({
            amount_ml: args.amount_ml,
            beverage_type: args.beverage_type || "water",
            timestamp: args.timestamp || new Date().toISOString(),
          }),
          total_ml: increment(args.amount_ml),
          last_updated: serverTimestamp(),
        },
        { merge: true }
      );
      return {
        success: true,
        confirmation: `Logged ${args.amount_ml}ml of ${args.beverage_type || "water"}`,
      };
    }

    case "log_sleep": {
      const ref = doc(db, `users/${userId}/logs/sleep/${args.date || today}`);
      await setDoc(
        ref,
        {
          hours: args.hours,
          quality: args.quality || "okay",
          bedtime: args.bedtime || null,
          wake_time: args.wake_time || null,
          logged_at: serverTimestamp(),
        },
        { merge: true }
      );
      return {
        success: true,
        confirmation: `Logged ${args.hours} hours of sleep`,
      };
    }

    case "complete_habit": {
      const habitsSnap = await getDocs(
        query(
          collection(db, `users/${userId}/habits`),
          where("name", ">=", args.habit_name.toLowerCase()),
          where("name", "<=", args.habit_name.toLowerCase() + "\uf8ff")
        )
      );
      if (!habitsSnap.empty) {
        const habitId = habitsSnap.docs[0].id;
        const logRef = doc(db, `users/${userId}/habit_logs/${today}/${habitId}`);
        await setDoc(logRef, {
          status: args.status,
          timestamp: args.timestamp || new Date().toISOString(),
        });
        return {
          success: true,
          confirmation: `Marked "${habitsSnap.docs[0].data().name}" as ${args.status}`,
        };
      }
      return { success: false, confirmation: `Habit not found: ${args.habit_name}` };
    }

    case "create_habit": {
      const habitsRef = collection(db, `users/${userId}/habits`);
      const newHabit = await setDoc(doc(habitsRef), {
        name: args.name,
        frequency: args.frequency,
        time_of_day: args.time_of_day || "anytime",
        icon: args.icon || "check",
        color: "#7C6FF7",
        created_at: serverTimestamp(),
        active: true,
      });
      return {
        success: true,
        confirmation: `Created habit: "${args.name}"`,
      };
    }

    case "log_meal": {
      const ref = doc(db, `users/${userId}/logs/meals/${today}`);
      await setDoc(
        ref,
        {
          entries: arrayUnion({
            meal_type: args.meal_type,
            description: args.description,
            calories: args.calories || null,
            timestamp: args.timestamp || new Date().toISOString(),
          }),
          last_updated: serverTimestamp(),
        },
        { merge: true }
      );
      return {
        success: true,
        confirmation: `Logged ${args.meal_type}: ${args.description}`,
      };
    }

    case "log_mood": {
      const ref = doc(db, `users/${userId}/mood_logs/${today}`);
      await setDoc(
        ref,
        {
          mood: args.mood,
          energy: args.energy || args.mood,
          note: args.note || null,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      return {
        success: true,
        confirmation: `Logged mood: ${args.mood}/5`,
      };
    }

    case "get_health_summary": {
      const summary = await fetchHealthSummary(userId, args.period);
      return { success: true, data: summary, confirmation: "Here's your health summary" };
    }

    case "get_insight": {
      const data = await fetchHealthSummary(userId, "this_week");
      return { success: true, data, confirmation: "Here's your insight" };
    }

    case "update_goal": {
      const profileRef = doc(db, `users/${userId}/profile/main`);
      await updateDoc(profileRef, { [`goals.${args.goal_type}`]: args.value });
      return {
        success: true,
        confirmation: `Updated ${args.goal_type} goal to ${args.value}`,
      };
    }

    default:
      return { success: false, confirmation: "Unknown tool" };
  }
}

async function fetchHealthSummary(userId: string, period: string) {
  const today = new Date();
  const summary: Record<string, any> = {};

  // Fetch hydration
  const hydrationSnap = await getDocs(collection(db, `users/${userId}/logs/hydration`));
  let totalWater = 0;
  hydrationSnap.docs.forEach((d) => {
    const data = d.data();
    totalWater += data.total_ml || 0;
  });
  summary.total_water_ml = totalWater;

  // Fetch sleep
  const sleepSnap = await getDocs(collection(db, `users/${userId}/logs/sleep`));
  let totalSleep = 0;
  let sleepCount = 0;
  sleepSnap.docs.forEach((d) => {
    const data = d.data();
    totalSleep += data.hours || 0;
    sleepCount++;
  });
  summary.avg_sleep = sleepCount > 0 ? totalSleep / sleepCount : 0;

  // Fetch habits
  const habitsSnap = await getDocs(collection(db, `users/${userId}/habits`));
  summary.total_habits = habitsSnap.size;

  return summary;
}
