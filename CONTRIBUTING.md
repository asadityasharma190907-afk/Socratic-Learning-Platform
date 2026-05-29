# 🤝 Contributing to SahAI for Shiksha

Thank you for showing interest in helping build **SahAI for Shiksha**! We are creating a lightweight, Socratic, offline-first educational platform to empower students and teachers around the globe.

To ensure visual excellence, code durability, and seamless collaboration, please read and follow these contribution guidelines.

---

## 🗺️ Branching Strategy

Our branching model relies on clear isolation:

1. **`main` (Production Branch):**
   - Must remain fully stable and deployable.
   - Direct commits are prohibited. Changes are only merged via approved Pull Requests.
2. **`feature/story-X.Y` (Feature Isolation):**
   - Used for working on specific BMad user stories (e.g., `feature/story-2.1-socratic-chat`).
3. **`bugfix/issue-description` (Bug Fixing):**
   - Used for patching problems tracked in Bug Reports.
4. **`chore/refactor/docs` (Non-functional Tasks):**
   - Used for template updates, build rules, or text changes.

---

## 💬 Commit Message Convention

We strictly follow the **Conventional Commits** standard to enable clear automated changelogs and easy repository rollbacks:

| Prefix | Use Case | Example |
| :--- | :--- | :--- |
| `feat:` | Introducing a new functional feature | `feat: implement interactive draggable canvas snaps` |
| `fix:` | Correcting a bug, functional error, or UI glitch | `fix: resolve canvas snap coordinate overlap on Safari` |
| `docs:` | Creating or updating documentation files | `docs: add contributing and security guidelines` |
| `style:` | Purely visual formatting, styling, HSL corrections | `style: adjust glowing snap guide active shadow HSL` |
| `refactor:` | Reworking code logic without changing its outcome | `refactor: extract socratic dialogue state triggers` |
| `chore:` | Updating workflows, configs, `.gitignore`, etc. | `chore: add automated htmlhint code quality workflow` |

---

## 🎨 Architectural & Design Guidelines

Our core objective is to deliver a premium user experience with **zero external dependencies**. Keep the following principles in mind:

### 1. Zero-dependency Core
- Do NOT run `npm init` or introduce package managers unless explicitly requested by the core architecture plan.
- All layouts must run perfectly by opening the static HTML files directly in any modern browser.

### 2. Premium Visual Design & HSL Colors
- Do NOT use standard flat red/blue/green colors.
- Use our curated HSL color tokens to ensure sleek, professional dark and light modes.
- Implement subtle glassmorphism and modern typography (e.g., Outfit or Inter fonts via Google Fonts).

### 3. Hardware-Accelerated 60 FPS Animations
- Focus on micro-animations (glowing guides, interactive snaps, slide-ins).
- Always use CSS `transform` and `opacity` to avoid re-triggering browser reflows, ensuring smooth **60 FPS transitions** even on ultra-low-spec hardware.

### 4. Accessibility First (WCAG AA Compliance)
- Maintain keyboard-navigable index flows (`tabindex="0"`).
- Make active use of screen-reader-friendly semantic elements (`<main>`, `<header>`, `<nav>`) and ARIA live announcements (`aria-live="polite"`).

---

## 📬 Pull Request Protocol

Before submitting a Pull Request (PR):
1. **Sync up:** Make sure your branch is up-to-date with `main`.
2. **Review the Checklist:** Complete the teammate checks in the `.github/pull_request_template.md`.
3. **Automated Checks:** Ensure the **Code Quality Audit** GitHub Action passes without any `htmlhint` warnings or errors.

---

## 🛡️ Repository Hygiene & Clean State (Judges' Wow-Factor)

To ensure that hackathon judges are only presented with clean, production-grade code:
*   **Do NOT force-track files:** Never use `git add -f` or bypass the `.gitignore`. AI agent caches (`.agent/`, `.agents/`, `.claude/`), local metadata (`_bmad/`), or temp directories must never be uploaded.
*   **Keep assets local and lightweight:** Use inline SVGs rather than heavy external image assets to ensure the static files load instantly (< 2s) for evaluation.

---

## 👥 Teammate Collaboration & Branch Protections (Gentlemen's Agreement)

Since this repository is hosted on a **personal account** where enterprise governance like Code Owners is unavailable, the team will adhere to the following branch protection workflow:

1.  **Branch Protection Setup (Git Master Teammate D):**
    *   Navigate to your new GitHub Repo -> **Settings** -> **Branches**.
    *   Click **Add branch protection rule**.
    *   Set **Branch name pattern** to `main`.
    *   Tick **Require a pull request before merging**.
    *   Tick **Require approvals** and set it to **1 approval**.
    *   Tick **Require status checks to pass before merging** and select your `code-quality` workflow.
2.  **Pull Request Reviews:**
    *   A minimum of **one teammate** must review and approve every PR before it can be merged into `main`.
    *   Teammate D (Git Master & Auditor) acts as the final gatekeeper to verify that all NFRs (Offline accessibility, WCAG compliance) are fully met before merging.
3.  **Local Conflict Resolution:**
    *   If a merge conflict occurs, pull `main` locally, rebase or merge it into your feature branch (`git merge main`), resolve conflicts in your editor, and then push back to GitHub. Never attempt to force-merge on the GitHub website.

