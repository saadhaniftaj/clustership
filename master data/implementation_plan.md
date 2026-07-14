# 📘 Implementation Bible — Multi-Tenant WhatsApp AI Shopping Assistant (MVP)

> **Author:** Saad Hanif Taj  
> **Stack:** Next.js 14 · Supabase · Upstash Redis · OpenAI GPT-4o-mini · Meta WhatsApp Cloud API · Vercel  
> **Last Updated:** 2026-07-14  
> **Scope:** This document is the single source of truth for building the MVP. Follow phases in order. Do not skip ahead.

---

## 🗺️ MVP Scope — What We Are & Are Not Building

### ✅ In MVP
- Multi-tenant architecture (multiple stores, isolated data)
- WhatsApp conversational flow (browse → cart → checkout)
- AI intent matching with OpenAI Tool Calling
- Product catalog management (dashboard, CSV upload)
- Order management (Kanban board: New → Processing → Completed)
- Order notifications via WhatsApp message to store owner
- Supabase Auth for merchant login
- Deployment on Vercel

### ❌ NOT in MVP (Future Phases)
- Stripe / payment gateway integration
- Delivery tracking URLs
- Loyalty / broadcast campaigns
- Human handover (live agent takeover)
- Mobile app for merchants

---

## 🏗️ Phase 0 — Project Scaffolding & Tooling

**Goal:** Have a running Next.js 14 app with proper folder structure, environment variables set up, and all core dependencies installed.

### Step 0.1 — Initialize Next.js Project

```bash
# In the project root directory
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

> **Why `--app`?** We use the App Router (Next.js 14) for server components, route handlers, and middleware — all critical for webhook handling and dashboard.

### Step 0.2 — Install All Core Dependencies

```bash
# Core runtime deps
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  openai \
  @upstash/redis \
  @upstash/qstash \
  zod \
  axios \
  sonner \
  react-hook-form \
  @hookform/resolvers \
  date-fns \
  zustand

# UI Components (shadcn/ui)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select table badge dialog sheet toast progress avatar skeleton tabs

