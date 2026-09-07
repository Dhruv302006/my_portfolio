export interface ProjectImage {
  url: string;
  title: string;
  caption: string;
  tag?: string;
}

export interface ReadmeSection {
  title: string;
  content: string;
  codeBlock?: {
    language: string;
    code: string;
  };
}

export interface ProjectDetail {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  tags: string[];
  metrics: { label: string; value: string; detail?: string }[];
  overview: string;
  architecturalHighlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  badge?: string;
  thumbnail?: string;
  demoImages?: ProjectImage[];
  readmeContent?: {
    summary: string;
    sections: ReadmeSection[];
  };
}

export const PROJECTS: Record<string, ProjectDetail> = {
  wallet: {
    id: 'wallet',
    title: 'High-Throughput Wallet & Ledger System',
    subtitle: 'Event-driven, ACID double-entry ledger & transactional wallet engine',
    role: 'Distributed Systems & Backend Engineering',
    tags: ['Node.js', 'Fastify', 'PostgreSQL', 'Redis', 'Apache Kafka', 'Docker'],
    badge: 'Distributed Systems',
    thumbnail: '/projects/wallet/wallet-dashboard.png',
    githubUrl: 'https://github.com/DhruvThakur',
    metrics: [
      { label: 'Latency Drop', value: '98.10%', detail: '1,526ms reduced to 29ms core API response' },
      { label: 'Throughput', value: '166+ TPS', detail: 'Zero deadlocks under local peak write load' },
      { label: 'Idempotency Gate', value: '< 1ms', detail: 'Fast-path Redis distributed locks (NX/PX keys)' },
    ],
    demoImages: [
      {
        url: '/projects/wallet/wallet-dashboard.png',
        title: 'Apex Wallet Engine — Real-Time Atomic Transfer Console',
        caption: 'Interactive transfer console executing atomic double-entry transactions with strict idempotency keys (idem-ql1jvotz4g-98lbpxp6lxn), real-time balance tracking, and client-side pre-flight validation.',
        tag: 'Active Transfer Console',
      },
      {
        url: '/projects/wallet/kafka-engine-metrics.png',
        title: 'Live Engine Metrics & Kafka Consumer Event Stream',
        caption: 'Real-time telemetry sourced from Kafka Consumers and PostgreSQL connection pool (1/50 active). Displays cumulative processed volume (₹27,200.00) and live consumer events streaming without database bottlenecks.',
        tag: 'Kafka Telemetry & Metrics',
      },
      {
        url: '/projects/wallet/sender-ledger-logs.png',
        title: 'Immutable Sender Ledger Logs & Running Balances',
        caption: 'Audit logs proving double-entry ledger bookkeeping from the sender perspective. Every outbound debit (-₹18,000, -₹500) computes an immutable balance-after state with zero drift.',
        tag: 'Sender Ledger Audit',
      },
      {
        url: '/projects/wallet/recipient-ledger-logs.png',
        title: 'Immutable Recipient Ledger Logs & Audit Trail',
        caption: 'Audit logs proving symmetric double-entry bookkeeping from the recipient perspective. Reflects corresponding credit events (+₹18,000, +₹500, +₹10,000) with precise microsecond timestamps.',
        tag: 'Recipient Ledger Audit',
      },
      {
        url: '/projects/wallet/auth-login.png',
        title: 'JWT Authentication & Session Security Gate',
        caption: 'Secure authentication boundary guarding wallet accounts with hashed credentials, JWT session tokens, and protected API routing.',
        tag: 'Auth & Security Gate',
      },
    ],
    overview:
      'A low-latency transactional ledger engineered to solve fundamental distributed systems challenges: ACID financial consistency, high-concurrency race conditions, idempotency, and latency optimization.',
    architecturalHighlights: [
      'Engineered a double-entry bookkeeping core where every transfer records immutable debit/credit entries, eliminating balance drift and providing audit trails.',
      'Eliminated write deadlocks under 166+ TPS local load by enforcing lexicographical row-level locking (alphabetically sorting wallet UUIDs prior to SELECT FOR UPDATE).',
      'Implemented a Redis distributed lock (NX/PX keys) fast-path idempotency gate, intercepting duplicate submissions and preventing double-spending in under 1ms.',
      'Decoupled heavy side effects (audit file appends, external SMTP notifications) using the Outbox pattern with Apache Kafka consumer groups, slashing response latency by 98.10% (1,526ms down to 29ms).',
      'Engineered write-through Redis balance caching inside the transactional commit lifecycle to serve read queries instantaneously without PostgreSQL hits.',
    ],
    readmeContent: {
      summary:
        'Apex Wallet is a high-throughput, low-latency financial ledger and transactional wallet engine engineered to solve fundamental distributed systems challenges: ACID consistency, double-entry bookkeeping, write deadlocks under concurrency, fast-path idempotency, and asynchronous side-effect decoupling via Apache Kafka.',
      sections: [
        {
          title: '1. Financial Invariants & Problem Statement',
          content:
            'Building financial software requires guaranteeing mathematical invariants that cannot fail under network partitions, concurrent user transfers, or process crashes. Naive implementations suffer from three critical flaws:\n\n1. Balance Drift from Single-Column Mutations: Directly running `UPDATE wallets SET balance = balance - amount` loses historical audit trails and makes reconciliation mathematically impossible during race conditions.\n2. Concurrency Deadlocks: When two users transfer funds to each other simultaneously (User A → User B, and User B → User A), uncoordinated row-level locks trigger cyclic PostgreSQL deadlocks.\n3. Latency Penalties from Synchronous Side Effects: Sending confirmation emails, webhook dispatches, and append-only audit files directly inside the database transaction balloons response latencies over 1,500ms.\n\nApex Wallet solves these challenges through double-entry accounting, deterministic lexicographical lock ordering, sub-millisecond Redis idempotency gates, and a Kafka-backed transactional outbox.',
        },
        {
          title: '2. Double-Entry Bookkeeping Core & Schema Architecture',
          content:
            'Every financial movement is modeled as an atomic transaction that produces two balanced ledger entries: one DEBIT and one CREDIT. At all points in time, the sum of debits equals the sum of credits.\n\n• `wallets` table: Holds wallet UUID, owner identity, currency, and current balance.\n• `transactions` table: Represents high-level business transfers with status, idempotency keys, and metadata.\n• `ledger_entries` table: Append-only immutable log recording debits and credits with balance-after snapshots for instantaneous historical auditing.',
          codeBlock: {
            language: 'sql',
            code: `-- Core Double-Entry Ledger Entry Table
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    type VARCHAR(10) NOT NULL CHECK (type IN ('DEBIT', 'CREDIT')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for instantaneous wallet ledger lookups
CREATE INDEX idx_ledger_wallet_created ON ledger_entries(wallet_id, created_at DESC);`,
          },
        },
        {
          title: '3. Concurrency Control: Lexicographical Row-Level Locking',
          content:
            'To eliminate cyclic database deadlocks under high write loads (166+ TPS), the engine enforces strict lexicographical lock ordering: wallet UUIDs are compared and sorted alphabetically prior to executing `SELECT FOR UPDATE`.\n\nBecause all concurrent database transactions acquire locks in the exact same deterministic sequence across the cluster, cyclic wait chains are mathematically impossible.',
          codeBlock: {
            language: 'typescript',
            code: `// Deterministic lock acquisition order
const [firstWalletId, secondWalletId] = [fromWalletId, toWalletId].sort();

await client.query('BEGIN');

// Acquire locks in deterministic alphabetical order
const firstWallet = await client.query(
  'SELECT id, balance FROM wallets WHERE id = $1 FOR UPDATE',
  [firstWalletId]
);
const secondWallet = await client.query(
  'SELECT id, balance FROM wallets WHERE id = $2 FOR UPDATE',
  [secondWalletId]
);

// Verify sender balance sufficiency before debiting
if (fromWallet.balance < amount) {
  await client.query('ROLLBACK');
  throw new InsufficientFundsError('Insufficient balance');
}`,
          },
        },
        {
          title: '4. Fast-Path Idempotency Gate (Redis Distributed Locks)',
          content:
            'To prevent double-spending and handle duplicate client requests caused by network retries, the API intercepts every transfer with a Redis distributed lock (`SET NX PX`).\n\n• If a key already exists with status `PROCESSING`, subsequent requests receive immediate `409 Conflict` in under 1ms without hitting PostgreSQL.\n• Once the transaction commits, the cached response is persisted in Redis with an extended TTL (24 hours) so subsequent identical requests receive identical cached responses.',
          codeBlock: {
            language: 'typescript',
            code: `// Sub-millisecond idempotency gate
const lockKey = \`idempotency:\${idempotencyKey}\`;
const acquired = await redis.set(lockKey, 'PROCESSING', 'PX', 5000, 'NX');

if (!acquired) {
  const cachedResponse = await redis.get(\`response:\${idempotencyKey}\`);
  if (cachedResponse) return JSON.parse(cachedResponse);
  throw new ConflictError('Transfer request already in progress');
}`,
          },
        },
        {
          title: '5. Transactional Outbox Pattern & Apache Kafka Streaming',
          content:
            'Heavy external side effects (audit file appends, live metrics computation, email dispatch) are decoupled from the core financial database transaction using the Transactional Outbox pattern.\n\n1. Inside the PostgreSQL transaction, an event row is written to the `outbox_events` table.\n2. A background Debezium/Kafka publisher worker streams new events to the `wallet.transactions` topic.\n3. Dedicated Kafka consumer groups process audit trails and telemetry asynchronously.\n\nResult: Core API latency plummeted by 98.10% (from 1,526ms down to 29ms) under sustained concurrency.',
        },
        {
          title: '6. Verified Benchmark Comparison',
          content:
            'Performance evaluated under local concurrency stress tests simulating simultaneous multi-user transfers:\n\n| Architecture / Metric | Baseline (Sync & Naive Locks) | Apex Engine (Lexicographical + Kafka Outbox) | Improvement |\n| :--- | :--- | :--- | :--- |\n| Core API Latency (p95) | 1,526 ms | 29 ms | 98.10% Latency Drop |\n| Write Throughput | 24 TPS (Deadlocks) | 166+ TPS (Zero Deadlocks) | 6.9x Throughput Gain |\n| Idempotency Gate Overhead | ~45 ms (DB Query) | < 1 ms (Redis NX/PX) | 97.8% Faster Gate |\n| DB Connection Utilization | 48 / 50 (Connection Exhaustion) | 1-4 / 50 (Optimal Pool) | 92% Pool Relief |',
        },
        {
          title: '7. Local Reproduction & Quickstart Guide',
          content:
            'Run the entire Apex Wallet distributed cluster locally using Docker:\n\n1. Start infrastructure services (Postgres, Redis, Kafka, Zookeeper):\n   `docker-compose up -d`\n\n2. Run database migrations & seed test wallets:\n   `npm run db:migrate && npm run db:seed`\n\n3. Start the Fastify transaction server & Kafka outbox worker:\n   `npm run start:server`\n   `npm run start:worker`\n\n4. Execute the concurrency stress test harness:\n   `npm run test:concurrency`',
        },
      ],
    },
  },
  ai_analyst: {
    id: 'ai_analyst',
    title: 'AI Financial Analyst — ReAct Orchestration & Controlled QLoRA',
    subtitle: 'Grounded financial LLM agent with hybrid RAG, SQL generation, and fine-tuning',
    role: 'AI / Applied Machine Learning',
    tags: ['Python', 'FastAPI', 'Qdrant', 'BM25', 'PyTorch', 'QLoRA', 'Ollama', 'Llama 3.2'],
    badge: 'Applied AI & RAG',
    thumbnail: '/projects/ai_analyst/dashboard-overview.png',
    githubUrl: 'https://github.com/DhruvThakur',
    metrics: [
      { label: 'Task Success Gain', value: '+51.43 pp', detail: 'Fine-tuned 1B model boosted from 40% to 91.43%' },
      { label: 'Benchmark Accuracy', value: '100%', detail: '35-case benchmark execution on Llama 3.1 8B' },
      { label: 'Inference Speedup', value: '17%', detail: '8.67s average latency reduction by trace tuning' },
    ],
    demoImages: [
      {
        url: '/projects/ai_analyst/dashboard-overview.png',
        title: 'Aura Analyst Desk — Grounded Multi-Source Reasoning Engine',
        caption: 'Central operations console connected to local Ollama (Llama 3.1 8B), managing 2,886 ledger records, 1,801 transactions, and 33 indexed corporate expense policy chunks.',
        tag: 'System Console',
      },
      {
        url: '/projects/ai_analyst/policy-summarization.png',
        title: 'Grounded Policy Retrieval & Multi-Clause Synthesis',
        caption: 'Natural language query ("can you summarize expense policy") synthesized across multiple document sections with strict source-anchored citations (General Guidelines, Prohibited Expenses, Category Allowances, Meal Limits).',
        tag: 'Hybrid RAG',
      },
      {
        url: '/projects/ai_analyst/conflict-resolution.png',
        title: 'Automated Governance Conflict Detection',
        caption: 'AI detects and explicitly resolves conflicting guidelines regarding large infrastructure expenses between Rule EXP-003 ($5k+ CTO authorization) and Rule EXP-002 (general office allowance exclusions).',
        tag: 'Reasoning & Conflict Detection',
      },
      {
        url: '/projects/ai_analyst/sql-policy-hybrid.png',
        title: 'Hybrid SQL Query Execution + Policy Verification',
        caption: 'Compound query filtering transactions categorized as "Business Expense" above $5,000 from SQLite and dynamically cross-referencing corporate expense policy rules for CTO authorization.',
        tag: 'Safe SQL + Policy Fusion',
      },
    ],
    overview:
      'A full-stack, self-contained AI Financial Analyst that executes secure schema-aware SQL queries, accesses ML telemetry, and performs hybrid RAG over corporate policy guidelines, validated through a controlled QLoRA fine-tuning experiment.',
    architecturalHighlights: [
      'Engineered a ReAct single-agent orchestration loop executing tools dynamically across SQL databases, ML telemetry, and hybrid RAG indexes.',
      'Designed a hybrid policy RAG engine combining dense vector search (Qdrant in-memory) and sparse keyword search (BM25), reranked via a local Cross-Encoder (ms-marco-MiniLM-L-6-v2 on CPU).',
      'Conducted a controlled QLoRA fine-tuning experiment on Llama 3.2 1B using curated observable tool-interaction traces (without hidden CoT), boosting task success from 40.0% to 91.43% and tool accuracy from 45.71% to 94.29%.',
      'Enforced connection-level authorization guards on SQLite (1,800+ transactions) with pre-execution EXPLAIN plan validation, neutralizing destructive mutations (DROP/UPDATE).',
    ],
    readmeContent: {
      summary:
        'Aura Analyst is an autonomous, source-grounded financial reasoning engine designed to bridge structured ledger databases, corporate governance policies, and pre-computed machine learning forecasts into a unified, zero-hallucination analyst desk.',
      sections: [
        {
          title: '1. Problem Statement & Design Objectives',
          content:
            'Financial reasoning in enterprise environments requires reconciling three fundamentally disparate data modalities: structured relational ledgers (SQL transactions), unstructured compliance policies (PDFs/Markdown documents), and statistical forecasts (ML models). Traditional naive LLM wrappers fail due to three primary limitations:\n\n1. Hallucinated SQL Queries: LLMs executing unconstrained SQL pose severe database security and data drift risks.\n2. Isolated Document Search: Dense-only vector retrieval frequently misses exact alphanumeric rule codes (e.g. "Rule EXP-003").\n3. Edge Deployability Constraints: Running large 70B+ parameter models on local developer workstations or edge nodes is prohibitively expensive and introduces high latency.\n\nAura Analyst solves this with a ReAct orchestration engine, hybrid RAG (Qdrant + BM25 + Cross-Encoder), and a controlled QLoRA fine-tuning methodology on Llama 3.2 1B.',
        },
        {
          title: '2. Multi-Source ReAct Orchestration Architecture',
          content:
            'The core intelligence layer implements a deterministic ReAct (Reasoning + Acting) loop where the agent iteratively generates Thoughts, invokes Tools, observes environment feedback, and delivers grounded conclusions with exact citations.',
          codeBlock: {
            language: 'python',
            code: `@tool
def execute_sql_query(query: str) -> dict:
    """Executes validated read-only SQL queries over the SQLite ledger."""
    validate_query_safety(query) # Checks EXPLAIN plan & forbids mutations
    with sqlite_connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return {"columns": columns, "rows": rows, "count": len(rows)}

@tool
def search_expense_policies(query: str, top_k: int = 4) -> list[dict]:
    """Performs hybrid dense vector + BM25 keyword search with Cross-Encoder reranking."""
    dense_results = qdrant_client.search(collection_name="policies", query_vector=embed(query), limit=top_k * 2)
    bm25_results = bm25_index.get_top_n(query.split(), policy_chunks, n=top_k * 2)
    fused_candidates = reciprocal_rank_fusion(dense_results, bm25_results)
    return cross_encoder_rerank(query, fused_candidates)[:top_k]`,
          },
        },
        {
          title: '3. Security Architecture & SQLite Authorization Guards',
          content:
            'To protect production ledgers (2,886 ledgers, 1,801 transactions), the system implements dual-layer safety guards:\n\n• Connection-Level SQLite Authorizer: A low-level hook (`set_authorizer`) intercepts every SQL instruction at compile-time, denying any action other than `SQLITE_SELECT` and `SQLITE_READ`.\n• Pre-Execution EXPLAIN Plan Validation: Before executing any generated query, the engine analyzes its execution plan to ensure it does not touch internal system tables or exceed memory limits.',
          codeBlock: {
            language: 'python',
            code: `def authorizer_callback(action_code, arg1, arg2, db_name, trigger_name):
    ALLOWED_ACTIONS = {sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ}
    if action_code in ALLOWED_ACTIONS:
        return sqlite3.SQLITE_OK
    # Explicitly block DROP, DELETE, UPDATE, INSERT, ALTER, ATTACH
    return sqlite3.SQLITE_DENY

connection.set_authorizer(authorizer_callback)`,
          },
        },
        {
          title: '4. Controlled QLoRA Fine-Tuning Experiment (Llama 3.2 1B)',
          content:
            'A central experimental contribution was determining whether a lightweight 1B model could achieve enterprise-grade tool-use accuracy through Parameter-Efficient Fine-Tuning (PEFT) using curated observable traces.\n\n• Base Model: Llama 3.2 1B Instruct\n• Training Dataset: 35 curated observable tool traces capturing complex multi-hop queries, schema mapping, and conflict resolution without hidden chain-of-thought bloat.\n• Quantization: 4-bit NormalFloat (NF4) with double quantization\n• LoRA Configuration: rank r = 16, alpha = 32, dropout = 0.05, targeting all linear projection layers (q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj).\n\nKey Empirical Findings:\n• Task Success Rate surged from 40.0% to 91.43% (+51.43 percentage points).\n• Tool Selection Accuracy climbed from 45.71% to 94.29% (+48.58 percentage points).\n• Completely neutralized SQL syntax hallucinations and enforced deterministic JSON tool-calling schema.',
        },
        {
          title: '5. Benchmark Comparison & Verified Metrics',
          content:
            'The system was evaluated against a rigorous 35-case benchmark spanning single-tool lookups, multi-clause policy synthesis, and complex hybrid queries (e.g. finding high-value transactions and cross-referencing CTO authorization policies):\n\n| Model / Variant | Task Success | Tool Accuracy | Avg Latency | Hardware Footprint |\n| :--- | :--- | :--- | :--- | :--- |\n| Llama 3.2 1B (Zero-Shot Base) | 40.00% | 45.71% | 10.45s | 1.8 GB VRAM |\n| Llama 3.2 1B (QLoRA Fine-Tuned) | 91.43% | 94.29% | 8.67s | 2.1 GB VRAM |\n| Llama 3.1 8B (Base In-Context) | 100.00% | 100.00% | 14.20s | 8.5 GB VRAM |\n\nThe fine-tuned 1B model delivers 91.43% accuracy while cutting memory by 75% and speeding up inference by 39% compared to the 8B baseline.',
        },
        {
          title: '6. Local Installation & Reproduction Guide',
          content:
            'To run the Aura Analyst desk locally with Ollama and FastAPI:\n\n1. Pull Ollama base model:\n   `ollama pull llama3.1:8b`\n\n2. Clone repository & install dependencies:\n   `git clone https://github.com/DhruvThakur/ai-financial-analyst.git`\n   `cd ai-financial-analyst && pip install -r requirements.txt`\n\n3. Initialize vector embeddings & SQLite database:\n   `python scripts/ingest_policies.py`\n   `python scripts/seed_ledgers.py`\n\n4. Start FastAPI server:\n   `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`\n\n5. Open the web UI at `http://localhost:8000` to interact with the analyst desk.',
        },
      ],
    },
  },
  maplink: {
    id: 'maplink',
    title: 'MapLink — Horizontally Scaled Geospatial Platform',
    subtitle: 'Distributed real-time spatial telemetry cluster with PostGIS and Redis Pub/Sub',
    role: 'Distributed Real-Time Systems',
    tags: ['React.js', 'Node.js (Express)', 'Socket.io', 'PostgreSQL', 'PostGIS', 'Redis', 'Nginx', 'Docker'],
    badge: 'Real-Time Telemetry',
    thumbnail: '/projects/maplink/room-tracking.png',
    githubUrl: 'https://github.com/DhruvThakur',
    metrics: [
      { label: 'DB Write Reduction', value: '98.0%', detail: '50 writes/s reduced to 0.2 writes/s via bulk flusher' },
      { label: 'Historical Query Speedup', value: '41.1x', detail: '424.76ms down to 10.34ms via GiST & composite indexes' },
      { label: 'Cross-Server Broadcast', value: '~8ms', detail: 'Multi-node Redis Pub/Sub WebSocket synchronization' },
    ],
    demoImages: [
      {
        url: '/projects/maplink/room-tracking.png',
        title: 'MapLink Live Room Tracking Console — IIT Hyderabad',
        caption: 'Real-time geospatial tracking console centered on IIT Hyderabad. Displays active connected trackers (dhruv), live shareable room invite links (UUID-isolated), and sub-8ms bidirectional telemetry via WebSockets.',
        tag: 'Live Tracking Console',
      },
      {
        url: '/projects/maplink/macro-spatial-map.jpg',
        title: 'Macro Satellite Spatial View & Regional Telemetry',
        caption: 'High-resolution satellite cartography displaying regional geospatial tracking over Hyderabad, India. Powered by Leaflet vector rendering and PostGIS spatial coordinates (EPSG:4326).',
        tag: 'Satellite Cartography',
      },
      {
        url: '/projects/maplink/session-portal.png',
        title: 'Room-Isolated Session Hub & Dynamic UUID Join Portal',
        caption: 'Portal to spin up ephemeral tracking rooms or join existing sessions via secure UUIDs or direct invite links. Rooms are isolated across WebSocket namespaces with zero cross-talk.',
        tag: 'Session Management',
      },
      {
        url: '/projects/maplink/auth-login.png',
        title: 'Session Authentication & Google OAuth Gate',
        caption: 'Security gateway safeguarding room creation with JWT token verification and Google OAuth identity providers.',
        tag: 'Auth & Identity Gate',
      },
    ],
    overview:
      'A horizontally scaled geospatial telemetry platform enabling live tracking across dynamic sharing rooms, backed by an Edge Nginx load balancer, PostGIS spatial indexing, and Redis write-behind caching.',
    architecturalHighlights: [
      'Built a distributed multi-node architecture with 3 Node.js instances load-balanced behind Edge Nginx using sticky sessions (ip_hash) and unified port 80 routing, eliminating CORS preflight overhead.',
      'Synchronized WebSocket room broadcasts across cluster nodes using @socket.io/redis-adapter Pub/Sub streams with sub-8ms cross-instance latency.',
      'Reduced PostgreSQL disk write load by 98% by buffering incoming coordinate pings in a Redis List and executing 15-second bulk transaction inserts into PostGIS with ST_SetSRID.',
      'Optimized historical route queries by 97.5% (424.76ms to 10.34ms) by constructing composite and GiST spatial indexes.',
      'Engineered client-side Haversine geodetic filtering (3s interval, 5m threshold), slashing client telemetry network requests by 75% and removing stationary GPS noise.',
    ],
    readmeContent: {
      summary:
        'MapLink is a horizontally scalable, real-time geospatial telemetry platform engineered to support high-frequency location tracking across dynamic, room-isolated sessions. Backed by a 3-node Node.js cluster, Edge Nginx load balancing, Redis write-behind caching, and PostGIS spatial indexing, it reduces database write pressure by 98% while achieving sub-11ms historical route query speeds.',
      sections: [
        {
          title: '1. Engineering Motivation & Scalability Bottlenecks',
          content:
            'Building real-time tracking infrastructure for mobile devices presents severe operational bottlenecks at scale:\n\n1. Database I/O Saturation: A single tracking session with 20 users broadcasting GPS pings at 1Hz produces 1,200 database writes per minute. Under multi-room loads, conventional relational databases hit disk I/O bottlenecks and connection pool exhaustion.\n2. Cross-Node State Fragmentation: When scaling backend services horizontally across multiple server instances, WebSockets terminate on separate nodes, making cross-server broadcast delivery impossible without a distributed message bus.\n3. Latency in Spatial Geometry Queries: Calculating historical routes or proximity queries over millions of coordinates without specialized spatial indexes requires expensive table scans taking 400ms+.\n4. Client-Side Battery & Network Exhaustion: Unconstrained GPS polling burns device battery and floods cell networks with redundant stationary coordinates.\n\nMapLink solves these challenges through a write-behind Redis cache, PostGIS spatial indexing, an Edge Nginx cluster topology, and client-side Haversine filtering.',
        },
        {
          title: '2. Multi-Node Cluster Topology & Edge Nginx Load Balancing',
          content:
            'The platform runs three Node.js application server replicas fronted by an Edge Nginx reverse proxy. To ensure seamless WebSocket protocol upgrades, Nginx enforces IP-hash session stickiness (`ip_hash`).\n\nBy unifying client UI delivery and WebSocket endpoints on port 80, the architecture completely eliminates cross-origin preflight requests (OPTIONS), slashing connection establishment latency.',
          codeBlock: {
            language: 'nginx',
            code: `upstream maplink_cluster {
    ip_hash; # Sticky sessions for WebSocket connection stability
    server app_node_1:3000;
    server app_node_2:3000;
    server app_node_3:3000;
}

server {
    listen 80;
    server_name localhost;

    location /socket.io/ {
        proxy_pass http://maplink_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
          },
        },
        {
          title: '3. Cross-Node WebSocket Synchronization via Redis Pub/Sub',
          content:
            'To enable real-time location sharing between users connected to different physical Node.js containers, MapLink implements `@socket.io/redis-adapter`.\n\nWhen User A (connected to Node 1) transmits a coordinate update, Node 1 publishes the event to Redis. The Redis adapter instantly broadcasts the event to Node 2 and Node 3 in sub-8ms, ensuring all participants in the room observe continuous marker movement.',
          codeBlock: {
            language: 'typescript',
            code: `import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));

// Room-isolated coordinate streaming
io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId });
  });

  socket.on('send-location', ({ roomId, coords }) => {
    // Broadcast to room members across all cluster nodes
    socket.to(roomId).emit('receive-location', coords);
    // Buffer coordinates into Redis write-behind list
    redisBuffer.push(roomId, coords);
  });
});`,
          },
        },
        {
          title: '4. Write-Behind Redis Buffer & PostGIS Bulk Flusher (98% Write Reduction)',
          content:
            'Rather than executing synchronous SQL queries on every GPS ping (50 writes/s), incoming coordinates are buffered into a high-speed Redis List (`LPUSH`).\n\nA scheduled background worker executes every 15 seconds, atomically draining the buffer (`RPOP` / `PIPELINE`) and inserting hundreds of coordinates into PostGIS in a single parameterized multi-row transaction.\n\nResult: Database write operations dropped from 50 writes/s to 0.2 writes/s—a massive 98.0% reduction in database I/O pressure.',
          codeBlock: {
            language: 'typescript',
            code: `// 15-second atomic bulk insert into PostGIS
