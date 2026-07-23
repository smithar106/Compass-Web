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
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Sign-in failed");
    }
    const { user: newUser, access_token, refresh_token } = await res.json();
    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });
    }
    const { data: { user: verifiedUser }, error: fetchError } = await supabase.auth.getUser();
    if (fetchError || !verifiedUser) {
      if (newUser) return newUser;
      throw new Error("Failed to verify authenticated session");
    }
    return verifiedUser;
  }

  return user;
}