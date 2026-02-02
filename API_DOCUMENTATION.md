# Haven Rush V1 - Backend API

A Next.js backend for the Haven Rush real estate gamification platform. Tracks visitor engagement through property interactions and calculates engagement scores.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Run Supabase migrations:
Apply the migration in `supabase/migrations/20240101000000_create_interactions_table.sql` to your Supabase project.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/moneyball
Record a visitor interaction event and calculate engagement score.

**Request Body:**
```json
{
  "visitor_id": "uuid",
  "property_id": "uuid",
  "event_type": "check_in",
  "metadata": {}
}
```

**Valid Event Types & Points:**
- `view` - 1 point
- `check_in` - 10 points
- `favorite` - 5 points
- `share` - 8 points
- `inquiry` - 15 points
- `tour_request` - 20 points
- `document_download` - 3 points

**Response:**
```json
{
  "success": true,
  "interaction": {
    "id": "uuid",
    "visitor_id": "uuid",
    "property_id": "uuid",
    "event_type": "check_in",
    "points": 10,
    "metadata": {},
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "engagement_score": {
    "visitor_id": "uuid",
    "property_id": "uuid",
    "total_points": 25,
    "interaction_count": 3,
    "engagement_level": "medium",
    "last_interaction": "2024-01-01T00:00:00.000Z"
  }
}
```

**Engagement Levels:**
- `low` - 0-19 points
- `medium` - 20-49 points
- `high` - 50-99 points
- `very_high` - 100+ points

### GET /api/moneyball
Retrieve engagement score for a visitor-property combination.

**Query Parameters:**
- `visitor_id` (required) - UUID of the visitor
- `property_id` (required) - UUID of the property

**Example:**
```
GET /api/moneyball?visitor_id=uuid&property_id=uuid
```

**Response:**
```json
{
  "engagement_score": {
    "visitor_id": "uuid",
    "property_id": "uuid",
    "total_points": 25,
    "interaction_count": 3,
    "engagement_level": "medium",
    "last_interaction": "2024-01-01T00:00:00.000Z"
  },
  "interactions": [...]
}
```

## Database Schema

The `interactions` table tracks all visitor engagement events:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| visitor_id | UUID | Visitor identifier |
| property_id | UUID | Property identifier |
| event_type | VARCHAR(50) | Type of interaction |
| points | INTEGER | Points awarded |
| metadata | JSONB | Additional event data |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### Row Level Security (RLS)
- **Read**: Public access for analytics
- **Insert**: Authenticated access for API endpoints
- **Update/Delete**: Blocked to maintain data integrity

## Architecture

- **Next.js 15** - Framework
- **TypeScript** - Type safety
- **Supabase** - Database & Authentication
- **@supabase/ssr** - Server-side Supabase client
- **Cloudflare DNS** - Domain management
- **Vercel** - Hosting platform

## Files Structure

```
├── app/
│   ├── api/
│   │   └── moneyball/
│   │       └── route.ts         # API route handler
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── lib/
│   └── supabase.ts               # Supabase client setup
├── types/
│   └── database.ts               # TypeScript database types
├── supabase/
│   └── migrations/
│       └── 20240101000000_create_interactions_table.sql
└── package.json
```

## Performance Optimizations

- Indexed queries on visitor_id, property_id, and event_type
- Composite index for engagement score calculations
- Efficient aggregation queries
- Server-side rendering with Next.js

## Data Integrity

- UUID-based identifiers
- Row Level Security policies
- Immutable records (no updates/deletes)
- Automatic timestamp management
- Input validation on API endpoints
