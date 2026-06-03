'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Challenge {
  id: string;
  name: string;
  subjectId: string;
  subject: string;
  icon: string;
  description: string;
  difficulty: string;
  steps: string;
  accent: string;
}

const allChallenges: Challenge[] = [
  {
    id: 'water-filtration',
    name: 'Water Filtration Challenge',
    subjectId: 'science',
    subject: 'Science',
    icon: '💧',
    description: 'Design a community-scale filtration system using available local materials. Analyze flow rates, contamination factors, and scalability trade-offs.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'water',
  },
  {
    id: 'soil-analysis',
    name: 'Soil Analysis Challenge',
    subjectId: 'science',
    subject: 'Science',
    icon: '🌱',
    description: 'Investigate soil composition from your region to determine optimal crop types. Apply chemical testing data to sustainable farming recommendations.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'soil',
  },
  {
    id: 'ecosystem-web',
    name: 'Ecosystem Food Web',
    subjectId: 'science',
    subject: 'Science',
    icon: '🦋',
    description: 'Map a local ecosystem food web and analyze the impact of removing a keystone species on biodiversity.',
    difficulty: 'Beginner',
    steps: '3 Socratic Steps',
    accent: 'water',
  },
  {
    id: 'budget-planning',
    name: 'Village Budget Planning',
    subjectId: 'math',
    subject: 'Mathematics',
    icon: '📊',
    description: 'Optimize a village budget to allocate funds for school repairs, water infrastructure, and healthcare with limited resources.',
    difficulty: 'Advanced',
    steps: '5 Socratic Steps',
    accent: 'math',
  },
  {
    id: 'geometry-bridge',
    name: 'Bridge Design with Geometry',
    subjectId: 'math',
    subject: 'Mathematics',
    icon: '📐',
    description: 'Use geometric principles to design a structurally sound pedestrian bridge that can handle load distribution.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'math',
  },
  {
    id: 'ancient-trade',
    name: 'Ancient Trade Routes',
    subjectId: 'history',
    subject: 'History',
    icon: '🗺️',
    description: 'Analyze how the Silk Road influenced the economic growth of ancient empires and shaped modern cultural exchanges.',
    difficulty: 'Beginner',
    steps: '3 Socratic Steps',
    accent: 'history',
  },
  {
    id: 'independence-movement',
    name: 'Independence Movement Analysis',
    subjectId: 'history',
    subject: 'History',
    icon: '🏛️',
    description: 'Examine the key events, leaders, and turning points of India\'s independence movement and its global impact.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'history',
  },
  {
    id: 'persuasive-essay',
    name: 'Persuasive Writing',
    subjectId: 'english',
    subject: 'English',
    icon: '✍️',
    description: 'Draft a compelling persuasive essay to the local council advocating for a new community library with evidence-based arguments.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'english',
  },
  {
    id: 'short-story',
    name: 'Short Story Craft',
    subjectId: 'english',
    subject: 'English',
    icon: '📖',
    description: 'Craft a short story using narrative techniques like foreshadowing, dialogue, and descriptive imagery to engage readers.',
    difficulty: 'Beginner',
    steps: '3 Socratic Steps',
    accent: 'english',
  }
];

function ChallengeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get('subject');
  
  const [navigating, setNavigating] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({});

  const displayedChallenges = subjectFilter 
    ? allChallenges.filter(c => c.subjectId === subjectFilter)
    : allChallenges;

  const handleSelectChallenge = (challenge: Challenge) => {
    setDisabledButtons((prev) => ({ ...prev, [challenge.id]: true }));

    const profile = {
      challengeId: challenge.id,
      challengeName: challenge.name,
      challengeSubject: challenge.subject,
      challengeIcon: challenge.icon,
      selectedAt: new Date().toISOString(),
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sahai_active_profile', JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('[SahAI] LocalStorage write failed:', e);
    }

    setNavigating(true);
    setTimeout(() => {
      // In MVP, all challenges go to the same student workspace for demo purposes
      router.push('/student');
    }, 280);
  };

  return (
    <div className={`hub-bg-wrapper ${navigating ? 'navigating-fade' : ''}`}>
      <div className="orb orb-indigo" aria-hidden="true"></div>
      <div className="orb orb-mint" aria-hidden="true"></div>

      <main className="hub-container" role="main">
        <div className="platform-badge" role="status" aria-label="Platform active">
          <span className="status-dot" aria-hidden="true"></span>
          SahAI for Shiksha &nbsp;·&nbsp; Cyber-Pedagogy Platform
        </div>

        <header className="hub-header">
          <h1>
            Select Your&nbsp;<span className="accent-indigo">Challenge</span><br />
            &amp;&nbsp;Start&nbsp;<span className="accent-mint">Thinking</span>
          </h1>
          <p className="subtitle">
            Choose an active challenge below. The AI mentor will guide you through
            real-world problem-solving with Socratic questions — no rote answers here.
          </p>
        </header>

        <span className="section-label" aria-label="Section: Active Challenges">
          {subjectFilter ? `${subjectFilter.charAt(0).toUpperCase() + subjectFilter.slice(1)} Challenges` : 'All Active Challenges'}
        </span>

        <section className="challenge-grid" aria-label="Challenge selection cards">
          {displayedChallenges.length > 0 ? displayedChallenges.map((challenge) => (
            <article
              key={challenge.id}
              className={`challenge-card ${challenge.accent}`}
              aria-labelledby={`challenge-${challenge.id}-title`}
              onClick={() => !disabledButtons[challenge.id] && handleSelectChallenge(challenge)}
            >
              <div className="card-icon-wrap" aria-hidden="true">{challenge.icon}</div>
              <span className="card-subject-tag">{challenge.subject}</span>

              <h2 className="card-title" id={`challenge-${challenge.id}-title`}>
                {challenge.name}
              </h2>
              <p className="card-description">
                {challenge.description}
              </p>

              <div className="card-meta" aria-label="Challenge details">
                <div className="card-meta-item">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1l1.8 4H14l-3.4 2.5 1.3 4L8 9l-3.9 2.5 1.3-4L2 5h4.2z" fill="currentColor"/>
                  </svg>
                  {challenge.difficulty}
                </div>
                <div className="card-meta-item">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M5 8h6M5 5.5h4M5 10.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {challenge.steps}
                </div>
              </div>

              <button
                className="btn-select"
                disabled={disabledButtons[challenge.id]}
                aria-label={`Select ${challenge.name} and enter Student Portal`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChallenge(challenge);
                }}
              >
                Begin Challenge
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>
            </article>
          )) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0' }}>
              No active challenges found for this subject.
            </div>
          )}
        </section>

        <footer className="hub-footer">
          <Link href="/student/subjects" className="back-link">
            ← Back to Subjects
          </Link>
          <p className="powered-by">Powered by Socratic AI &nbsp;·&nbsp; Socratic Learning Platform</p>
        </footer>
      </main>
    </div>
  );
}

export default function ChallengeHub() {
  return (
    <Suspense fallback={<div className="hub-bg-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading challenges...</div>}>
      <ChallengeContent />
    </Suspense>
  );
}
