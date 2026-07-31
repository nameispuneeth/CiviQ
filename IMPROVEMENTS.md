# CiviQ — Improvement Roadmap

> Codebase audit and prioritised action plan for taking CiviQ from a working
> student project to a portfolio piece that stands up to technical interview scrutiny.
>
> **Audited:** 2026-07-31
> **Stack:** React 19 + Vite (×2 clients) · Express 5 + Mongoose · MongoDB Atlas · Flask + LangChain RAG chatbot
> **Deployed:** Vercel (clients) · Render (server + chatbot)

---

## How to use this document

Items are grouped into tiers by **impact per hour spent**. Work top-down — Tier 0
items actively damage the project's credibility, while Tier 3 items are polish.

If you only have one week, do these four:
**#1 (hash passwords) → #4 (tests) → #5 (CI) → #14 (README).**
That combination signals security awareness, testing discipline, automation, and
communication — the four things that separate a hired junior from an ignored one.

---

## 🔴 Tier 0 — Fix before sharing the repo

These are actively harmful. An interviewer who finds #1 will not read further.

### 1. Passwords are stored in plaintext ⚠️ CRITICAL

**Where:** [`server/routes/authRoute.js`](server/routes/authRoute.js) lines 21, 35, 61, 74

```js
// Registration — stores the raw password
await User.create({ name, email, password });

// Login — compares raw strings in the query
const user = await User.findOne({ email, password });
```

The same pattern repeats for Admin (`:61`) and Employee (`:74`). There is **no
hashing library in `server/package.json`** at all.

**Why it matters:**
- Any backend interviewer opens `authRoute.js` first. This ends the conversation.
- It is a live security problem, not just a portfolio one — the app is deployed
  with a real Atlas database, so real users' passwords are readable to anyone
  with DB access. People reuse passwords across sites.

**Fix:**
- [ ] `npm i bcrypt` (or `argon2`)
- [ ] Hash on register: `await bcrypt.hash(password, 10)`
- [ ] Compare on login: `await bcrypt.compare(password, user.password)` — note this
      requires fetching by email first, then comparing; you can no longer put the
      password in the `findOne` query
- [ ] Write a one-off migration script to hash existing plaintext rows
- [ ] Add `select: false` to the password field so it never leaks in API responses

**Effort:** ~half a day · **Impact:** flips the repo from liability to credible

---

### 2. Secrets hygiene

Backend secrets (Mongo URI with password, JWT signing secrets) were previously
pasted into the **frontend** `.env`. Verify nothing sensitive ever reached git
history before sharing the repo link — recruiters do clone these.

- [ ] Audit history: `git log -p | grep -iE "mongodb\+srv|ScrtCode|api[_-]?key"`
- [ ] If found, rotate credentials **and** scrub history (`git filter-repo` / BFG)
- [ ] Rotate the Mongo password and both JWT secrets regardless — they travelled
      through a chat app
- [ ] Confirm `.gitignore` covers `.env` and `.env.*` in all three apps ✅ *(done)*

---

### 3. CORS is wide open

