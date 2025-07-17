
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

class AppDatabase extends Dexie {
  // Define tables
  topics!: EntityTable<DBTopic, 'slug'>;
  syncTracker!: EntityTable<DBSyncTrack, 'slug'>;

  constructor() {
    super('EduSyncAI_DB');
    this.version(1).stores({
      topics: '&slug', // '&' makes 'slug' the primary key and unique
      syncTracker: '&slug, syncedAt',
    });
  }
}

export const db = new AppDatabase();
