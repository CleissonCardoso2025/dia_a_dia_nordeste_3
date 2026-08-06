'use client';

import { useEffect } from 'react';
import { incrementarViews } from '@/lib/supabase';

export default function ArticleViewTracker({ noticiaId }: { noticiaId: string }) {
  useEffect(() => {
    incrementarViews(noticiaId);
  }, [noticiaId]);

  return null;
}
