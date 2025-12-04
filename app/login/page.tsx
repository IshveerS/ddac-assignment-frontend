'use client';

import dynamic from 'next/dynamic';

// Dynamically import the actual login form to ensure it's in client context with provider
const LoginForm = dynamic(() => import('../components/LoginForm').then(mod => ({ default: mod.LoginForm })), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#0a0d12]">Loading...</div>,
});

export default function LoginPage() {
  return <LoginForm />;
}


