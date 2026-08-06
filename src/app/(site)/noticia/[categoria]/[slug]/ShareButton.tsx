'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 text-brand-laranja hover:underline"
    >
      <Share2 size={12} />
      Compartilhar
    </button>
  );
}