async function flushLocationBuffer() {
  const pings = await redis.rpop('location_buffer', 1000);
  if (!pings.length) return;

  const values = pings.map((p) => [
    p.roomId,
    p.userId,
    \`SRID=4326;POINT(\${p.lng} \${p.lat})\`, // PostGIS spatial geometry
    p.timestamp,
  ]);

  const query = format(
    'INSERT INTO location_pings (room_id, user_id, geom, created_at) VALUES %L',
    values
  );
  await db.query(query);
}`,
          },
        },
        {
          title: '5. Spatial Indexing & 41.1x Historical Query Speedup',
          content:
            'To support historical route playback and heatmaps over millions of telemetry points, the database schema incorporates composite B-Tree indexes on `(room_id, created_at DESC)` and a Generalized Search Tree (GiST) spatial index on the `geom` column.\n\n• Baseline query time (unindexed sequential scan): 424.76 ms\n• PostGIS indexed execution (Index Scan on GiST + composite): 10.34 ms\n• Query speedup: 41.1x faster (97.5% reduction in query execution latency).',
        },
        {
          title: '6. Client-Side Haversine Geodetic Filtering',
          content:
            'To prevent mobile battery drain and filter out stationary GPS sensor drift (where a phone resting on a desk jumps slightly due to satellite noise), MapLink incorporates a client-side Haversine geodetic distance filter:\n\n• Polls HTML5 Geolocation API at 3-second intervals.\n• Computes great-circle distance to the last broadcast coordinate.\n• If distance < 5 meters, the ping is discarded locally without transmitting network packets.\n\nResult: 75% reduction in client network requests during stationary periods, extending mobile battery longevity.',
        },
        {
          title: '7. Verified Benchmark Summary',
          content:
            'Performance evaluated under local multi-room load testing simulating 100 concurrent active trackers:\n\n| Architectural Metric | Unbuffered Baseline | MapLink Distributed Cluster | Improvement |\n| :--- | :--- | :--- | :--- |\n| Database Write Frequency | 50.0 writes/s | 0.2 writes/s | 98.0% Reduction |\n| Historical Route Query (p95) | 424.76 ms | 10.34 ms | 41.1x Faster |\n| Cross-Node Broadcast Latency | N/A (Failed) | ~8 ms | Sub-10ms Global Sync |\n| Client Cellular Uplink Rate | 1,200 req/hour | 300 req/hour | 75% Data Saved |',
        },
        {
          title: '8. Local Reproduction & Docker Deployment Guide',
          content:
            'Run the entire MapLink distributed stack locally with Docker Compose:\n\n1. Launch containers (3 Node.js instances, PostGIS, Redis, Nginx):\n   `docker-compose up -d`\n\n2. Run database migrations to enable PostGIS extensions:\n   `npm run migrate:postgis`\n\n3. Access the tracking console at `http://localhost:80`\n\n4. Open two separate browser tabs to experience real-time multi-user synchronization.',
        },
      ],
    },
  },
  aura_intel: {
    id: 'aura_intel',
    title: 'Aura Intel — FinTech Intelligence & Analytics Platform',
    subtitle: 'Machine learning, cashflow forecasting, and double-entry ledger auditing engine',
    role: 'Data Science & Machine Learning',
    tags: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'React.js', 'Vite', 'TailwindCSS'],
    badge: 'FinTech & ML Platform',
    thumbnail: '/projects/aura_intel/overview-dashboard.png',
    liveUrl: 'https://dhruv302006.github.io/FinTech_Platform/',
    githubUrl: 'https://github.com/DhruvThakur',
    metrics: [
      { label: 'Ledger Audit Correctness', value: '100%', detail: '1,801 transactions verified via sequential replay' },
      { label: 'Anomaly Radar', value: '33 Outliers', detail: 'Isolation Forest flagged statistical deviations at 86% confidence' },
      { label: 'Cashflow Forecast', value: '94% R²', detail: 'Recursive Random Forest with 7-day periodicity lag features' },
    ],
    demoImages: [
      {
        url: '/projects/aura_intel/overview-dashboard.png',
        title: 'Executive Summary Dashboard — Real-Time Ledger Intelligence',
        caption: 'Central FinTech operations overview monitoring ₹1,31,14,705 total volume outflow across 20 active wallet registries. Displays verified ledger health (1,801 txs), aggregated daily inflow/outflow timeline, and volume allocation donut chart highlighting ₹37,74,451 in core expenditures.',
        tag: 'Executive Overview',
      },
      {
        url: '/projects/aura_intel/ml-forecasting.png',
        title: 'ML Cashflow Forecasting & 94% R² Random Forest Projections',
        caption: 'Recursive multi-step cashflow forecasting predicting ₹3,92,010 spent over next 7 days, ₹11,37,795 over 30 days (₹37,926 daily average). Powered by 7-day calendar lag features and rolling variance windows capturing business-day periodicity with 94% R² model fitting accuracy.',
        tag: 'Cashflow Forecasting (94% R²)',
      },
      {
        url: '/projects/aura_intel/customer-segmentation.png',
        title: 'Customer Hub & RFM Behavioral Segmentation Space',
        caption: 'Interactive 2D K-Means clustering space mapping wallet holders across Total Spend (INR) vs. Transaction Frequency. Accurately segments users into High-Value VIP Spenders (orange), Regular Spenders (green), and Low-Value / Inactive cohorts (purple).',
        tag: 'K-Means RFM Cohorts',
      },
      {
        url: '/projects/aura_intel/anomaly-radar.png',
        title: 'Anomaly Radar & Isolation Forest Outlier Surveillance',
        caption: 'Real-time statistical anomaly surveillance powered by Isolation Forest. Automatically flags suspicious multi-attribute deviations (e.g. repeated Airbnb lodging transactions with scores down to -0.0748 at 86% confidence) and verifies ledger audit integrity.',
        tag: 'Isolation Forest Radar',
      },
    ],
    overview:
      'The analytical and machine learning intelligence layer operating atop transactional ledgers, providing automated double-entry verification, customer cohort profiling, anomaly scoring, and recursive cashflow projections.',
    architecturalHighlights: [
      'Developed a schema-compliant ledger auditing pipeline that sequentially replays debit and credit journals for 1,801 transactions to verify 100% balance integrity against reported wallet records.',
      'Engineered an RFM (Recency, Frequency, Monetary) feature pipeline and fitted K-Means clustering to partition users into distinct behavioral cohorts (VIP Spenders, Regular, Inactive).',
      'Constructed an Anomaly Radar with an Isolation Forest classifier across numerical and categorical features (amount, hour, merchant), isolating 33 anomalous financial events with up to 86% confidence.',
      'Trained a Recursive Multi-Step Random Forest regressor with calendar lag features (1, 2, 3, 7, 14 days) and rolling windows to forecast 30-day platform cashflow outflows with 94% R² accuracy.',
    ],
    readmeContent: {
      summary:
        'Aura Intel is a production-grade financial analytics and machine learning platform operating directly atop double-entry transactional ledgers. Featuring automated ledger consistency verification (1,801 transactions sequentially replayed), recursive Random Forest cashflow forecasting (94% R² accuracy), K-Means RFM customer cohort segmentation, and Isolation Forest anomaly surveillance, Aura Intel transforms raw ledger databases into actionable, mathematically audited financial intelligence.',
      sections: [
        {
          title: '1. Executive Summary & Problem Statement',
          content:
            'Financial systems and payment networks generate continuous streams of transactional data, yet raw transactional ledgers cannot answer high-level operational and strategic questions without specialized analytical layers:\n\n1. Ledger Reconciliation Fragility: In conventional architectures, ledger reconciliation happens through slow batch queries that fail to catch running balance drift or orphaned transactions until end-of-month audits.\n2. Inflexible Cashflow Forecasting: Linear regressions and simple moving averages fail to model non-linear periodic patterns, such as business-day transaction surges and weekend lulls.\n3. Undifferentiated Customer Cohorts: Treating all active wallets equally obscures high-value VIP accounts requiring elevated risk thresholds and white-glove credit facilities.\n4. Static Fraud Rule Bottlenecks: Fixed threshold rules (e.g. "flag transactions > $10,000") fail to detect subtle behavioral outliers, like repeated medium-value out-of-region lodging transactions.\n\nAura Intel bridges these gaps by providing a live executive dashboard, 100% verified ledger replay, 94% R² recursive forecasting, K-Means RFM clustering, and an Isolation Forest anomaly radar.',
        },
        {
          title: '2. Double-Entry Ledger Sequential Replay & Health Audit',
          content:
            'To guarantee absolute financial integrity before analytical modeling, Aura Intel executes an automated sequential replay over the entire transactional corpus (1,801 transactions across 20 wallet registries representing ₹1,31,14,705 in cumulative outflow).\n\n• The audit engine iterates chronologically through each debit and credit record.\n• Recomputes running wallet balances step-by-step: `balance_t = balance_{t-1} + credit_t - debit_t`.\n• Confirms zero drift against reported ledger snapshots, guaranteeing 100% ledger correctness before training machine learning models.',
          codeBlock: {
            language: 'python',
            code: `def verify_double_entry_ledger_integrity(transactions_df: pd.DataFrame, wallets_df: pd.DataFrame) -> dict:
    """Sequentially replays all debit/credit journals to verify 100% balance integrity."""
    audit_results = {}
    
    # Sort transactions chronologically
    sorted_txs = transactions_df.sort_values(by="created_at", ascending=True)
    
    for wallet_id, initial_balance in wallets_df[["id", "initial_balance"]].itertuples(index=False):
        running_balance = initial_balance
        wallet_txs = sorted_txs[(sorted_txs["from_wallet_id"] == wallet_id) | (sorted_txs["to_wallet_id"] == wallet_id)]
        
        for _, tx in wallet_txs.iterrows():
            if tx["from_wallet_id"] == wallet_id:
                running_balance -= tx["amount"] # Debit
            if tx["to_wallet_id"] == wallet_id:
                running_balance += tx["amount"] # Credit
                
        reported_balance = wallets_df.loc[wallets_df["id"] == wallet_id, "current_balance"].values[0]
        drift = abs(running_balance - reported_balance)
        assert drift < 1e-4, f"Drift detected in wallet {wallet_id}: expected {running_balance}, got {reported_balance}"
        audit_results[wallet_id] = {"status": "VERIFIED", "drift": 0.0}
        
    return {"total_audited": len(sorted_txs), "status": "100% VERIFIED", "wallets": audit_results}`,
          },
        },
        {
          title: '3. Recursive Multi-Step Cashflow Forecasting (94% R² Random Forest)',
          content:
            'To project future platform capital requirements, Aura Intel trains an ensemble Random Forest regressor with recursive multi-step forecasting.\n\nFeature Engineering Pipeline:\n• Calendar Lag Features: Incorporates lags at t-1, t-2, t-3, t-7, and t-14 days. The 7-day lag is critical for capturing strong weekly periodicity (consistent spikes on business days and troughs on weekends).\n• Rolling Statistical Windows: Computes 7-day and 14-day rolling means and standard deviations to capture medium-term trend velocity.\n• Day-of-Week & Calendar Indicators: Categorical cyclic encodings capturing monthly closing cycles.\n\nForecast Results:\n• Next 7 Days Projected Spend: ₹3,92,010\n• Next 30 Days Projected Spend: ₹11,37,795\n• Daily Average Projection: ₹37,926\n• Model Fitting Confidence: 94% R² Accuracy with minimal residue around activity spikes.',
          codeBlock: {
            language: 'python',
            code: `from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

def build_cashflow_feature_matrix(daily_spend_series: pd.Series) -> tuple:
    df = pd.DataFrame({"spend": daily_spend_series})
    # Lag features capturing weekly periodicity
    for lag in [1, 2, 3, 7, 14]:
        df[f"lag_{lag}"] = df["spend"].shift(lag)
        
    # Rolling statistics
    df["rolling_mean_7"] = df["spend"].shift(1).rolling(window=7).mean()
    df["rolling_std_7"] = df["spend"].shift(1).rolling(window=7).std()
    
    # Calendar features
    df["day_of_week"] = df.index.dayofweek
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    
    clean_df = df.dropna()
    X = clean_df.drop(columns=["spend"])
    y = clean_df["spend"]
    return X, y

# Model Training & Recursive Forecasting
rf_model = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
rf_model.fit(X_train, y_train)
y_pred = rf_model.predict(X_test)
print(f"Model R² Score: {r2_score(y_test, y_pred):.2%}") # 94.12%`,
          },
        },
        {
          title: '4. RFM Feature Engineering & K-Means Customer Segmentation',
          content:
            'Aura Intel partitions wallet accounts into behavioral cohorts using Recency, Frequency, and Monetary (RFM) modeling:\n\n• Recency (R): Days elapsed since the wallet\'s last transaction.\n• Frequency (F): Total count of lifetime transactions executed.\n• Monetary (M): Cumulative total spend in INR (₹).\n\nClustering Methodology:\n1. Features are log-transformed to dampen extreme skewness and scaled via `StandardScaler`.\n2. Fitted with K-Means clustering (k=3), mapping users into an interactive 2D spend-frequency space:\n   - High-Value VIP Spenders (orange): Accounts with >200 transactions and spend exceeding ₹25,00,000.\n   - Regular Spenders (green): Active users transacting consistently between ₹1,00,000 and ₹7,00,000.\n   - Low-Value / Inactive Spenders (purple): Dormant accounts with single-digit transactions.',
          codeBlock: {
            language: 'python',
            code: `from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def compute_rfm_segments(transactions_df: pd.DataFrame, reference_date: pd.Timestamp) -> pd.DataFrame:
    rfm = transactions_df.groupby("from_wallet_id").agg({
        "created_at": lambda date: (reference_date - date.max()).days, # Recency
        "transaction_id": "count",                                       # Frequency
        "amount": "sum"                                                  # Monetary
    }).rename(columns={"created_at": "recency", "transaction_id": "frequency", "amount": "monetary"})
    
    # Standardize RFM features
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(np.log1p(rfm))
    
    # 3-Cluster Partition
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    rfm["cluster"] = kmeans.fit_predict(rfm_scaled)
    
    cluster_labels = {0: "Low-Value / Inactive", 1: "Regular Spender", 2: "High-Value VIP"}
    rfm["cohort"] = rfm["cluster"].map(cluster_labels)
    return rfm`,
          },
        },
        {
          title: '5. Anomaly Radar: Isolation Forest Outlier Surveillance',
          content:
            'Rather than relying on brittle threshold rules, Aura Intel incorporates an unsupervised Isolation Forest model to isolate statistical anomalies in transaction behavior.\n\nEvaluation Dimensions:\n• Transaction Amount: Outliers relative to user\'s historical spending profile.\n• Temporal Attributes: Unusual hour of day or unexpected clustering of midnight transactions.\n• Merchant Category & Location: High-frequency spending in high-risk categories (e.g. Travel & Lodging, Airbnb) from unusual client IP / devices.\n\nSurveillance Findings:\n• Flagged 33 anomalous transactions (1.83% of the 1,801 transaction dataset).\n• Example: Repeated Airbnb lodging reservations by \`ananya.travel@domain.com\` flagged with anomaly scores between -0.0748 and -0.0521 (83%–86% confidence).',
          codeBlock: {
            language: 'python',
            code: `from sklearn.ensemble import IsolationForest

def train_anomaly_radar(feature_matrix: pd.DataFrame) -> pd.DataFrame:
    # 3% expected anomaly contamination rate
    iso_forest = IsolationForest(
        n_estimators=150,
        contamination=0.03,
        random_state=42
    )
    
    # Fit model and calculate decision function scores
    iso_forest.fit(feature_matrix)
    scores = iso_forest.decision_function(feature_matrix)
    predictions = iso_forest.predict(feature_matrix)
    
    results = feature_matrix.copy()
    results["anomaly_score"] = scores
    results["is_anomaly"] = predictions == -1
    # Convert anomaly score to human-readable confidence percentage
    results["confidence"] = np.clip((0.5 - scores) * 100, 50, 99).astype(int)
    
    return results[results["is_anomaly"]].sort_values(by="anomaly_score")`,
          },
        },
        {
          title: '6. Verified Platform Telemetry & Benchmarks',
          content:
            'Empirical benchmarks demonstrating analytical performance across the transactional corpus:\n\n| Capability / Metric | Traditional Manual Auditing | Aura Intel ML Platform | Improvement |\n| :--- | :--- | :--- | :--- |\n| 1,801 Tx Ledger Replay | 15 - 30 minutes | 218 ms | ~5,000x Instant Audit |\n| Cashflow Forecast Accuracy | 62.4% (ARIMA / MA) | 94.1% R² (Random Forest) | +31.7 pp Accuracy |\n| Outlier Surveillance | Fixed Threshold (>₹50k) | Multi-Attribute Isolation Forest | Flags 33 Subtle Outliers |\n| Dashboard Query Rendering | 1,200 ms | < 85 ms (Optimized State) | 14.1x Faster UX |\n| Total Volume Audited | ₹1,31,14,705 | ₹1,31,14,705 (100% Reconciled) | Zero Balance Drift |',
        },
        {
          title: '7. Live Deployment & Quickstart',
          content:
            'Experience the live production application deployed on GitHub Pages:\n\n🔗 **Live Application URL**: [https://dhruv302006.github.io/FinTech_Platform/](https://dhruv302006.github.io/FinTech_Platform/)\n\nLocal Development Setup:\n```bash\n# 1. Clone repository\ngit clone https://github.com/DhruvThakur/FinTech_Platform.git\ncd FinTech_Platform\n\n# 2. Install dependencies\nnpm install\n\n# 3. Run development server\nnpm run dev\n\n# 4. Build for production\nnpm run build\n```',
        },
      ],
    },
  },
  open_source: {
    id: 'open_source',
    title: 'Open Source Contributions',
    subtitle: 'Upstream engineering in distributed backends and developer tooling',
    role: 'Open Source Contributor',
    tags: ['Go', 'PostgreSQL', 'TypeScript', 'Prisma ORM', 'Docker'],
    badge: 'Open Source',
    metrics: [
      { label: 'Supabase Auth', value: 'PR #2668', detail: 'Exact case-insensitive email lookup optimization' },
      { label: 'Rakuten QueryCraft', value: 'PR #109', detail: 'Offline Prisma ORM schema transpiler for LLMs' },
    ],
    overview:
      'Active upstream contributor to open-source developer tooling and production authentication infrastructure.',
    architecturalHighlights: [
      'Supabase Auth (Go): Implemented exact, case-insensitive user lookup by email on the admin API, replacing slow fuzzy searches with index-supported PostgreSQL queries. Validated functionality via Go unit testing and Docker container environments for client SDKs (PR #2668).',
      'Rakuten Tech QueryCraft AI-SQL: Built offline Prisma ORM schema parsing by engineering a TypeScript transpiler that converts Prisma models into standard SQL DDL for LLM context injection without requiring live database connections (PR #109).',
    ],
  },
  philosophy: {
    id: 'philosophy',
    title: 'Technical & Cultural Philosophy',
    subtitle: 'Harmonizing high-throughput systems with user-centric engineering',
    role: 'Engineering Philosophy',
    tags: ['Distributed Systems', 'Architecture', 'UX', 'Reliability'],
    badge: 'Philosophy',
    metrics: [
      { label: 'Wa (和)', value: 'System Harmony', detail: 'Deadlock-free high-throughput distributed routing' },
      { label: 'Omotenashi (おもてなし)', value: 'Proactive Architecture', detail: 'Zero-latency caching & frictionless UX' },
    ],
    overview:
      'Translating deep cultural principles into high-integrity distributed systems and delightful developer experiences.',
    architecturalHighlights: [
      'System Harmony (Wa / 和): Inspired by the algorithmic precision and high-throughput routing of Japanese transit networks to design deadlock-free, distributed backend architectures with predictable queuing and zero race conditions.',
      'Proactive Architecture (Omotenashi / おもてなし): Exploring how the Japanese ethos of anticipatory hospitality translates into frictionless software—driving the implementation of zero-latency write-through caches, background outbox workers, and instantaneous user interfaces.',
    ],
  },
};

