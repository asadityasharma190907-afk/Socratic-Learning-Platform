## 🧑‍💻 Pull Request: [Story / Issue Title]

### 📝 Change Summary
Provide a clear, high-level summary of what changes this PR introduces and why they are necessary.

---

### 🔍 Affected Portals & Components
*Select all that apply:*
- [ ] **Student Canvas (`student.html`)**
- [ ] **Teacher Cockpit (`teacher.html`)**
- [ ] **Home Portal (`index.html`)**
- [ ] **Presentation/Deck (`pitch-deck.html`)**
- [ ] **Core CSS Tokens / Theme / Styling**
- [ ] **Offline Storage / State Synchronization**

---

### 🧪 Verification & Testing Completed
Detail the steps you took to verify that your changes operate correctly and do not introduce regressions.

#### 🔄 Manual Walkthrough Steps:
1. Open the page `...` in your browser.
2. Perform the following action: `...`
3. Observe the expected result: `...`

#### 📡 Offline Mode Verification:
- [ ] Toggled Offline Mode to active
- [ ] Verified chatbot falls back to `LESSON_TREE` successfully
- [ ] Verified local coordinates snap correctly without browser network exceptions

---

### 📸 Visual Evidence (Screenshots / Recordings)
*Mandatory for all front-end UI and visual state updates. Paste/embed your visual proof below:*

> **UI Preview:**
> (Insert screenshot or drag-and-drop animated GIF here)

---

### 🛡️ Engineering Quality Checklist
- [ ] **Lint & Format:** Code is clean, correctly formatted, and free of commented-out junk blocks.
- [ ] **Browser Console Audit:** Verified that opening the page and completing the workflow throws **zero** console errors or warnings.
- [ ] **WCAG AA Accessibility Check:** Keyboard navigation (`Tab` indices) is maintained, and appropriate `aria-*` tags are present.
- [ ] **Offline Resilience:** All assets (SVGs, scripts) are bundled or served locally; no external network requests are strictly required for high-fidelity interactive flow.
