
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db as localDb, type DBTopic, type DBSyncTrack } from '@/lib/db';
import { db as firebaseDb } from '@/lib/firebase';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import type { Topic } from '@/lib/curriculum';

interface SyncContextType {
  isSyncing: boolean;
  totalSyncedCount: number;
  allTopicsCount: number;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [allTopicsCount, setAllTopicsCount] = useState(0);

  // Tracks topics that have been synced to the local DB
  const syncTracker = useLiveQuery(() => localDb.syncTracker.toArray(), []);
  const syncedTopicsSet = useMemo(() => {
    return new Set(syncTracker?.map(t => t.slug) || []);
  }, [syncTracker]);

  const totalSyncedCount = syncedTopicsSet.size;

  const syncContent = useCallback(async () => {
    if (!navigator.onLine) {
      console.log('Offline. Skipping synchronization.');
      return;
    }
    
    setIsSyncing(true);
    console.log('Starting content synchronization...');
    
    try {
      const subjectsCollectionRef = collection(firebaseDb, 'subjects');
      const querySnapshot = await getDocs(subjectsCollectionRef);
      
      const allFirebaseTopics: Topic[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.topics && Array.isArray(data.topics)) {
          allFirebaseTopics.push(...data.topics);
        }
      });
      
      setAllTopicsCount(allFirebaseTopics.length);

      const topicsToSync = allFirebaseTopics.filter(topic => topic.content && !syncedTopicsSet.has(topic.slug));

      if (topicsToSync.length === 0) {
        console.log("All content is up to date.");
        setIsSyncing(false);
        return;
      }
      
      console.log(`Found ${topicsToSync.length} new topics to sync.`);

      for (const topic of topicsToSync) {
        if (!topic.content) continue;
        
        const topicContent: DBTopic = {
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
          content: topic.content!,
        };

        await localDb.topics.put(topicContent, topic.slug);
        await localDb.syncTracker.put({ slug: topic.slug, syncedAt: new Date() }, topic.slug);
        console.log(`Synced: ${topic.name}`);
      }
      
    } catch (error) {
      console.error("Failed during synchronization:", error);
    } finally {
      console.log('Content synchronization finished.');
      setIsSyncing(false);
    }
  }, [syncedTopicsSet]);

  useEffect(() => {
    // Initial sync on load. The empty dependency array [] ensures this runs only once.
    syncContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const syncProgress = allTopicsCount > 0 ? (totalSyncedCount / allTopicsCount) * 100 : 100;

  const value = {
    isSyncing,
    totalSyncedCount,
    allTopicsCount,
    syncProgress,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
