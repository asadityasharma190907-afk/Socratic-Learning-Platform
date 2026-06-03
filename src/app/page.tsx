'use client';

import React from 'react';
import Link from 'next/link';

export default function RoleSelection() {
  return (
    <div className="hub-bg-wrapper">
      <div className="orb orb-indigo" aria-hidden="true"></div>
      <div className="orb orb-mint" aria-hidden="true"></div>

      <main className="hub-container" style={{ maxWidth: '1000px' }} role="main">
        {/* Platform identity badge */}
        <div className="platform-badge" style={{ alignSelf: 'center' }} role="status" aria-label="Platform active">
          <span className="status-dot" aria-hidden="true"></span>
          SahAI for Shiksha &nbsp;·&nbsp; Cyber-Pedagogy Platform
        </div>

        {/* Page heading */}
        <header className="hub-header" style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: '1.1' }}>
            Welcome to <span className="accent-indigo">SahAI</span><br />
            Select Your <span className="accent-mint">Role</span>
          </h1>
          <p className="subtitle" style={{ margin: '1.5rem auto 0', maxWidth: '600px' }}>
            Choose how you want to experience the platform. Students learn through Socratic challenges, while Teachers monitor real-time class telemetry.
          </p>
        </header>

        {/* Role Cards Grid */}
        <section className="role-grid">
          {/* Student Card */}
          <Link href="/student/login" className="role-card role-student">
            <div className="role-card-inner">
              <div className="role-icon-wrap">
                <span className="role-icon">🎓</span>
              </div>
              <h2 className="role-title">I am a Student</h2>
              <p className="role-description">
                Dive into interactive challenges. Build your critical thinking and grit through Socratic questioning.
              </p>
              <div className="role-btn-mock">
                Enter Portal <span className="btn-arrow" aria-hidden="true">→</span>
              </div>
            </div>
          </Link>

          {/* Teacher Card */}
          <Link href="/teacher/login" className="role-card role-teacher">
            <div className="role-card-inner">
              <div className="role-icon-wrap">
                <span className="role-icon">🧑‍🏫</span>
              </div>
              <h2 className="role-title">I am a Teacher</h2>
              <p className="role-description">
                Access the Teacher Cockpit. Monitor real-time student progress, detect conceptual gaps, and intervene.
              </p>
              <div className="role-btn-mock">
                Enter Cockpit <span className="btn-arrow" aria-hidden="true">→</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Footer */}
        <footer className="hub-footer" style={{ marginTop: '4rem', justifyContent: 'center' }}>
          <p className="powered-by">Powered by Socratic AI &nbsp;·&nbsp; Socratic Learning Platform</p>
        </footer>
      </main>
    </div>
  );
}
