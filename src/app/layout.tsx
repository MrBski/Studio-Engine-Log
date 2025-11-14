import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/context/app-provider';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'Sea Pilot',
  description: 'A ship management app for offline use.',
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: '#2E5CB8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{colorScheme: 'dark'}} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased",
      )}>
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-24 container mx-auto px-4 md:px-6 py-8">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
