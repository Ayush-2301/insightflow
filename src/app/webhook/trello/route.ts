import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    revalidateTag("tasks");
  } catch (error) {
    return new Response(`Webhook error`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