# Dev deps
npm install -D @types/node prettier eslint-config-prettier
```

### Step 0.3 — Folder Structure (The Law)

```
src/
├── app/
│   ├── (auth)/                    # Auth routes (login, signup)
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/               # Protected merchant dashboard
│   │   ├── layout.tsx             # Sidebar + auth guard
│   │   ├── page.tsx               # Overview / stats
│   │   ├── catalog/
│   │   │   ├── page.tsx           # Product list
│   │   │   └── [id]/page.tsx      # Edit product
│   │   ├── orders/
│   │   │   └── page.tsx           # Kanban board
│   │   └── settings/
│   │       └── page.tsx           # Store settings
│   ├── api/
│   │   ├── webhook/
│   │   │   └── route.ts           # Meta WhatsApp webhook (GET + POST)
│   │   ├── worker/
│   │   │   └── route.ts           # Background AI worker (called by QStash)
│   │   ├── catalog/
│   │   │   └── route.ts           # CRUD for products
│   │   └── orders/
│   │       └── route.ts           # CRUD for orders
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ui/                        # shadcn auto-generated
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── ProductTable.tsx
│   │   └── CsvUploadModal.tsx
│   └── shared/
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client (cookies)
│   │   └── middleware.ts          # Auth session refresh
│   ├── openai/
│   │   ├── client.ts
│   │   ├── tools.ts               # Tool definitions (search_catalog, add_to_cart…)
│   │   └── agent.ts               # Main AI loop
│   ├── whatsapp/
│   │   ├── client.ts              # Meta API calls (sendMessage, sendInteractiveList…)
│   │   ├── parser.ts              # Parse incoming webhook payloads
│   │   └── templates.ts           # Message template builders
│   ├── redis/
│   │   └── client.ts              # Upstash Redis client + conversation state helpers
│   └── utils.ts
├── types/
│   ├── database.ts                # Supabase generated types
│   ├── whatsapp.ts                # Meta webhook payload types
│   └── ai.ts                      # Tool call types
└── middleware.ts                   # Supabase auth middleware (protects /dashboard)
```

### Step 0.4 — Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Meta WhatsApp Cloud API
META_VERIFY_TOKEN=          # A random secret string you choose
META_APP_SECRET=            # From Meta App Dashboard
WHATSAPP_API_VERSION=v20.0

# Upstash Redis (for conversation state)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Upstash QStash (for background AI processing)
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Acceptance Criteria:** `npm run dev` starts without errors. All env vars are documented.

---

## 🗄️ Phase 1 — Database Design (Supabase)

**Goal:** Design a multi-tenant-safe PostgreSQL schema in Supabase. Every table is isolated by `store_id`. Row Level Security (RLS) is enabled on everything.

### Step 1.1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `whatsapp-ai-shop`
3. Choose a strong DB password, save it
4. Copy `Project URL` and `anon key` and `service_role key` into `.env.local`

### Step 1.2 — Run Schema Migration

Run this SQL in the **Supabase SQL Editor** (or create as a migration file):

```sql
-- ============================================================
-- EXTENSION
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- STORES (one row per merchant / retail store)
-- ============================================================
create table stores (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  whatsapp_phone_number_id text not null unique,   -- Meta Phone Number ID
  whatsapp_access_token    text not null,           -- Meta System User Token
  owner_user_id uuid references auth.users(id) on delete cascade not null,
  logo_url      text,
  greeting_message text default 'Welcome! How can I help you today?',
  created_at    timestamptz default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid references stores(id) on delete cascade not null,
  name          text not null,
  description   text,
  price         numeric(10, 2) not null,
  stock_qty     integer not null default 0,
  image_url     text,
  category      text,
  sku           text,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index on products(store_id);
create index on products(store_id, category);

-- ============================================================
-- CONVERSATIONS (tracks per-customer WhatsApp sessions)
-- ============================================================
create table conversations (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid references stores(id) on delete cascade not null,
  customer_wa_id text not null,              -- WhatsApp number e.g. "923001234567"
  customer_name  text,
  status        text default 'active',       -- active | completed | handed_over
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(store_id, customer_wa_id)
);
create index on conversations(store_id);

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id              uuid primary key default uuid_generate_v4(),
  store_id        uuid references stores(id) on delete cascade not null,
  conversation_id uuid references conversations(id),
  customer_wa_id  text not null,
  customer_name   text,
  customer_phone  text,
  delivery_address text,
  notes           text,
  status          text default 'new',   -- new | processing | completed | cancelled
  total_amount    numeric(10, 2),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on orders(store_id, status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references orders(id) on delete cascade not null,
  product_id  uuid references products(id),
  product_name text not null,    -- denormalized in case product is deleted
  quantity    integer not null,
  unit_price  numeric(10, 2) not null
);
create index on order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table stores   enable row level security;
alter table products enable row level security;
alter table conversations enable row level security;
alter table orders   enable row level security;
alter table order_items enable row level security;

-- Stores: owner can only see their own store
create policy "store_owner_only" on stores
  for all using (owner_user_id = auth.uid());

-- Products: belong to store owner
create policy "products_via_store" on products
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );

-- Orders: belong to store owner
create policy "orders_via_store" on orders
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );

create policy "order_items_via_order" on order_items
  for all using (
    order_id in (
      select o.id from orders o
      join stores s on s.id = o.store_id
      where s.owner_user_id = auth.uid()
    )
  );

create policy "conversations_via_store" on conversations
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );
```

### Step 1.3 — Generate TypeScript Types

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  --schema public \
  > src/types/database.ts
```

> **Acceptance Criteria:** All tables exist in Supabase. RLS is enabled. TypeScript types file is generated and committed.

---

## 🔑 Phase 2 — Authentication (Merchant Login)

**Goal:** Merchants can sign up, log in, and be protected behind auth middleware. A store record is created on first login.

