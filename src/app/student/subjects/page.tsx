'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  icon: string;
  accent: string;
  desc: string;
}

const subjects: Subject[] = [
  { id: 'science', name: 'Science', icon: '🔬', accent: 'mint', desc: 'EVS, Biology, Chemistry & Physics' },
  { id: 'math', name: 'Mathematics', icon: '📐', accent: 'indigo', desc: 'Algebra, Geometry & Applied Math' },
  { id: 'history', name: 'History', icon: '🏛️', accent: 'amber', desc: 'World History, Civics & Geography' },
  { id: 'english', name: 'English', icon: '📚', accent: 'coral', desc: 'Literature, Grammar & Composition' },
];

export default function StudentSubjectSelection() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (subjectId: string) => {
    setSelected(subjectId);
    setNavigating(true);
    
    setTimeout(() => {
      router.push(`/student/challenges?subject=${subjectId}`);
    }, 400);
  };

  return (
    <div className={`hub-bg-wrapper ${navigating ? 'navigating-fade' : ''}`}>
      <div className="orb orb-mint" aria-hidden="true" style={{ opacity: 0.5 }}></div>

      <main className="hub-container" role="main">
        <Link href="/student/login" className="back-link">← Switch User</Link>
        
        <header className="hub-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1>Select a <span className="accent-mint">Subject</span></h1>
          <p className="subtitle" style={{ margin: '0.5rem auto 0' }}>
            Choose the curriculum domain to proceed.
          </p>
        </header>

        <section className="subject-grid">
          {subjects.map(s => (
            <div 
              key={s.id} 
              className={`subject-card ${selected === s.id ? 'selected' : ''}`}
              onClick={() => handleSelect(s.id)}
            >
              <div className="subject-icon">{s.icon}</div>
              <h3 className="subject-name">{s.name}</h3>
              <p className="subject-desc">{s.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
