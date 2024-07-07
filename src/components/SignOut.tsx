import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SignOut = () => {
  const handleLogout = async () => {
    "use server";
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/auth");
  };
  return (
    <form action={handleLogout}>
      <Button>Log out</Button>
    </form>
  );
};

export default SignOut;
