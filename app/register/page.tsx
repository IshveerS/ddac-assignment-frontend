'use client';

import dynamic from 'next/dynamic';

// Dynamically import RegisterForm to ensure it's in client context with provider
const RegisterForm = dynamic(() => import('../components/RegisterForm').then(mod => ({ default: mod.RegisterForm })), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#0a0d12]">Loading...</div>,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
