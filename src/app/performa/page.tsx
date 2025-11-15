'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LastRecordPageSkeleton } from '@/components/last-record-skeleton';

export default function PerformaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/last-record');
  }, [router]);

  return <LastRecordPageSkeleton />;
}
