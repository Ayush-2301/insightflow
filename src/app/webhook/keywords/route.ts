import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const response = await request.text();
    const data: {
      user_id: string;
    } = JSON.parse(response);

    const channel = supabase.channel(`keywords-${data.user_id}`);

    channel.send({
      type: "broadcast",
      event: "keywords.generated",
      payload: { user_id: data.user_id },
    });
    revalidateTag("masterkeywords");
    supabase.removeChannel(channel);
  } catch (error) {
    return new Response(`Webhook error`, {
      status: 400,
    });
  }
  return new Response("Success", {
    status: 200,
  });
}
