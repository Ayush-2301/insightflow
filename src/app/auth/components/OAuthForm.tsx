import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function OAuthForm() {
  const params = useSearchParams();
  const next = params.get("next") || "";
  const supabase = createSupabaseBrowserClient();
  const handleLoginOAuth = (provider: "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin + "/auth/callback?next=" + next,
      },
    });
  };

  return (
    <Button className="w-full" onClick={() => handleLoginOAuth("google")}>
      Login With Google
    </Button>
  );
}
