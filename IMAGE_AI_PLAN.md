# Photo → AI → Auto-filled Report Form

**Goal:** a citizen photographs a civic problem and the report form fills itself.
No typing, no category selection, no reading required.

**Guiding constraint:** the form does not change shape. Same fields, same
validation, same submit route, same duplicate check. The only thing that changes
is *where the values come from* — an AI API call instead of the keyboard.

---

## 1. Why this matters (the actual user)

A citizen who cannot read or write currently cannot file a report at all. The
form demands a typed title, a typed description, and a category chosen from
seven written labels.

With this change the flow becomes:

| Step | What the user does | What they need to read |
|---|---|---|
| 1 | Taps the camera button, photographs the pothole | nothing |
| 2 | Waits ~2s | nothing |
| 3 | Form is filled in — title, description, category | nothing |
| 4 | Taps Submit | one button |

The 🎤 voice input already shipped in the chatbot covers corrections. Together
they make the app usable without literacy.

**One thing this plan treats as mandatory, not optional:** a read-aloud button.
If the user cannot read the AI-written description, they cannot verify what is
being filed in their name. See §7.

---

## 2. What exists today

```
title (typed) → description (typed) → category (tapped) → photo (selected)
                                                                │
                                                        Submit pressed
                                                                │
                                          duplicate check (uses category)
                                                                │
                                          upload to Cloudinary  ← happens HERE
                                                                │
                                          POST /api/user/Generateissue
```

Relevant anchors:

| File | Line | What it does |
|---|---|---|
| `client/userclient/src/pages/Report.jsx` | 73–81 | the seven categories |
| `client/userclient/src/pages/Report.jsx` | 115–124 | `handlePhotoCapture` — preview only |
| `client/userclient/src/pages/Report.jsx` | 154–157 | required-field validation |
| `client/userclient/src/pages/Report.jsx` | 162–175 | duplicate pre-check |
| `client/userclient/src/pages/Report.jsx` | 193–203 | Cloudinary upload |
| `server/routes/userRoute.js` | ~99–145 | `Generateissue` — creates the Issue |
| `Chatbot-Javeed/app.py` | 44 | the existing `/ask` route |

**The one structural problem:** the photo is not uploaded until Submit. To fill
the form *from* the photo, the upload has to move earlier. That is the only
ordering change in this plan.

---

## 3. Target flow

```
photo selected
      │
      ▼
upload to Cloudinary          ← MOVED here from submitIssue()
      │
      ▼
POST /analyze-image { url }   ← NEW, ~2s, "Reading your photo…"
      │
      ▼
title + description + category filled in, marked "✨ suggested"
      │
      ├─ user edits by typing, or
      ├─ user edits by voice, or
      └─ user taps 🔊 to hear it read back
      │
      ▼
Submit  →  duplicate check  →  Generateissue      ← all UNCHANGED
```

---

## 4. Files touched

### New files (3)

| File | Purpose | Size |
|---|---|---|
| `Chatbot-Javeed/civicq/vision/__init__.py` | package marker | 1 line |
| `Chatbot-Javeed/civicq/vision/analyzer.py` | Groq vision call, prompt, schema validation | ~70 lines |
| `client/userclient/src/lib/analyzeImage.js` | `uploadToCloudinary()` + `analyzeImage()` | ~40 lines |

### Modified files (2)

| File | Change | Approx. diff |
|---|---|---|
| `Chatbot-Javeed/app.py` | add `POST /analyze-image` route | +18 lines |
| `client/userclient/src/pages/Report.jsx` | 4 edits, detailed below | +45 / −10 |

### Not touched

- `server/` — **nothing changes.** No new route, no schema change, no new
  dependency. The Node server never learns this feature exists.
- `server/models/issue.model.js` — unchanged in Phase 1. (Phase 4 optionally
  adds `ai_*` fields; see §8.)
- `Chatbot-Javeed/requirements.txt` — `groq` is already listed. No new package.
- `Chatbot-Javeed/civicq/rag/*` — the Pinecone work is untouched and unrelated.
- The chatbot, the voice input, the auth helper — all untouched.

---

## 5. The four edits to `Report.jsx`

Deliberately small. The form's JSX, its fields, its validation and its submit
path are all left alone.

**Edit 1 — two new state values** (near line 25)

```js
const [analyzing, setAnalyzing] = useState(false);
const [aiFilled, setAiFilled] = useState([]);   // which fields the AI wrote
```

**Edit 2 — `handlePhotoCapture` does the work** (lines 115–124)

Currently sets a preview and stops. Now it also uploads, analyzes, and prefills:

```js
const handlePhotoCapture = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setFormData(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
  setAnalyzing(true);

  try {
    const url = await uploadToCloudinary(file);
    const ai  = await analyzeImage(url);

    setFormData(prev => ({
      ...prev,
      photoUrl:    url,                          // reused at submit — no second upload
      title:       prev.title       || ai.title,
      description: prev.description || ai.description,
      category:    prev.category    || ai.category,
    }));
    setAiFilled(["title", "description", "category"]);
  } catch {
    // Fail open: the form still works exactly as it does today.
  } finally {
    setAnalyzing(false);
  }
};
```

