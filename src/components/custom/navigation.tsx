'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border">
        {isAdmin ? (
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Home className="w-4 h-4 mr-2" />
              Área do Cliente
            </Button>
          </Link>
        ) : (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Settings className="w-4 h-4 mr-2" />
              Painel Admin
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
