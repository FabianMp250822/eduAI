
import Dexie, { type EntityTable } from 'dexie';

// --- DATABASE SCHEMA ---

// Represents the detailed content for a specific topic.
export interface DBTopic {
  slug: string; // Primary key
  name: string;
  description: string;
  content: string; // The actual educational content (HTML, Markdown, etc.)
  gradeSlug: string;
  subjectSlug: string;
}

// Tracks which topics have been successfully synced for offline use.
export interface DBSyncTrack {
  slug: string; // Primary key, matches the topic slug
  syncedAt: Date;
}

// Stores AI-generated content, categorized by grade and subject.
export interface DBAiContent {
  id: string; // Primary key (e.g., a timestamp or UUID)
  licenseKey: string;
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
    this.version(4).stores({
      topics: '&slug, gradeSlug, subjectSlug', // Add indexes for querying
      syncTracker: '&slug, syncedAt',
      aiContent: '&id, licenseKey, gradeSlug, subjectSlug',
    });
  }
}

export const db = new AppDatabase();
