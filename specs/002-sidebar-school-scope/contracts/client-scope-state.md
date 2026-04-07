# Client scope state contract

**Applies to**: `../sitio-dashboard` (browser only).  
**Language**: Key names and TypeScript identifiers in **English**; UI copy is **pt-BR** in the product.

## Storage mechanism

- **API**: `window.localStorage`
- **Namespace**: Prefix all keys with `sitio.dashboard` and a **version** segment so migrations can rename or rewrite shapes without colliding with older builds.

## Keys (v1)

| Key | Value type | Purpose |
|-----|------------|---------|
| `sitio.dashboard.scope.v1.lastSchoolId` | string (UUID) | **Last accessed** school id for **INIT-1** step (1). Empty/absent means “none recorded”. |
| `sitio.dashboard.scope.v1.recentSchools` | JSON string | **Recent schools** list for the selector (**SEL-6**, max **10**). |

## JSON: `recentSchools`

Array of objects, **most recently used first** (index `0` = most recent).

```typescript
type RecentSchoolEntry = {
  schoolId: string; // UUID
  /** ISO 8601 timestamp when the user last opened this school (optional but recommended) */
  lastOpenedAt?: string;
};

type RecentSchoolsPayload = RecentSchoolEntry[];
```

### Rules

- **Max length**: **10** — when inserting, **truncate** from the tail (oldest dropped).
- **Dedupe**: If the user opens a school already in the list, **move** it to index `0` and refresh `lastOpenedAt`.
- **Invalid entries**: On successful fetch of school list or detail, **remove** entries whose `schoolId` is not returned by the server for the current deployment (or is filtered out by product rules).

## Migrations

- Increment the `v1` segment when breaking the JSON shape; on read, detect old versions and **migrate or clear** safely to avoid crashing the shell.

## Security and privacy

- Treat contents as **device-local preferences** — not a security boundary. Do not store secrets. When auth arrives, prefer server-stored preferences and migrate keys deliberately.
