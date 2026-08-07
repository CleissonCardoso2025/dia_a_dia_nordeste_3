'use client';
import { useRouter } from 'next/navigation';
import WebStoryModal from '@/components/stories/WebStoryModal';
import type { WebStory } from '@/types';

export default function StoryViewerClient({ story }: { story: WebStory }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black w-full fixed inset-0 z-40">
      <WebStoryModal story={story} onClose={() => router.push('/')} />
    </div>
  );
}
