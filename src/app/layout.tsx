import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { CartProvider } from '@/features/shop/components/cart';
import { AdminThemeProvider } from '@/features/admin/components/AdminThemeProvider';
import { KeyboardShortcutsProvider } from '@/features/keyboard-shortcuts';

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
        <AuthProvider>
          <AdminThemeProvider>
            <CartProvider>
              <KeyboardShortcutsProvider>
                {children}
              </KeyboardShortcutsProvider>
            </CartProvider>
          </AdminThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
