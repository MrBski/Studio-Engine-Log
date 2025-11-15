'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Archive, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/preview', icon: Camera, label: 'Input Data' },
  { href: '/last-record', icon: History, label: 'Log Activity' },
  { href: '/', icon: Home, label: 'Home' },
  { href: '/inventory', icon: Archive, label: 'Inventory' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-30 h-20 bg-card border-t shadow-t-lg">
        <div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
          {Array(5).fill(0).map((_, i) => <div key={i} className="flex items-center justify-center"><div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div></div>)}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-20 bg-card border-t">
      <div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCenter = item.label === 'Home';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-2 group relative transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center rounded-full transition-all duration-300 ease-out',
                 isCenter ? 'w-16 h-16 -translate-y-6 bg-primary text-primary-foreground shadow-lg group-hover:scale-110' : 'w-10 h-10',
                 isActive && isCenter && 'bg-primary/90'
              )}>
                 <item.icon className="w-6 h-6" />
              </div>

              <span className={cn(
                  "text-xs transition-opacity duration-300 text-center",
                  isCenter ? 'absolute bottom-2 font-medium' : 'mt-1',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                  isCenter && 'text-foreground'
                )}>
                {item.label}
              </span>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
