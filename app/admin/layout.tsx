export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='bg-grey-50 min-h-screen'>{children}</div>;
}
