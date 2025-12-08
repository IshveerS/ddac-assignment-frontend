'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RoleGateProps {
  allowed: Array<'admin' | 'organizer'>;
  children: ReactNode;
}

export function RoleGate({ allowed, children }: RoleGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, role } = useAuth();

  const normalizedAllowed = allowed.map((r) => r.toLowerCase());
  const isAllowed = role ? normalizedAllowed.includes(role) : false;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAllowed) {
      router.replace('/');
    }
  }, [isAuthenticated, isAllowed, pathname, router]);

  if (!isAuthenticated || !isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d12] text-white">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