### Step 2.1 — Supabase Client Helpers

**`src/lib/supabase/client.ts`** — Browser client (for client components):
```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

**`src/lib/supabase/server.ts`** — Server client (for server components & route handlers):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

### Step 2.2 — Auth Middleware

**`src/middleware.ts`** — Protects all `/dashboard` routes:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}

export const config = { matcher: ['/dashboard/:path*', '/login'] }
```

### Step 2.3 — Login Page

- Email + Password login using `supabase.auth.signInWithPassword()`
- On success → redirect to `/dashboard`
- Clean, branded UI with store logo

### Step 2.4 — Store Creation Flow

After first login, if the user has no store → redirect to `/dashboard/onboarding` where they:
1. Enter store name
2. Enter their Meta WhatsApp Phone Number ID & Access Token
3. Submit → creates a row in `stores` table linked to their `auth.uid()`

> **Acceptance Criteria:** New user can sign up → create store → land on dashboard. Existing user can log in directly. Unauthenticated user is redirected to `/login`.

---

## 📦 Phase 3 — Product Catalog (Dashboard + API)

**Goal:** Store owners can view, add, edit, delete products and bulk-upload via CSV.

### Step 3.1 — Products API Route

**`src/app/api/catalog/route.ts`**

| Method | Action |
|--------|--------|
| `GET`  | List all products for the authenticated store |
| `POST` | Create a new product |

**`src/app/api/catalog/[id]/route.ts`**

| Method | Action |
|--------|--------|
| `PUT`    | Update a product |
| `DELETE` | Delete a product |

> All routes use `createClient()` from `server.ts` and validate the user is authenticated. `store_id` is always derived from the authenticated user — never from the request body (security rule).

### Step 3.2 — Image Upload

- Use **Supabase Storage** bucket named `product-images`
- Set bucket to public
- Upload from dashboard via `supabase.storage.from('product-images').upload(...)`
- Store the public URL in `products.image_url`

### Step 3.3 — CSV Bulk Upload

**Format expected:**
```csv
name,description,price,stock_qty,category,sku
"Nike Air Max","Classic running shoe",12500,50,Footwear,NK-AM-001
```

- Parse with `papaparse` on the client side
- Validate each row with Zod schema
- Batch insert via `supabase.from('products').insert(rows)`
- Show progress bar and error report

### Step 3.4 — Product Table UI

- Paginated table with columns: Image, Name, Category, Price, Stock, Status, Actions
- Inline stock editing
- Delete with confirmation modal
- Filter by category

> **Acceptance Criteria:** Owner can add 10 products manually and upload 50 via CSV. Images display correctly. Stock updates save immediately.

---

## 📲 Phase 4 — WhatsApp Webhook (The Nervous System)

**Goal:** Receive WhatsApp messages from Meta, enqueue them to Upstash QStash, and return a 200 immediately (critical — Meta will retry if no 200 within 10s).

### Step 4.1 — Register the Webhook on Meta

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create App → Business type
3. Add "WhatsApp" product
4. Set webhook URL: `https://your-domain.com/api/webhook`
5. Set Verify Token: same value as `META_VERIFY_TOKEN` in your `.env`
6. Subscribe to: `messages`

### Step 4.2 — Webhook Route Handler

**`src/app/api/webhook/route.ts`**

```typescript
// GET — Webhook verification (Meta calls this once during setup)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// POST — Incoming messages
export async function POST(request: Request) {
  // 1. Verify X-Hub-Signature-256 header (HMAC-SHA256)
  // 2. Parse the webhook body
  // 3. Extract: phone_number_id, from (customer WA ID), message type & content
  // 4. Enqueue to QStash → POST /api/worker
  // 5. Return 200 immediately

  return new Response('OK', { status: 200 })
}
```

### Step 4.3 — Webhook Signature Verification

Every incoming POST from Meta includes `X-Hub-Signature-256`. **Always verify this** to prevent spoofed webhooks:

