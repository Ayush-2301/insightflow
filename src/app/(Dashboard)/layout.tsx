import Navbar from "@/components/Navbar";
import ContextProvider from "@/components/provider/ContextProvider";
import SignOut from "@/components/SignOut";
import readUser from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await readUser();
  if (!data.user) redirect("/auth");

  return (
    <ContextProvider>
      <div>
        <Navbar>{<SignOut />}</Navbar>
        <div className="px-32 py-12">{children}</div>
      </div>
    </ContextProvider>
  );
}
