# 🤝 SahAI for Shiksha — Team Task Breakdown & Collaboration Guide

Welcome team! This guide breaks down our Phase 1 backlog into highly focused, bite-sized tasks. It defines clear roles so we can divide and conquer, and outlines our team’s engineering standards and Git workflow to ensure a smooth, professional collaboration that will impress the judges.

---

## 👥 Teammate Roles & Assignments

We have divided the workload into four specialized roles based on engineering strengths. Align each teammate to a role below:

| Role | Responsibility | Primary Files | Key Strengths |
|---|---|---|---|
| **🎨 Teammate A: UI/UX & Animations Lead** *(The Designer)* | Interactive drag-and-drop canvas, CSS keyframes, confetti animations, dark-mode tokens, accessibility alignment. | `student.html`, custom styles | CSS transitions, Drag-and-Drop APIs, asset integration. |
| **🧠 Teammate B: Logic & Socratic Engine Lead** *(The Architect)* | Chatbot state machine, local JSON fallback tree, reflection modal, hint limits, state serialization. | `student.html`, JSON config | JavaScript state management, logical paths, LocalStorage API. |
| **📊 Teammate C: Teacher Analytics & SVG Lead** *(The Data Analyst)* | Mastery grid rendering, SVG radar chart polygon coordinates, hover tooltip, support feed alerts. | `teacher.html` | SVG calculations, responsive grids, UI triggers. |
| **🛡️ Teammate D: Git Master & QA Auditor** *(The Release Manager)* | Git branch tracking, PR approvals, offline-first manual tests, WCAG accessibility validations. | All files, `.github/` templates | Git workflows, test scaffolding, accessibility checks. |

---

## 📋 Active Sprints: Task breakdowns

Here is the exact step-by-step developer checklist for our active Phase 1 stories.

### 📍 Epic 1: Student Cockpit Shell

#### 🎨 Story 1.2: Draggable Design Canvas (`student.html`)
*   **Assigned to:** **Teammate A (UI/UX Lead)**
*   **The Problem:** Students need a visual workspace to drag and place rainwater harvesting components.
*   **Small Steps to Solve:**
    1.  **Create Canvas Container:** Add a `.canvas-area` div inside `student.html` right next to the chatbot panel. Design it with a beautiful dark-mode glassmorphic grid background.
    2.  **Add Draggable Component Tiles:** Create a sidebar of draggable SVGs/tiles: *Rooftop*, *Pipes*, *First-Flush Diverter*, *Filter Chamber*, *Recharge Well*. Use native HTML5 `draggable="true"` and give each a descriptive ID (e.g., `id="comp-first-flush"`).
    3.  **Define Drop Zones:** Create corresponding highlight zones on the canvas. Write CSS rules for `.snap-zone` with a subtle dashed border that pulses with a glowing outline when a draggable tile hovers over it.
    4.  **Implement Drag-and-Drop JS Event Listeners:** Write event handlers for `dragstart`, `dragover`, `dragleave`, and `drop`. Ensure that on `drop`, the tile snaps smoothly into the active snap zone and triggers a bounce animation:
        ```css
        @keyframes scale-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        ```
    5.  **Trigger Serialization:** On a successful drop, save the active dropped layout to `LocalStorage` under `sahAI_session_rainwater` so the student doesn't lose progress on page refresh.

---

### 📍 Epic 2: Socratic Engine & Feedback Loop