```typescript
import crypto from 'crypto'

function verifyMetaSignature(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(payload)
    .digest('hex')
  return `sha256=${expected}` === signature
}
```

### Step 4.4 — Payload Parser

**`src/lib/whatsapp/parser.ts`**

Parse raw Meta webhook JSON into a normalized internal format:

```typescript
export interface IncomingMessage {
  phoneNumberId: string     // Which store's number received this
  from: string              // Customer's WA ID (e.g. "923001234567")
  customerName: string
  messageId: string
  type: 'text' | 'interactive' | 'image' | 'unsupported'
  text?: string
  interactiveReply?: {
    type: 'button_reply' | 'list_reply'
    id: string
    title: string
  }
}
```

> **Acceptance Criteria:** Send "hello" from a WhatsApp number. See a 200 in Meta webhook logs. See the message enqueued in QStash dashboard.

---

## 🤖 Phase 5 — AI Engine (The Brain)

**Goal:** Build the AI agent that receives a customer message, determines intent, calls tools to fetch data, and returns a structured WhatsApp response.

### Step 5.1 — Conversation State in Redis

Each customer's conversation history is stored in Upstash Redis as a JSON array with a TTL of 24 hours.

**Key format:** `conv:{store_id}:{customer_wa_id}`

**`src/lib/redis/client.ts`**

```typescript
import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export async function getConversationHistory(storeId: string, waId: string) {
  return await redis.get<ConversationMessage[]>(`conv:${storeId}:${waId}`) ?? []
}

export async function appendToHistory(storeId: string, waId: string, message: ConversationMessage) {
  const key = `conv:${storeId}:${waId}`
  const history = await getConversationHistory(storeId, waId)
  history.push(message)
  // Keep last 20 messages max to control token count
  const trimmed = history.slice(-20)
  await redis.set(key, trimmed, { ex: 86400 }) // 24h TTL
}
```

**Also store the cart in Redis:**
- Key: `cart:{store_id}:{customer_wa_id}`
- Value: `CartItem[]` with product_id, name, qty, price
- TTL: 24 hours

### Step 5.2 — OpenAI Tool Definitions

**`src/lib/openai/tools.ts`**

Define strict JSON tools that the AI can call. This prevents hallucinations — the AI cannot mention products that don't exist in the DB.

```typescript
export const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_catalog',
      description: 'Search the store catalog for products matching a query. Use this when the customer asks about products, categories, or wants to browse.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term, e.g. "running shoes" or "blue dress"' },
          category: { type: 'string', description: 'Optional category filter' },
          max_results: { type: 'number', description: 'Max products to return, default 5' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: 'Add a product to the customer\'s cart.',
      parameters: {
        type: 'object',
        properties: {
          product_id: { type: 'string' },
          quantity: { type: 'number', default: 1 }
        },
        required: ['product_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'view_cart',
      description: 'Show the customer their current cart.',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'remove_from_cart',
      description: 'Remove a product from the cart.',
      parameters: {
        type: 'object',
        properties: { product_id: { type: 'string' } },
        required: ['product_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'initiate_checkout',
      description: 'Start the checkout process. Call this when the customer says they want to place the order or proceed to checkout.',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_order',
      description: 'Finalize and create the order after collecting delivery details.',
      parameters: {
        type: 'object',
        properties: {
          delivery_address: { type: 'string' },
          customer_name: { type: 'string' },
          notes: { type: 'string' }
        },
        required: ['delivery_address', 'customer_name']
      }
    }
  }
]
```

### Step 5.3 — Tool Executor

**`src/lib/openai/agent.ts`** — The `executeTool` function:

