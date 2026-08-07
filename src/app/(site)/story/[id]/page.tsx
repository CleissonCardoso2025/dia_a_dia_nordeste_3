import { Metadata } from 'next';
import { getWebStoryById } from '@/lib/supabase';
import type { WebStory } from '@/types';
import StoryViewerClient from './StoryViewerClient';
import { notFound } from 'next/navigation';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data } = await getWebStoryById(resolvedParams.id);
  const story = data as WebStory;

  if (!story) {
    return { title: 'Story não encontrado' };
  }

  return {
    title: story.titulo,
    description: `Confira este Web Story: ${story.titulo}`,
    openGraph: {
      title: story.titulo,
      description: `Confira este Web Story: ${story.titulo}`,
      type: 'article',
      images: story.capaUrl ? [
        {
          url: story.capaUrl,
          width: 720,
          height: 1280,
          alt: story.titulo,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.titulo,
      description: `Confira este Web Story: ${story.titulo}`,
      images: story.capaUrl ? [story.capaUrl] : [],
    }
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const { data } = await getWebStoryById(resolvedParams.id);
  const story = data as WebStory;

  if (!story) {
    notFound();
  }

  return <StoryViewerClient story={story} />;
}
