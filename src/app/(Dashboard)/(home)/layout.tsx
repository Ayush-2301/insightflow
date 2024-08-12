export default async function DashboardLayout({
  children,
  home,
  company,
}: Readonly<{
  children: React.ReactNode;
  home: React.ReactNode;
  company: React.ReactNode;
}>) {
  return (
    <div className=" flex flex-col justify-center  w-full">
      {children}
      {home}
      {company}
    </div>
  );
}
