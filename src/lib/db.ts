
import Dexie, { type EntityTable } from 'dexie';

// --- DATABASE SCHEMA ---

// Represents the detailed content for a specific topic.
export interface DBTopic {
  slug: string; // Primary key
  name: string;
  description: string;
  content: string; // The actual educational content (HTML, Markdown, etc.)
}

// Tracks which topics have been successfully synced for offline use.
export interface DBSyncTrack {
  slug: string; // Primary key, matches the topic slug
  syncedAt: Date;
}

// Stores AI-generated content, categorized by grade and subject.
export interface DBAiContent {
  id: string; // Primary key (e.g., a timestamp or UUID)
  query: string;
  content: string;
  gradeSlug: string;
  subjectSlug: string;
  createdAt: Date;
}


class AppDatabase extends Dexie {
  // Define tables
  topics!: EntityTable<DBTopic, 'slug'>;
  syncTracker!: EntityTable<DBSyncTrack, 'slug'>;
  aiContent!: EntityTable<DBAiContent, 'id'>;


  constructor() {
    super('EduSyncAI_DB');
    this.version(2).stores({
      topics: '&slug',
      syncTracker: '&slug, syncedAt',
      aiContent: '&id, gradeSlug, subjectSlug', // New table
    });
    // Handle schema upgrade from version 1 if needed
    this.on('populate', (tx) => {
        // This event only fires when the database is first created.
    });
  }
}

export const db = new AppDatabase();
