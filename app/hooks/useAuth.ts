import { useEffect, useState } from "react";
import { auth, onAuthStateChanged, getRedirectResult } from "../lib/firebase";
import { migrateGuestData } from "../lib/guestMigration";
import { useUserStore } from "../store/useUserStore";

export function useAuth() {
  const { user, setUser, setIsLoading } = useUserStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        // Check for redirect result (Google/Apple sign-in)
        try {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            setUser(result.user);
            await migrateGuestData(result.user.uid);
          }
        } catch {}
      }
      setIsLoading(false);
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  return { user, isLoading: !ready, isAuthenticated: !!user };
}