#### 🧠 Story 2.1: Socratic Chatbot State Machine (`student.html`)
*   **Assigned to:** **Teammate B (Logic Lead)**
*   **The Problem:** The chatbot must dynamically prompt the student with Socratic dialogues on incorrect canvas layouts instead of plain rejections.
*   **Small Steps to Solve:**
    1.  **Define the Pre-Baked Dialogue Paths:** Create a robust Javascript object in `student.html` holding the dialogue stages:
        *   *Path A (No First-Flush Diverter):* Prompt the student with: *"Great attempt! But think about what happens during the very first minutes of a rain shower. Does the roof stay perfectly clean, or does the first wash carry dust and debris?"*
        *   *Path B (Expensive filter material choice):* Prompt with: *"Excellent layout! However, the village operates on a tight budget. Can we build our filter layers using natural, local materials instead of expensive import chemicals? What might sand, gravel, or pebbles do?"*
    2.  **Hook up the "Validate Design" Button:** Link `id="btn-validate-design"` to evaluate the dropped canvas components. If a component is missing or wrong, activate the chatbot panel (`translateX(0)` transition).
    3.  **Write Typing Animation Delays:** Use JavaScript `setTimeout` chains (e.g., 500ms to 800ms) to display a pulsing typing indicator (`id="typingIndicator"`) before adding a chat bubble to the feed.
    4.  **Inject Interactive Scaffold Chips:** Append suggested answer pills (`.scaffold-chips`) under the bot's Socratic questions, enabling students to click a pill to pre-fill their chat box (Story 2.1).
    5.  **A11y markup:** Add `aria-live="polite"` to the chat message container so screen readers read new messages aloud as they appear.

#### 🧠 Story 2.2: Offline Mode Fallback (`student.html` & `teacher.html`)
*   **Assigned to:** **Teammate B (Logic Lead)** & **Teammate A (UI/UX Lead)**
*   **The Problem:** The system must continue its Socratic prompts even if the student's internet drops.
*   **Small Steps to Solve:**
    1.  **Create the Offline Toggle UI:** Teammate A adds a beautiful sliding toggle (`id="toggle-offline"`) in the top navbar.
    2.  **Add the Offline Ribbon Banner:** Create a gorgeous alert ribbon at the top of the screen (`id="offline-banner"`) that is hidden by default. When the toggle is checked, slide the ribbon down with a smooth keyframe transition showing *"📡 Offline Mode Active — Learning continues!"*.
    3.  **Embed Lesson Trees locally:** Create a constant `const LESSON_TREE = {...}` containing all pre-baked Socratic prompt strings in a nested JSON structure directly inside `student.html`.
    4.  **Route Evaluator Logic:** In the validation function, check `isOffline` state. If true, bypass any external network calls and immediately load chatbot messages from `LESSON_TREE` in under 100ms.

#### 🎨 Story 2.3: Rewards & Dependency Limiter (`student.html`)
*   **Assigned to:** **Teammate A (UI/UX Lead)** & **Teammate B (Logic Lead)**
*   **The Problem:** Students should be rewarded with badges, but prevented from getting dependent on hints.
*   **Small Steps to Solve:**
    1.  **Add Confetti Container:** Teammate A creates a fixed canvas (`id="confetti-container"`) over the screen. When the challenge is complete, fire a custom high-performance canvas-based confetti particle burst.
    2.  **Animate Resilience Badge:** Prepare an SVG for the "Resilience Badge" inside a hidden container. On completion, slide the badge up using standard CSS `translateY` with a scale bounce. Show a points ribbon: `+15 Hydrology · +10 Social Empathy`.
    3.  **Implement Hint Counter:** Teammate B creates a tracker: `let hintCounter = 0;`.
    4.  **Build Self-Reflection Modal:** Create a clean glassmorphic modal (`id="modal-self-reflect"`) that locks the screen if `hintCounter >= 8` and a 9th hint is requested.
    5.  **Add Reflection Validation:** The modal must contain a textarea (`id="reflection-input"`) and a button (`id="btn-unlock-hints"`). Disable the button until the user has typed at least **10 characters** of reflection. Once clicked, hide the modal and unlock hints.

---

### 📍 Epic 3: Teacher Dashboard

