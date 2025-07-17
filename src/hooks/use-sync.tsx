
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type DBSyncTrack } from '@/lib/db';
import { curriculum, type Topic } from '@/lib/curriculum';

interface SyncContextType {
  isTopicSynced: (topicSlug: string) => boolean;
  isSyncing: (topicSlug: string) => boolean;
  totalSynced: number;
  totalTopics: number;
  syncProgress: number;
}

const SyncContext = createContext<SyncContextType | null>(null);

export function useSyncStatus() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within a SyncProvider');
  }
  return context;
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [syncingTopics, setSyncingTopics] = useState<Set<string>>(new Set());
  
  const allTopics = curriculum.flatMap(grade => grade.subjects.flatMap(subject => subject.topics));
  const totalTopics = allTopics.length;

  const syncTracker = useLiveQuery(() => db.syncTracker.toArray(), []);

  const syncedTopicsSet = React.useMemo(() => {
    return new Set(syncTracker?.map(t => t.slug) || []);
  }, [syncTracker]);

  const syncContent = useCallback(async () => {
    console.log('Starting content synchronization...');
    
    for (const topic of allTopics) {
      if (!syncedTopicsSet.has(topic.slug)) {
        try {
          setSyncingTopics(prev => new Set(prev).add(topic.slug));
          
          // Simulate fetching content for the topic
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
          
          const topicContent = {
            slug: topic.slug,
            name: topic.name,
            description: topic.description,
            // In a real app, you would fetch and store actual topic content here.
            content: `Contenido para ${topic.name}`, 
          };

          await db.topics.put(topicContent, topic.slug);
          await db.syncTracker.put({ slug: topic.slug, syncedAt: new Date() }, topic.slug);

          console.log(`Synced: ${topic.name}`);
        } catch (error) {
          console.error(`Failed to sync topic ${topic.slug}:`, error);
        } finally {
          setSyncingTopics(prev => {
            const newSet = new Set(prev);
            newSet.delete(topic.slug);
            return newSet;
          });
        }
      }
    }
    console.log('Content synchronization finished.');
  }, [allTopics, syncedTopicsSet]);

  useEffect(() => {
    syncContent();
  }, [syncContent]);

  const isTopicSynced = (topicSlug: string) => syncedTopicsSet.has(topicSlug);
  const isSyncing = (topicSlug: string) => syncingTopics.has(topicSlug);
  
  const totalSynced = syncTracker?.length || 0;
  const syncProgress = totalTopics > 0 ? (totalSynced / totalTopics) * 100 : 0;

  const value = {
    isTopicSynced,
    isSyncing,
    totalSynced,
    totalTopics,
    syncProgress,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