```typescript
async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  context: { storeId: string; customerId: string }
): Promise<string> {
  switch (toolName) {
    case 'search_catalog': {
      const { query, category, max_results = 5 } = args
      const supabase = createServiceClient()   // uses service role to bypass RLS for worker
      let q = supabase.from('products')
        .select('id, name, description, price, image_url, stock_qty')
        .eq('store_id', context.storeId)
        .eq('is_active', true)
        .gt('stock_qty', 0)
        .ilike('name', `%${query}%`)
        .limit(max_results)
      if (category) q = q.eq('category', category)
      const { data } = await q
      return JSON.stringify(data ?? [])
    }
    case 'add_to_cart': {
      // Fetch product, validate stock, add to Redis cart
    }
    case 'view_cart': {
      // Return cart from Redis
    }
    case 'create_order': {
      // Insert order + order_items to Supabase
      // Send notification to store owner
      // Clear cart from Redis
    }
    // ... other tools
  }
}
```

### Step 5.4 — Main AI Agent Loop

**`src/lib/openai/agent.ts`** — `runAgentLoop`:

```
1. Load conversation history from Redis
2. Load store info (greeting, store_id) from Supabase by phone_number_id
3. Build system prompt (includes store name, policies, current date)
4. Append incoming customer message to history
5. Call OpenAI GPT-4o-mini with tools
6. If response is tool_call:
   a. Execute the tool → get result
   b. Append assistant tool_call message + tool result to history
   c. Call OpenAI again with updated history
   d. Repeat until no more tool calls (max 5 iterations)
7. Extract final text response from AI
8. Save updated history to Redis
9. Send final response to customer via WhatsApp
```

### Step 5.5 — System Prompt Template

```
You are a friendly and helpful shopping assistant for {store_name}.
Today is {date}.

Your responsibilities:
- Help customers browse products using search_catalog tool
- Help customers add items to their cart
- Guide customers through checkout
- Answer questions about products using real data from the catalog

Rules:
- NEVER mention products that are not returned by search_catalog
- NEVER make up prices, stock levels, or product names
- Always be warm, friendly, and concise
- If stock_qty is 0, tell the customer it's out of stock
- Keep responses short — this is WhatsApp, not email
- When showing products, use the send_product_list response format
```

> **Acceptance Criteria:** Send "show me running shoes" → receive a formatted WhatsApp message listing real products from the DB. Send "add the first one to cart" → AI adds it and confirms.

---

## 💬 Phase 6 — WhatsApp Message Sender

**Goal:** A clean client that sends all types of WhatsApp messages (text, interactive lists, image, template).

### Step 6.1 — Meta API Client

**`src/lib/whatsapp/client.ts`**

Base function:
```typescript
async function callMetaAPI(phoneNumberId: string, accessToken: string, body: object) {
  const response = await fetch(
    `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Meta API Error: ${JSON.stringify(error)}`)
  }
  return response.json()
}
```

### Step 6.2 — Message Type Helpers

```typescript
// Simple text
export async function sendText(phoneNumberId: string, token: string, to: string, text: string)

// Product list (interactive list message)
export async function sendProductList(phoneNumberId: string, token: string, to: string, products: Product[])

// Order confirmation
export async function sendOrderConfirmation(phoneNumberId: string, token: string, to: string, order: Order)

// Cart summary
export async function sendCartSummary(phoneNumberId: string, token: string, to: string, cartItems: CartItem[])
```

### Step 6.3 — Interactive List Message Format

When `search_catalog` returns results, format as a WhatsApp Interactive List:

```json
{
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": { "type": "text", "text": "🛍️ Products Found" },
    "body": { "text": "Here are matching products:" },
    "footer": { "text": "Reply with the number to add to cart" },
    "action": {
      "button": "View Products",
      "sections": [{
        "title": "Results",
        "rows": [
          { "id": "product_uuid", "title": "Nike Air Max", "description": "PKR 12,500 · In Stock" }
        ]
      }]
    }
  }
}
```

> **Acceptance Criteria:** AI response triggers a real WhatsApp interactive list message visible on phone.

---

## ⚙️ Phase 7 — Background Worker (QStash)

**Goal:** Process AI tasks in the background so the webhook handler returns 200 instantly and never times out.