#### 📊 Story 3.1: Mastery Grid & Support Alerts (`teacher.html`)
*   **Assigned to:** **Teammate C (Teacher Lead)**
*   **The Problem:** Teachers need a real-time visualization of student scores and emotional status alerts.
*   **Small Steps to Solve:**
    1.  **Design responsive Table layout:** Create a custom grid in `teacher.html` (`id="mastery-grid"`) representing students on rows and concepts on columns. Use HSL styling tokens:
        *   Green (`--mint-dim` & `--mint-dark` border) for >75%
        *   Amber (`--amber-dim` border) for 50-75%
        *   Red (`--coral-dim` border) for <50%
    2.  **Add hover Tooltips:** Write a CSS hover-class so that when a teacher hovers over a low-mastery grid box, a sleek tooltip pops up suggesting a brief group activity.
    3.  **Implement Alert Cards:** Create a vertical feed (`id="alert-dashboard"`) on the right. Populate it with glassmorphic cards showing active student alerts (e.g. *"Vaibhav K. has high frustration markers"*). Add action chips: *"Schedule check-in"*, *"Pair with Riya"*.

#### 📊 Story 3.2: SVG Holistic Radar Chart (`teacher.html` & `student.html`)
*   **Assigned to:** **Teammate C (Teacher Lead)**
*   **The Problem:** Draw a multi-dimensional radar chart of student attributes using pure inline SVG paths instead of external charting libraries (meeting NFR4).
*   **Small Steps to Solve:**
    1.  **Define Radar Axes Coordinates:** Map the 5 growth coordinates (Academic, Critical Thinking, Perseverance, Collaboration, Creativity) into polar coordinates on a 300x300 canvas.
    2.  **Render Grid Web & Axes lines:** Write a function `drawSVGWeb()` that outputs SVG `<polygon>` lines for the background spiderweb circles and `<line>` elements for the axes.
    3.  **Draw Student Growth Polygon:** Write a function `generateRadarPath(studentScores)` that takes a student's values (e.g., `[72, 58, 85, 64, 76]`), converts them to SVG X/Y coordinates, and renders an SVG `<polygon>` with a glowing semi-transparent stroke (`#6C63FF` with standard SVG shadow filter).
    4.  **Connect Interactive Student Selection Chips:** Create interactive chips for student names on the dashboard. When clicked, recalculate coordinates and transition the SVG polygon opacity/stroke using CSS `transition: all 0.4s ease`.

---

## 🌿 Collaborative Git Workflow

To prevent code merge conflicts and work like real professional engineers, Teammate D will establish this workflow:

### 1. The Branching Strategy
*   **`main` Branch:** Always production-ready, clean, stable.
*   **Feature Branches:** Create a branch for every story from the backlog.
    *   *Example:* `feature/canvas-drag-drop` (Teammate A)
    *   *Example:* `feature/socratic-state-machine` (Teammate B)
    *   *Example:* `feature/teacher-radar-svg` (Teammate C)

### 2. Pull Request Flow
1.  **Implement & Test locally:** Ensure no console errors are thrown when clicking through the HTML files.
2.  **Push to GitHub:** Push your feature branch to the remote repo.
3.  **Open a Pull Request (PR):** Target `main`. Fill out the PR description template.
4.  **Code Review:** At least one other teammate must review the code. Teammate D checks accessibility elements and browser compatibility.
5.  **Merge with Confidence:** Once approved, merge the PR into `main`.

---

## 🛡️ Hackathon Judges Wow-Factor Audit

Before shipping, our Git Master (Teammate D) will run these final checks to ensure we score maximum marks:
*   [ ] **Load Time Audit:** Ensure index.html loads in < 2 seconds. Verify all graphics are inline SVGs (no external asset calls).
*   [ ] **Contrast Audit:** Verify text overlays on dark backgrounds have adequate color contrast.
*   [ ] **Keyboard Navigation:** Press `Tab` continuously on `student.html`. Ensure focus moves logically from card selection to text inputs and chatbot bubbles.
*   [ ] **Offline Stability:** Open the inspector, toggle network to *Offline*, and click around. Ensure absolutely no broken states or console errors appear.
