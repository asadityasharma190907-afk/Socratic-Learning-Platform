# ⚡ SahAI for Shiksha — Socratic Learning & Holistic Analytics

> **Empowering classrooms with AI-guided Socratic pedagogy, offline-first engineering, and developmental tracking that measures what truly matters: Grit, Curiosity, and Social Empathy.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pedagogy: Socratic](https://img.shields.io/badge/Pedagogy-Socratic-indigo.svg)](#pedagogy)
[![Tech Stack: Next.js 14](https://img.shields.io/badge/Tech_Stack-Next.js%2014-black.svg)](#architecture)
[![Architecture: PWA Offline-First](https://img.shields.io/badge/Architecture-PWA_Offline--First-teal.svg)](#architecture)
[![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA-coral.svg)](#accessibility)

---

## 🌟 The Vision

Traditional assessment models reduce a child's intelligence to a single, stressful score. **SahAI for Shiksha** replaces passive learning and blunt rote-testing with **active Socratic mentoring** and **holistic developmental dashboards**. 

Designed for low-connectivity, hardware-constrained educational environments, SahAI provides:
1. **A Socratic AI Mentor:** Guides students through design challenges. Instead of saying *"Wrong Answer"*, it decomposes complex problems into intuitive Socratic sub-questions.
2. **A Holistic Growth Tracker:** Visualizes multi-dimensional student growth (Grit, Curiosity, Critical Thinking, Collaboration, Academic Mastery) on an interactive radar chart.
3. **An Ultra-Simple Teacher Cockpit:** Surfaces student struggle in real-time, offering instant, empathy-driven remediation activities.
4. **Offline-First Cyber-Pedagogy:** High-fidelity layouts built completely with Next.js App Router, TypeScript, and IndexedDB (via Dexie) to run smoothly on zero internet connectivity as a Progressive Web App (PWA).

---

## 🗺️ Architectural Workflow

The following diagram illustrates how the student Socratic engine, local offline storage, and teacher dashboards interact in real-time.

```mermaid
graph TD
    subgraph Next.js App Router
        subgraph Student_Portal["Student Portal (/student)"]
            CanvasState[Challenge Draggable Canvas] -->|Validate Design| SocraticEngine{Socratic AI Engine}
            SocraticEngine -->|On-Track| StepUp[Advance Step & Award XP]
            SocraticEngine -->|Common Error| Decompose[Decompose to Sub-Question]
            SocraticEngine -->|Exceeds 8 Hints| Reflection[Self-Reflection Modal Lock]
        end
        
        subgraph Teacher_Cockpit["Teacher Cockpit (/teacher)"]
            MasteryGrid[Classroom Mastery Grid]
            HolisticFeed[Real-time Support Feed]
            RadarChart[Holistic SVG Radar Chart]
        end
    end
    
    subgraph Local Storage & Sync
        DexieDB[(IndexedDB via Dexie.js)] <-->|Read/Write State| CanvasState
        DexieDB -.->|Classroom Data Feed| MasteryGrid
        DexieDB -.->|Behavioral Metrics| HolisticFeed
        DexieDB -.->|Growth Scoring| RadarChart
        ServiceWorker[[PWA Service Worker]] -->|Caches Assets| Next.js App Router
    end
```

---

## 🛠️ The Portals (Visual Tour)

### 🧑‍🎓 Student Portal (`/student`)
The student portal acts as an immersive design lab where learners solve real-world challenges, such as **Rainwater Harvesting Design**.
*   **Interactive Design Canvas:** Draggable system components (Rooftop, Filter, Recharge Well) that snap to drop-zones with active micro-animations.
*   **Socratic Chatbot:** A slide-in chat interface driven by Socratic dialogue trees, supporting keyboard navigation (`Tab` index) and ARIA accessibility live announcements.
*   **Personal Growth Radar:** An inline canvas-drawn radar chart demonstrating the student's current developmental attributes in real-time.

### 🧑‍🏫 Teacher Cockpit (`/teacher`)
A premium dashboard designed to fit effortlessly into a teacher's classroom routine, ensuring no administrative overload.
*   **Real-time Class Map:** A color-coded grid highlighting which students are *Thriving* (green), *Need Attention* (amber), or are *Stuck* (red).
*   **Concept Gap Analysis:** Aggregated insights indicating which specific syllabus sections are lagging behind class-wide, with a one-click **"⚡ Generate Group Activity"** tool.
*   **Holistic Support Feed:** Real-time social-emotional alerts prioritizing Vaibhav's or Sahil's emotional well-being over raw marks.

---

## 🚀 How to Run the Project

SahAI for Shiksha is engineered with **Next.js 14** and **TypeScript** for robust development and a fast, static offline-ready production build.

1. Clone this repository:
   ```bash
   git clone https://github.com/asadityasharma190907-afk/Socratic-Learning-Platform.git
   cd Socratic-Learning-Platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your modern web browser.
5. Select the **Student Portal** or **Teacher Cockpit** to explore the high-fidelity features.

---

## 📅 Roadmap & Execution Plan

We run our development cycle through rigorous **BMAD specifications** to ensure architectural consistency and delivery stability.

```
├── Phase 1: Clickable High-Fidelity Prototype (Completed) ───────────── [Delivered]
│   ├── [✓] Project Shell & Typography Foundations 
│   ├── [✓] Dynamic Student Socratic Dashboard & Canvas Layout 
│   ├── [✓] Interactive SVG-drawn Radar Charting System 
│   └── [✓] Real-time Teacher Analytics Dashboard Mock Data 
│
└── Phase 2: Live Adaptive MVP Upgrades ──────────────────────────────── [Completed]
    ├── [✓] Migrate to Next.js App Router and TypeScript
    ├── [✓] Service Worker offline registration (PWA caching)
    ├── [✓] IndexedDB session stores using Dexie.js for state persistence
    └── [ ] Live Gemini API Prompt Orchestration & Empathy Guardrails (Upcoming)
```

---

## 🧬 Engineering Principles & Accessibility

*   **Offline-First Resilience (NFR1):** Designed to work flawlessly in rural schools without continuous Wi-Fi. All core assets are cached by a Service Worker, and state is persisted in IndexedDB.
*   **Modern Framework Architecture:** Uses Next.js 14 App Router, React 18, and TypeScript for absolute stability and performance.
*   **WCAG AA Compliance (NFR2):** HSL-based dark mode tokens ensure optimal contrast ratios to reduce eye strain.
*   **Semantic HTML & ARIA (NFR3):** Navigable via keyboards (`tabindex`) with correct `aria-live="polite"` descriptors for screen readers during Socratic chat flows.
*   **Hardware Accelerated CSS (NFR5):** Micro-animations (glowing snap guides, level progressions, slide-ins) utilize `transform` and `opacity` to run at a consistent **60 FPS** on ultra-low-spec school laptops.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
