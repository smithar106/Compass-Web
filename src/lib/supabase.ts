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
    const { error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      throw new Error(`Anonymous sign-in failed: ${signInError.message}`);
    }
    const { data: { user: newUser }, error: fetchError } = await supabase.auth.getUser();
    if (fetchError || !newUser) {
      throw new Error("Failed to retrieve user after anonymous sign-in");
    }
    return newUser;
  }

  return user;
}
