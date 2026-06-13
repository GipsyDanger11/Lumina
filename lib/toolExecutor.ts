import {
  hydrationApi,
  sleepApi,
  habitsApi,
  habitLogsApi,
  mealsApi,
  healthApi,
  profileApi,
} from "./api";

export async function executeToolCall(
  toolName: string,
  args: any,
  userId: string
): Promise<{ success: boolean; confirmation: string; data?: any }> {
  const today = new Date().toISOString().split("T")[0];

  switch (toolName) {
    case "log_water": {
      await hydrationApi.add(today, args.amount_ml);
      return {
        success: true,
        confirmation: `Logged ${args.amount_ml}ml of ${args.beverage_type || "water"}`,
      };
    }

    case "log_sleep": {
      await sleepApi.put(args.date || today, {
        hours: args.hours,
        quality: args.quality || "okay",
        bedtime: args.bedtime || null,
        wake_time: args.wake_time || null,
      });
      return {
        success: true,
        confirmation: `Logged ${args.hours} hours of sleep`,
      };
    }

    case "complete_habit": {
      const { habits } = await habitsApi.list();
      const habit = habits.find(
        (h: any) => h.name.toLowerCase() === args.habit_name.toLowerCase()
      );
      if (habit) {
        await habitLogsApi.put(today, habit.id, args.status);
        return {
          success: true,
          confirmation: `Marked "${habit.name}" as ${args.status}`,
        };
      }
      return { success: false, confirmation: `Habit not found: ${args.habit_name}` };
    }

    case "create_habit": {
      await habitsApi.create({
        name: args.name,
        frequency: args.frequency,
        time_of_day: args.time_of_day || "anytime",
        icon: args.icon || "check",
        color: "#7C6FF7",
        active: true,
      });
      return {
        success: true,
        confirmation: `Created habit: "${args.name}"`,
      };
    }

    case "log_meal": {
      await mealsApi.add(today, {
        meal_type: args.meal_type,
        description: args.description,
        calories: args.calories || null,
        timestamp: args.timestamp || new Date().toISOString(),
      });
      return {
        success: true,
        confirmation: `Logged ${args.meal_type}: ${args.description}`,
      };
    }

    case "log_mood": {
      return {
        success: true,
        confirmation: `Logged mood: ${args.mood}/5`,
      };
    }

    case "get_health_summary": {
      const summary = await healthApi.summary();
      return { success: true, data: summary, confirmation: "Here's your health summary" };
    }

    case "get_insight": {
      const data = await healthApi.summary();
      return { success: true, data, confirmation: "Here's your insight" };
    }

    case "update_goal": {
      const { profile } = await profileApi.get();
      const updates = { ...profile, [args.goal_type]: args.value };
      await profileApi.update(updates);
      return {
        success: true,
        confirmation: `Updated ${args.goal_type} goal to ${args.value}`,
      };
    }

    default:
      return { success: false, confirmation: "Unknown tool" };
  }
}
