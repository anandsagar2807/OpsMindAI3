# MongoDB Indexes Setup Script

Run these commands in MongoDB Shell or MongoDB Compass to create all required indexes for optimal performance.

## Connection

```bash
mongosh "your_mongodb_connection_string"
use opsmind-ai
```

## Chat Indexes (Enhanced Performance)

```javascript
// Primary user + time index
db.chats.createIndex(
  { userId: 1, createdAt: -1 },
  { name: "user_created_idx" }
);

// Pinned chats index
db.chats.createIndex(
  { userId: 1, isPinned: -1, updatedAt: -1 },
  { name: "user_pinned_updated_idx" }
);

// Archived chats index
db.chats.createIndex(
  { userId: 1, isArchived: 1, updatedAt: -1 },
  { name: "user_archived_updated_idx" }
);

// Tags index
db.chats.createIndex(
  { userId: 1, tags: 1 },
  { name: "user_tags_idx" }
);

// Full-text search index
db.chats.createIndex(
  { title: "text", "messages.content": "text" },
  { 
    name: "chat_text_search_idx",
    weights: { title: 10, "messages.content": 5 }
  }
);

// Updated at index for sorting
db.chats.createIndex(
  { updatedAt: -1 },
  { name: "updated_idx" }
);
```

## User Indexes (RBAC)

```javascript
// Clerk ID unique index
db.users.createIndex(
  { clerkId: 1 },
  { name: "clerk_id_idx", unique: true }
);

// Email unique index
db.users.createIndex(
  { email: 1 },
  { name: "email_idx", unique: true }
);

// Role and active status index
db.users.createIndex(
  { role: 1, isActive: 1 },
  { name: "role_active_idx" }
);

// Last login index for analytics
db.users.createIndex(
  { lastLogin: -1 },
  { name: "last_login_idx" }
);
```

## Vector Indexes (Search Performance)

```javascript
// User + document compound index
db.vectors.createIndex(
  { userId: 1, documentId: 1 },
  { name: "user_doc_idx" }
);

// Document + chunk index
db.vectors.createIndex(
  { documentId: 1, chunkIndex: 1 },
  { name: "doc_chunk_idx" }
);

// Document + page index
db.vectors.createIndex(
  { documentId: 1, pageNumber: 1 },
  { name: "doc_page_idx" }
);

// User index for filtering
db.vectors.createIndex(
  { userId: 1 },
  { name: "user_idx" }
);
```

## Document Indexes

```javascript
// Uploaded by index
db.documents.createIndex(
  { uploadedBy: 1 },
  { name: "uploaded_by_idx" }
);

// Status index
db.documents.createIndex(
  { status: 1 },
  { name: "status_idx" }
);

// User + status compound index
db.documents.createIndex(
  { uploadedBy: 1, status: 1 },
  { name: "user_status_idx" }
);

// Created at index for sorting
db.documents.createIndex(
  { createdAt: -1 },
  { name: "created_idx" }
);
```

## Verify Indexes

```javascript
// Check all indexes
db.chats.getIndexes();
db.users.getIndexes();
db.vectors.getIndexes();
db.documents.getIndexes();

// Check index usage
db.chats.aggregate([
  { $indexStats: {} }
]);
```

## Index Statistics

```javascript
// Get collection stats
db.chats.stats();
db.users.stats();
db.vectors.stats();
db.documents.stats();
```

## Performance Testing

```javascript
// Test chat query performance
db.chats.find({ userId: "test_user_id" })
  .sort({ updatedAt: -1 })
  .limit(20)
  .explain("executionStats");

// Test text search performance
db.chats.find(
  { $text: { $search: "refund policy" } },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } })
.explain("executionStats");

// Test vector search performance
db.vectors.find({ userId: "test_user_id" })
  .limit(5)
  .explain("executionStats");
```

## Maintenance

```javascript
// Rebuild indexes if needed
db.chats.reIndex();
db.users.reIndex();
db.vectors.reIndex();
db.documents.reIndex();

// Drop unused indexes
// db.collection.dropIndex("index_name");
```

## Expected Performance

With these indexes:
- Chat history queries: < 50ms
- Text search: < 200ms
- Vector search: < 500ms
- User lookups: < 10ms
- Document queries: < 100ms

## Notes

1. Indexes are created in background by default in MongoDB 4.2+
2. Text search index supports multiple languages
3. Compound indexes are used for multi-field queries
4. Unique indexes prevent duplicate entries
5. TTL indexes can be added for auto-cleanup (optional)

## Optional: TTL Index for Old Chats

```javascript
// Auto-delete archived chats after 1 year
db.chats.createIndex(
  { updatedAt: 1 },
  { 
    name: "archived_ttl_idx",
    expireAfterSeconds: 31536000, // 1 year
    partialFilterExpression: { isArchived: true }
  }
);
```
