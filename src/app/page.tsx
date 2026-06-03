'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Challenge {
  id: string;
  name: string;
  subject: string;
  icon: string;
  description: string;
  difficulty: string;
  steps: string;
  accent: 'water' | 'soil';
}

const activeChallenges: Challenge[] = [
  {
    id: 'water-filtration',
    name: 'Water Filtration Challenge',
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
    subject: 'Science',
    icon: '🌱',
    description: 'Investigate soil composition from your region to determine optimal crop types. Apply chemical testing data to sustainable farming recommendations.',
    difficulty: 'Intermediate',
    steps: '4 Socratic Steps',
    accent: 'soil',
  },
];

export default function ChallengeHub() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({});

  const handleSelectChallenge = (challenge: Challenge) => {
    // Disable button to prevent double-tap
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
      router.push('/student');
    }, 280);
  };

  return (
    <div className={`hub-bg-wrapper ${navigating ? 'navigating-fade' : ''}`}>
      {/* Ambient decorative orbs (CSS only, no canvas) */}
      <div className="orb orb-indigo" aria-hidden="true"></div>
      <div className="orb orb-mint" aria-hidden="true"></div>

      <main className="hub-container" role="main">
        {/* Platform identity badge */}
        <div className="platform-badge" role="status" aria-label="Platform active">
          <span className="status-dot" aria-hidden="true"></span>
          SahAI for Shiksha &nbsp;·&nbsp; Cyber-Pedagogy Platform
        </div>

        {/* Page heading */}
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

        {/* Section label */}
        <span className="section-label" aria-label="Section: Active Challenges">Active Challenges</span>

        {/* Challenge cards grid */}
        <section className="challenge-grid" aria-label="Challenge selection cards">
          {activeChallenges.map((challenge) => (
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
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M5 8h6M5 5.5h4M5 10.5h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
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
          ))}
        </section>

        {/* Footer */}
        <footer className="hub-footer">
          <Link href="/teacher" className="teacher-link" id="teacher-cockpit-link">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 5v3l2 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            Teacher Cockpit →
          </Link>
          <p className="powered-by">Powered by Socratic AI &nbsp;·&nbsp; Hackathon MVP 2026</p>
        </footer>
      </main>
    </div>
  );
}
