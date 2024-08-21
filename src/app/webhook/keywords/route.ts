import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const response = await request.text();
    const data: {
      user_id: string;
    } = JSON.parse(response);
    console.log(data.user_id);

    const channel = supabase.channel("keywords-broadcast");
    channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return null;
      }
      channel.send({
        type: "broadcast",
        event: "keyword_generation_complete",
        payload: { user_id: data.user_id },
      });
    });
    revalidateTag("master_keywords");
  } catch (error) {
    return new Response(`Webhook error`, {
      status: 400,
    });
  }
  return new Response("Success", {
    status: 200,
  });
}
