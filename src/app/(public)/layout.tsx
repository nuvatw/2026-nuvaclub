import { Navbar } from '@/components/organisms';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