export const PERSONAL_INFO = {
  name: 'Dhruv Milind Thakur',
  title: 'Distributed Systems, Backend & Applied AI Engineer',
  education: 'B.Tech in Engineering Physics',
  institution: 'IIT Hyderabad (Class of 2028)',
  cgpa: '7.6 / 10.0',
  email: 'ep24btech11010@iith.ac.in',
  phone: '+91 8104951282',
  location: 'Hyderabad, India',
  links: {
    github: 'https://github.com/DhruvThakur',
    linkedin: 'https://linkedin.com/in/dhruvthakur',
    leetcode: 'https://leetcode.com',
  },
  positions: [
    {
      role: 'Head, Operations Domain',
      organization: 'Institute Technical Council, IIT Hyderabad',
      period: 'Current Tenure',
      description: 'Overseeing institute-wide technical operations, resource allocation, and technical initiatives.',
    },
    {
      role: 'Assessment Lead',
      organization: 'Office of Career Council, IIT Hyderabad',
      period: 'Current Tenure',
      description: 'Directing assessment strategies, candidate evaluations, and recruitment technical frameworks.',
    },
    {
      role: 'Core Management & Operations',
      organization: "Tinkerers' Lab, IIT Hyderabad",
      period: 'June 2025 - May 2026',
      description: 'Managed operational procurement and directed technical execution for the flagship Thrust tech event.',
    },
  ],
  skills: {
    programming: ['C/C++', 'JavaScript', 'Python', 'TypeScript', 'Go'],
    frameworks: ['Node.js', 'Fastify', 'Express.js', 'React.js', 'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch'],
    ai_llm: ['LLMs', 'RAG Pipelines', 'Embeddings', 'Qdrant', 'BM25', 'QLoRA Fine-Tuning', 'Ollama'],
    databases_backend: ['PostgreSQL', 'PostGIS', 'MongoDB', 'Redis', 'Kafka', 'REST APIs', 'WebSockets', 'JWT'],
    devops_tools: ['Docker', 'Nginx', 'Git', 'GitHub Actions', 'AWS S3', 'Postman'],
  },
  extracurriculars: [
    '500+ Data Structures and Algorithms problems solved on LeetCode',
    'Playing Football under National Sports Organization (NSO) IIT Hyderabad',
    'Japanese Culture & Society coursework enthusiast',
  ],
  certifications: [
    { title: 'Introduction to Generative AI', issuer: 'Google Cloud' },
    { title: 'Prompt Engineering with GitHub Copilot', issuer: 'Microsoft' },
    { title: 'Get Started with Databricks for Generative AI', issuer: 'Databricks' },
  ],
};
