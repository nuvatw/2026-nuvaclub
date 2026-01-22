import type { Metadata } from 'next';
import './globals.css';
import { DBProvider } from '@/lib/db';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { CartProvider } from '@/features/shop/components/cart';

export const metadata: Metadata = {
  title: 'nuvaClub',
  description: 'Learn → Forum → Space → Sprint → Shop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-950">
        <DBProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </DBProvider>
      </body>
    </html>
  );
}
