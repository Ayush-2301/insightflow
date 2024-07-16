export default function DashboardLayout({
  children,
  recommended,
  task,
  watchlistmain,
}: Readonly<{
  children: React.ReactNode;
  recommended: React.ReactNode;
  task: React.ReactNode;
  watchlistmain: React.ReactNode;
}>) {
  return (
    <div className="  p-5">
      {children}
      <div className="flex flex-col  gap-4 py-4">
        {watchlistmain}
        {recommended}
        {task}
      </div>
    </div>
  );
}
