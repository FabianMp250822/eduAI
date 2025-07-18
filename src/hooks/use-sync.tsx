
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db as localDb, type DBTopic, type DBSyncTrack } from '@/lib/db';
import { db as firebaseDb } from '@/lib/firebase';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import type { Topic } from '@/lib/curriculum';

interface SyncContextType {
  isSyncing: boolean;
  syncProgress: number;
}

const SyncContext = createContext<SyncContextType>({
    isSyncing: true,
    syncProgress: 0,
});

export function useSyncStatus() {
  return useContext(SyncContext);
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(true);
  const [allTopicsCount, setAllTopicsCount] = useState(0);

  const syncedItems = useLiveQuery(() => localDb.syncTracker.toArray(), []);
  const syncedTopicsCount = syncedItems?.length ?? 0;

  const syncContent = useCallback(async () => {
    if (!navigator.onLine) {
      console.log('Offline. Skipping synchronization.');
      setIsSyncing(false);
      return;
    }
    
    setIsSyncing(true);
    console.log('Starting full content synchronization...');
    
    try {
      const subjectsCollectionRef = collection(firebaseDb, 'subjects');
      const querySnapshot = await getDocs(subjectsCollectionRef);
      
      const allFirebaseTopics: (Topic & { subjectSlug: string, gradeSlug: string })[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.topics && Array.isArray(data.topics)) {
          const subjectTopics = data.topics.map((t: Topic) => ({
              ...t,
              subjectSlug: data.subjectSlug,
              gradeSlug: data.gradeSlug
          }));
          allFirebaseTopics.push(...subjectTopics);
        }
      });
      
      setAllTopicsCount(allFirebaseTopics.length);

      const syncedSlugs = new Set(syncedItems?.map(item => item.slug) || []);
      const topicsToSync = allFirebaseTopics.filter(topic => topic.content && !syncedSlugs.has(topic.slug));

      if (topicsToSync.length === 0) {
        console.log("All content is up to date.");
        setIsSyncing(false);
        return;
      }
      
      console.log(`Found ${topicsToSync.length} new or updated topics to sync.`);

      const topicsToSave: DBTopic[] = topicsToSync.map(topic => ({
        slug: topic.slug,
        name: topic.name,
        description: topic.description,
        content: topic.content!,
        gradeSlug: topic.gradeSlug,
        subjectSlug: topic.subjectSlug,
      }));

      const syncTrackersToSave: DBSyncTrack[] = topicsToSync.map(topic => ({
          slug: topic.slug,
          syncedAt: new Date(),
      }));

      await localDb.topics.bulkPut(topicsToSave);
      await localDb.syncTracker.bulkPut(syncTrackersToSave);

      console.log(`Synced ${topicsToSync.length} topics.`);
      
    } catch (error) {
      console.error("Failed during synchronization:", error);
    } finally {
      console.log('Content synchronization finished.');
      setIsSyncing(false);
    }
  }, [syncedItems]);

  useEffect(() => {
    // Initial full sync on load.
    syncContent();
  }, [syncContent]); 

  const syncProgress = allTopicsCount > 0 ? (syncedTopicsCount / allTopicsCount) * 100 : (isSyncing ? 0 : 100);

  const value = useMemo(() => ({
    isSyncing,
    syncProgress,
  }), [isSyncing, syncProgress]);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
