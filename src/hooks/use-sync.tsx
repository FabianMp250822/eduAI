
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db as localDb, type DBTopic, type DBSyncTrack } from '@/lib/db';
import { db as firebaseDb } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Topic } from '@/lib/curriculum';

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
  const [allTopics, setAllTopics] = useState<Topic[]>([]);

  // Tracks topics that have been synced to the local DB
  const syncTracker = useLiveQuery(() => localDb.syncTracker.toArray(), []);
  const syncedTopicsSet = React.useMemo(() => {
    return new Set(syncTracker?.map(t => t.slug) || []);
  }, [syncTracker]);

  const totalTopics = allTopics.length;

  const fetchAllTopicsFromFirebase = useCallback(async () => {
    try {
      console.log('Fetching all subjects and topics from Firebase...');
      const subjectsCollectionRef = collection(firebaseDb, 'subjects');
      const querySnapshot = await getDocs(subjectsCollectionRef);
      const topics: Topic[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.topics && Array.isArray(data.topics)) {
          topics.push(...data.topics);
        }
      });
      console.log(`Found ${topics.length} total topics in Firebase.`);
      setAllTopics(topics);
      return topics;
    } catch (error) {
      console.error("Failed to fetch topics from Firebase:", error);
      return [];
    }
  }, []);

  const syncContent = useCallback(async (topicsToSync: Topic[]) => {
    if (!navigator.onLine) {
        console.log('Offline. Skipping synchronization.');
        return;
    }
    console.log('Starting content synchronization for new topics...');
    
    for (const topic of topicsToSync) {
      // Check if topic is already synced to avoid redundant work
      if (!syncedTopicsSet.has(topic.slug)) {
        try {
          setSyncingTopics(prev => new Set(prev).add(topic.slug));
          
          const topicContent: DBTopic = {
            slug: topic.slug,
            name: topic.name,
            description: topic.description,
            content: topic.content || `<p>Contenido para ${topic.name} no encontrado.</p>`,
          };

          await localDb.topics.put(topicContent, topic.slug);
          await localDb.syncTracker.put({ slug: topic.slug, syncedAt: new Date() }, topic.slug);

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
  }, [syncedTopicsSet]);

  useEffect(() => {
    const performSync = async () => {
        const firebaseTopics = await fetchAllTopicsFromFirebase();
        if(firebaseTopics.length > 0) {
            await syncContent(firebaseTopics);
        }
    };
    
    performSync();
  }, [fetchAllTopicsFromFirebase, syncContent]);

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