**Where:** [`server/index.js:12`](server/index.js#L12) — `app.use(cors())`

Allows every origin on the internet to call your API with credentials.

- [ ] Restrict to the two Vercel domains + localhost for dev

---

## 🟡 Tier 1 — Highest resume ROI

~95% of student MERN projects have none of these. This is where you differentiate.

### 4. Automated tests

Currently **zero** test files in the entire repo.

Best starting point: [`server/utils/duplicate.js`](server/utils/duplicate.js) — pure,
deterministic, no DB or network needed for the maths. Ideal first test suite.

- [ ] Set up Vitest (or Jest) + Supertest
- [ ] Unit-test `distanceInMeters()` — known coordinate pairs, zero distance,
      antipodal points
- [ ] Unit-test `findNearbyDuplicates()` — inside/outside radius boundary,
      category mismatch, resolved issues excluded, malformed lat/lng strings
- [ ] Integration-test auth routes — register, login, bad password, missing token
- [ ] Integration-test `Generateissue` — duplicate linking, `confirmed_unique` bypass

**Effort:** 1–2 days · **Impact:** highest single differentiator after #1

---

### 5. CI/CD with GitHub Actions

No `.github/workflows` directory exists.

- [ ] Workflow running lint + tests on every push/PR
- [ ] Build both clients to catch compile errors
- [ ] Status badge in the README

**Effort:** ~30 lines of YAML · **Impact:** disproportionately high for the effort

---

### 6. Input validation

No `zod` / `joi` / `express-validator` anywhere. Every route trusts `req.body`.

**Concrete vulnerability:** [`Generateissue`](server/routes/userRoute.js) spreads user
input directly into `Issue.create(issueData)`. A client can set
`status: "resolved"`, `report_count: 9999`, or `assigned_department` on their own
report — fields that should only ever be set server-side or by an admin.

- [ ] Add `zod` schemas per route; whitelist allowed fields explicitly
- [ ] Never spread raw `req.body` into a model constructor
- [ ] Return structured 400s on validation failure

---

### 7. Pagination and database indexes

- `Issue.find()` returns the **entire collection** to the admin dashboard
- **Zero indexes** defined on any model

The duplicate-detection query filters on `{ category, status, duplicate_of }` —
a compound index there is an easy, measurable win.

- [ ] Compound index on `{ category: 1, status: 1 }`
- [ ] Index on `duplicate_of`
- [ ] `.limit()` / `.skip()` (or cursor pagination) on all list endpoints
- [ ] Measure before/after with `.explain("executionStats")`

**Talking point:** *"I added a compound index and took the duplicate check from a
full collection scan to an index scan"* — concrete, quantified, interview-ready.

---

### 8. Rate limiting and security headers

The login endpoint accepts unlimited password attempts — trivially brute-forceable.

- [ ] `express-rate-limit` on `/api/auth/*` (strict) and globally (loose)
- [ ] `helmet` for security headers
- [ ] `express-mongo-sanitize` against operator injection

---

## 🟢 Tier 2 — Features that make it interesting

Most portfolio projects are CRUD clones. You have two things that genuinely aren't —
lean into them hard.

### 9. Lean into the two distinctive features

**The RAG chatbot** — [`Chatbot-Javeed/app.py`](Chatbot-Javeed/app.py) uses LangChain +
FAISS + Groq (Llama 3.1 8B) + Mistral embeddings. That is a real retrieval pipeline
and a strong 2026 differentiator. It is currently undersold: the frontend sends
**hardcoded `dummyUserIssues`** ([`Chatbot.jsx`](client/userclient/src/components/Chatbot.jsx)).

- [ ] Wire the chatbot to real user issue data so it can answer
      *"what's the status of my pothole report?"* — turns a demo into a feature
- [ ] Clean `requirements.txt` — currently duplicated, with unused deps
      (`streamlit`, `langchain_google_genai`)
- [ ] Fix `DATA_DIR = "../GEMMA/docs"` — points outside the repo to a folder that
      doesn't exist here, so nobody else can rebuild the FAISS index

**Geospatial duplicate detection** — already implemented (category + 50m Haversine
radius, unresolved issues only, links duplicates and counts distinct reporters).
Already a better systems-design story than most projects have.

- [ ] Migrate `latitude`/`longitude` from `String` to GeoJSON `Point` + `2dsphere`
      index; use Mongo's native `$near` instead of an in-app loop
- [ ] **This also fixes the admin map** — [`MapView.jsx`](client/adminclient/src/components/MapView.jsx#L19)
      already expects `issue.location.coordinates`, which nothing currently
      produces, so it silently renders zero markers
- [ ] Per-category radii (50m potholes, 300m flooding); skip auto-linking for "Other"
- [ ] Complete the `reporters[]` work so one user can't inflate `report_count`

---

### 10. Real-time status updates
- [ ] WebSockets (Socket.io) or SSE so citizens see status changes without refresh
- [ ] Demonstrates you can build beyond request/response

### 11. Analytics dashboard
`recharts` and `@mui/x-charts` are already installed and unused for this.
- [ ] Average resolution time per department
- [ ] Issue volume by category over time
- [ ] SLA breach tracking / ageing reports
- [ ] Heatmap of issue density

### 12. Email notifications
- [ ] Nodemailer + Resend/SendGrid on status change
- [ ] Shows async work and third-party integration

### 13. Consolidate role-based access control
Three separate JWT secrets with auth checks copy-pasted across every route.
- [ ] Single `authMiddleware(role)` used everywhere
- [ ] One signing secret with a `role` claim in the payload
- [ ] Textbook refactor that interviewers respect

---

## ⚪ Tier 3 — Polish

### 14. A real README
The most-read file in any repo, and the most underrated for effort spent.
- [ ] Architecture diagram (4 services: 2 clients, API, chatbot)
- [ ] Screenshots / GIF of the main flows
- [ ] Live demo links
- [ ] Local setup steps that actually work from a fresh clone
- [ ] Tech-stack rationale — *why* these choices, not just what
- [ ] CI badge

### 15. Drop a UI library
Currently shipping **Chakra UI + MUI + Tailwind** simultaneously → 428 KB bundle.
- [ ] Pick one (Tailwind + MUI is the most defensible pairing given current usage)
- [ ] Shows judgement about dependency bloat

### 16. Docker Compose
- [ ] One-command local setup: Mongo + server + both clients + chatbot
- [ ] Currently a new developer must hand-configure four separate things

### 17. Consistent error handling
Routes mix `res.send({status:'error'})`, silent catches, and raw exception leaks
(`res.send({status:'error', error: e})` in `adminRoute.js` exposes internals).
- [ ] Central Express error-handling middleware
- [ ] Consistent response envelope across all endpoints
- [ ] Proper HTTP status codes (several errors currently return 200)
- [ ] Structured logging (`pino` / `winston`) instead of `console.log("dwaidu")`

### 18. TypeScript migration (optional, high effort)
- [ ] Consider for the server first — highest value, smallest surface
- [ ] Only worth it if you have time after everything above

---

## Suggested order of work

| Week | Focus | Items |
|------|-------|-------|
| 1 | Stop the bleeding | 1, 2, 3, 6, 8 |
| 2 | Prove engineering discipline | 4, 5, 7, 17 |
| 3 | Make it memorable | 9, 11, 13 |
| 4 | Presentation | 14, 15, 16, 10, 12 |

---

## Interview talking points this unlocks

Once the above is done, you can credibly discuss:

- **Security:** "I found plaintext passwords in my own code and migrated to bcrypt
  with a backfill script for existing users."
- **Algorithms:** "I implemented Haversine-based geospatial duplicate detection,
  then moved it to MongoDB `2dsphere` indexes when the linear scan stopped scaling."
- **Data modelling:** "Duplicates link to a canonical issue and count *distinct*
  reporters, so the priority signal can't be gamed by one user reporting twice."
- **AI/ML:** "I built a RAG pipeline over civic documentation with FAISS and
  Llama 3.1, grounded in the user's own issue history."
- **Testing & automation:** "CI runs the suite on every push; the duplicate
  detection logic is fully unit-tested including boundary conditions."
- **Performance:** "Adding a compound index took the duplicate query from a
  collection scan to an index scan."

---

## Current state — quick reference

| Area | Status |
|------|--------|
| Password hashing | ❌ plaintext |
| Input validation | ❌ none |
| Tests | ❌ none |
| CI/CD | ❌ none |
| Docker | ❌ none |
| DB indexes | ❌ none |
| Pagination | ❌ none |
| Rate limiting | ❌ none |
| CORS restriction | ❌ open to all |
| Error handling | ⚠️ inconsistent |
| `.env` management | ✅ per-mode files, gitignored |
| Duplicate detection | ✅ implemented (flat lat/lng) |
| RAG chatbot | ⚠️ works, but fed dummy data |
| Admin map | ❌ renders no markers (schema mismatch) |
