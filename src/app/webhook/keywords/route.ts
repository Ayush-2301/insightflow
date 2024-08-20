import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    console.log(text);
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
