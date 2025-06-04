// src/app/homepage/page.tsx
'use client';

import React from 'react';
import HomepageComponent from '@/components/Homepage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return <HomepageComponent />;
};

export default Page;
