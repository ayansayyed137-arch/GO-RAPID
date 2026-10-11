import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-zinc-950 text-white font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}