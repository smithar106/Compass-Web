import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function ensureAuthenticated() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    const res = await fetch("/api/auth/signin", { method: "POST" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || "Anonymous sign-in failed");
    }
    const { user: newUser } = await res.json();
    if (!newUser) {
      throw new Error("Failed to retrieve user after anonymous sign-in");
    }
    return newUser;
  }

  return user;
}