### Step 7.1 — Worker Route

**`src/app/api/worker/route.ts`**

```typescript
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'

export const POST = verifySignatureAppRouter(async (request: Request) => {
  const payload = await request.json() as IncomingMessage & { storeId: string }
  
  // Run the AI agent loop
  await runAgentLoop(payload)
  
  return new Response('OK', { status: 200 })
})
```

### Step 7.2 — Webhook → QStash Flow

In `src/app/api/webhook/route.ts` POST handler:

```typescript
import { Client as QStashClient } from '@upstash/qstash'

const qstash = new QStashClient({ token: process.env.QSTASH_TOKEN! })

// After parsing the message:
await qstash.publishJSON({
  url: `${process.env.NEXT_PUBLIC_APP_URL}/api/worker`,
  body: { ...parsedMessage, storeId }
})
```

### Step 7.3 — Multi-Tenancy Resolution in Worker

Worker must resolve `storeId` from `phoneNumberId`:

```typescript
const { data: store } = await supabase
  .from('stores')
  .select('id, whatsapp_access_token, name, greeting_message')
  .eq('whatsapp_phone_number_id', payload.phoneNumberId)
  .single()
```

> **Acceptance Criteria:** High-volume test (10 messages in 5 seconds) → all 200s returned to Meta → all messages processed in order in background.

---

## 🖥️ Phase 8 — Merchant Dashboard

**Goal:** A polished, functional web dashboard for store owners.

### Step 8.1 — Layout & Navigation

**`src/app/(dashboard)/layout.tsx`** — Sidebar with:
- Store logo + name
- Navigation: Overview, Catalog, Orders, Settings
- Logout button

### Step 8.2 — Overview Page

Stats cards:
- Total orders today
- Revenue today
- Active products count
- Pending orders count

Recent orders table (last 10).

### Step 8.3 — Catalog Page

- Product table with pagination
- "Add Product" button → Dialog/Sheet form
- "Upload CSV" button → Modal with drag-and-drop
- Per-product: Edit, Delete, Toggle Active

### Step 8.4 — Orders Page (Kanban Board)

Three columns: **New** | **Processing** | **Completed**

Each card shows:
- Order ID (short)
- Customer name + phone
- Order total
- Items summary
- Time ago

Actions:
- Click card → Expand to see full order details + item list
- "Move to Processing" button
- "Mark Complete" button

On status change → update `orders.status` in Supabase via API call.

### Step 8.5 — Settings Page

- Store name
- Greeting message (shown to customers on first contact)
- WhatsApp Phone Number ID
- WhatsApp Access Token (masked input)
- Save button

> **Acceptance Criteria:** Owner can log in, see stats, manage catalog, and update order statuses. UI is responsive on mobile.

---

## 🔔 Phase 9 — Order Notifications

**Goal:** When an order is created by the AI, the store owner receives a WhatsApp notification.

### Step 9.1 — Notification Flow

When `create_order` tool runs successfully:

```typescript
// After inserting order to DB:
await sendText(
  store.whatsapp_phone_number_id,
  store.whatsapp_access_token,
  storeOwnerWhatsAppNumber,  // stored in settings
  `🛒 *New Order Received!*\n\n` +
  `Customer: ${customerName}\n` +
  `Items: ${itemsSummary}\n` +
  `Total: PKR ${totalAmount}\n\n` +
  `View in dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`
)
```

### Step 9.2 — Store Owner WhatsApp Number

Add field `owner_whatsapp_number` to `stores` table:

```sql
alter table stores add column owner_whatsapp_number text;
```

Collect this during onboarding and in Settings.

> **Acceptance Criteria:** Place a test order via WhatsApp → owner receives WhatsApp notification within 30 seconds.

---

## 🚀 Phase 10 — Deployment (Vercel)

**Goal:** Deploy the full application to Vercel with all environment variables set.

### Step 10.1 — Pre-Deployment Checklist

