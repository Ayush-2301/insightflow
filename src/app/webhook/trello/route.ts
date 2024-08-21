import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    console.log(text);
    revalidateTag("tasks");
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
// d3b2b8a9-0f20-4483-ab3a-4cc01acb5929