Note `prev.title || ai.title` — anything the user already typed wins. The AI
only fills blanks.

**Edit 3 — `submitIssue` reuses the upload** (lines 193–203)

Replace the Cloudinary block with:

```js
submitData.photo = formData.photoUrl || (await uploadToCloudinary(formData.photo));
```

The fallback covers the case where analysis failed but the file is still there.

**Edit 4 — three small JSX additions**

- `{analyzing && <p>📷 Reading your photo…</p>}` under the photo preview
- `✨` badge beside any field listed in `aiFilled`
- 🔊 read-aloud button beside the description (see §7)

Everything else in the file — the category grid, the geolocation, the duplicate
modal, the anonymous toggle — is untouched.

---

## 6. The `/analyze-image` endpoint

```python
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    url = (request.get_json(force=True) or {}).get("url")
    if not url:
        return jsonify({"error": "url missing"}), 400
    return jsonify(analyze(url))
```

`civicq/vision/analyzer.py` holds the real work:

- Calls a Groq **vision** model with the Cloudinary URL.
  *Verify the current model ID against Groq's model list before wiring — the
  vision lineup has changed more than once.*
- Requests **JSON output**, not prose. A vision model asked for free text
  returns "This appears to be a pothole…" and you will be writing regexes forever.
- Returns exactly:

```json
{
  "category":    "Roads",
  "title":       "Large pothole on main road",
  "description": "A deep pothole roughly 60cm wide in the middle of the carriageway, filled with water.",
  "is_civic_issue": true,
  "confidence":  0.91
}
```

- **Validates `category` server-side** against the seven literal values in
  `Report.jsx:73-81`. A model that invents "Roadworks" must be coerced to
  `"Other"`, never passed through.
- Append `w_1024,q_auto` to the Cloudinary URL before sending. Full-resolution
  phone photos cost more tokens and buy no accuracy.

---

## 7. Read-aloud is required, not a nice-to-have

The target user cannot read the description the AI just wrote. Submitting text
in someone's name that they cannot verify is not acceptable, and it is trivially
avoidable — the browser does it for free, with no backend:

```js
speechSynthesis.speak(new SpeechSynthesisUtterance(formData.description));
```

A 🔊 button beside the description closes the loop: photograph → AI writes →
phone reads it back → user confirms or re-speaks it. That is a complete
non-literate flow.

Supported in every modern browser, including Firefox — unlike the speech
*recognition* used by the chatbot's mic.

---

## 8. Design rules

**Suggest, never enforce.** Every AI-filled field stays editable. A citizen
photographing something unusual must be able to override all of it.

**Fail open.** If Groq is down, slow, or returns nonsense, the form behaves
exactly as it does today. The entire analysis sits inside a `try/catch` that
falls through to manual entry. Never put an AI call between a citizen and
reporting a hazard.

**Show that it is a guess.** The ✨ badge matters. Users readily correct
something labelled a suggestion; they rarely question a field that looks
authoritative.

**Never auto-reject.** `is_civic_issue: false` produces a warning —
*"This doesn't look like a civic issue. Submit anyway?"* — never a block. Being
wrongly prevented from reporting a real hazard is far worse than one bad photo
reaching an admin.

**Cap latency.** 8s timeout on `/analyze-image`, then give up quietly. Submit is
never gated on it.

---

## 9. Consequences to accept

**Orphaned Cloudinary images.** Uploading on photo-select means abandoned forms
leave files behind. At current volume this is fine — but decide it deliberately
rather than discovering it in a billing alert. If it matters later: tag uploads
`pending`, promote on submit, sweep the rest on a schedule.

**The duplicate check now depends on AI output.** `Report.jsx:162` passes
`category` to `/checkDuplicate`. A wrong category queries the wrong bucket and
misses a real duplicate. Not fatal — `userRoute.js` re-checks server-side — but
it is a second reason to keep the category one tap to change.

**`/analyze-image` will be unauthenticated,** like `/ask`. Unlike `/ask`, every
call costs money, which makes it worth rate-limiting. Fold it into the same JWT
work as the chatbot endpoint — one auth decorator, both routes.

---

## 10. Build order

| Phase | Scope | Blocking? |
|---|---|---|
| 1 | `analyzer.py` + `/analyze-image`, testable with `curl` | — |
| 2 | `analyzeImage.js` + the four `Report.jsx` edits | needs 1 |
| 3 | 🔊 read-aloud button | independent, do anytime |
| 4 | Warning UI for `is_civic_issue: false` / low confidence | needs 2 |
| 5 | Persist `ai_category`, `ai_confidence` on the Issue for admin triage and accuracy measurement | needs 2 |
| 6 | JWT + rate limit on `/analyze-image` and `/ask` together | independent |

Phases 1–3 are the complete non-literate flow. Everything after is hardening.

---

## 11. Side benefit

AI-written descriptions are more consistent and more detailed than what citizens
type. That directly improves the Pinecone work in `Chatbot-Javeed/civicq/rag/` —
better source text means better embeddings means better semantic search when the
chatbot looks for similar issues.