- [ ] All `console.log` debug statements removed
- [ ] All env vars documented in `.env.example`
- [ ] `next.config.js` has allowed image domains (Supabase storage URL)
- [ ] Supabase RLS verified — run these queries as anon and confirm they return 0 rows
- [ ] Webhook signature verification is working

### Step 10.2 — Deploy to Vercel

```bash
npx vercel --prod
```

Or connect GitHub repo to Vercel dashboard for automatic deployments on push to `main`.

### Step 10.3 — Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` env var in Vercel to the production URL
2. Update Meta webhook URL to `https://your-app.vercel.app/api/webhook`
3. Re-verify webhook in Meta dashboard
4. Update QStash worker URL to production URL
5. Test end-to-end: WhatsApp → AI → Order → Dashboard → Notification

### Step 10.4 — Vercel Configuration

**`vercel.json`:**
```json
{
  "functions": {
    "src/app/api/webhook/route.ts": { "maxDuration": 10 },
    "src/app/api/worker/route.ts": { "maxDuration": 60 }
  }
}
```

> The webhook must respond in under 10s (Meta requirement). The worker can take up to 60s for AI processing.

> **Acceptance Criteria:** Production URL is live. End-to-end test passes on real phone. Dashboard accessible at `/dashboard`.

---

## 🧪 Phase 11 — Testing & QA

### Manual Test Scenarios

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Customer sends "hello" | Greeting + options menu |
| 2 | Customer asks "show me shoes" | Interactive product list |
| 3 | Customer taps a product to add to cart | Confirmation message |
| 4 | Customer says "view my cart" | Cart summary with total |
| 5 | Customer says "checkout" | AI asks for name + address |
| 6 | Customer provides delivery details | Order confirmed message |
| 7 | Owner receives WhatsApp notification | ✅ |
| 8 | Dashboard shows new order in "New" column | ✅ |
| 9 | Owner moves order to "Processing" | Status updates in real time |
| 10 | Product with 0 stock not shown | AI says "out of stock" |
| 11 | CSV upload of 50 products | All imported, visible in table |
| 12 | Two stores on same platform, isolated data | Store A cannot see Store B's data |

---

## 🔒 Security Checklist

- [ ] Meta webhook `X-Hub-Signature-256` verified on every POST
- [ ] QStash signature verified on worker route
- [ ] Supabase RLS enabled on all tables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never exposed to client (server/worker only)
- [ ] All API routes validate authenticated user before DB operations
- [ ] `store_id` always derived server-side from auth session, never from request body
- [ ] No sensitive env vars in `NEXT_PUBLIC_*` prefix

---

## 📋 Phase Order Summary

```
Phase 0  → Scaffold & Setup             (Day 1)
Phase 1  → Database Schema              (Day 1)
Phase 2  → Auth & Merchant Login        (Day 2)
Phase 3  → Product Catalog              (Day 3-4)
Phase 4  → WhatsApp Webhook             (Day 5)
Phase 5  → AI Engine                    (Day 6-7)
Phase 6  → WhatsApp Message Sender      (Day 7)
Phase 7  → Background Worker (QStash)   (Day 8)
Phase 8  → Merchant Dashboard           (Day 9-10)
Phase 9  → Order Notifications          (Day 10)
Phase 10 → Deployment                   (Day 11)
Phase 11 → Testing & QA                 (Day 11-12)
```

**Estimated MVP Timeline: ~12 working days**

---

## 🔮 Post-MVP Roadmap (Future Phases)

| Phase | Feature | Notes |
|-------|---------|-------|
| v1.1 | Stripe payment integration | Checkout link sent via WhatsApp |
| v1.2 | Human handover | Live chat takeover in dashboard |
| v1.3 | Broadcast campaigns | Bulk WhatsApp messages to customers |
| v1.4 | Delivery tracking | Integration with delivery services |
| v1.5 | Analytics dashboard | Revenue charts, top products |
| v1.6 | Multi-language support | Arabic, Urdu, etc. |
