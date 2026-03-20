// This file is obsolete and can be removed.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/user/profile');
  }, [router]);

  return null;
}
