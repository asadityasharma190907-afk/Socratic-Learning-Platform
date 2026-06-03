'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Student {
  name: string;
  initials: string;
  status: 'thriving' | 'needs-attention' | 'stuck';
  xp: number;
  hintsUsed: number;
  gritIndex: number;
  skills: number[]; // Hydrology, Critical, Grit, Collab
}

interface FeedItem {
  id: string;
  tag: string;
  text: string;
  type: 'urgent' | 'warning' | 'positive' | 'info';
  time: string;
}

const initialStudents: Student[] = [
  { name: 'Aarya S.', initials: 'AS', status: 'thriving', xp: 1240, hintsUsed: 2, gritIndex: 85, skills: [92, 84, 98, 70] },
  { name: 'Vaibhav K.', initials: 'VK', status: 'stuck', xp: 950, hintsUsed: 6, gritIndex: 40, skills: [50, 48, 60, 52] },
  { name: 'Riya M.', initials: 'RM', status: 'thriving', xp: 1320, hintsUsed: 1, gritIndex: 90, skills: [88, 90, 92, 85] },
  { name: 'Preet J.', initials: 'PJ', status: 'needs-attention', xp: 1100, hintsUsed: 4, gritIndex: 65, skills: [70, 68, 72, 70] },
  { name: 'Dev P.', initials: 'DP', status: 'thriving', xp: 1180, hintsUsed: 2, gritIndex: 78, skills: [80, 78, 85, 76] },
  { name: 'Neha G.', initials: 'NG', status: 'thriving', xp: 1400, hintsUsed: 0, gritIndex: 95, skills: [95, 92, 98, 90] },
  { name: 'Arjun T.', initials: 'AT', status: 'needs-attention', xp: 870, hintsUsed: 5, gritIndex: 55, skills: [60, 58, 65, 62] },
  { name: 'Kavya R.', initials: 'KR', status: 'thriving', xp: 1210, hintsUsed: 2, gritIndex: 82, skills: [82, 80, 88, 82] },
  { name: 'Sahil M.', initials: 'SM', status: 'stuck', xp: 740, hintsUsed: 7, gritIndex: 35, skills: [42, 40, 50, 45] },
  { name: 'Pooja N.', initials: 'PN', status: 'needs-attention', xp: 980, hintsUsed: 4, gritIndex: 60, skills: [65, 62, 70, 68] },
  { name: 'Rohan B.', initials: 'RB', status: 'thriving', xp: 1250, hintsUsed: 1, gritIndex: 88, skills: [85, 80, 95, 80] },
  { name: 'Meera I.', initials: 'MI', status: 'needs-attention', xp: 1020, hintsUsed: 3, gritIndex: 68, skills: [68, 65, 75, 70] },
  { name: 'Ishaan V.', initials: 'IV', status: 'stuck', xp: 810, hintsUsed: 6, gritIndex: 45, skills: [55, 50, 58, 60] },
  { name: 'Simran K.', initials: 'SK', status: 'thriving', xp: 1380, hintsUsed: 0, gritIndex: 92, skills: [90, 88, 96, 90] },
  { name: 'Kabir D.', initials: 'KD', status: 'thriving', xp: 1150, hintsUsed: 2, gritIndex: 75, skills: [78, 75, 82, 74] },
  { name: 'Tara L.', initials: 'TL', status: 'needs-attention', xp: 950, hintsUsed: 5, gritIndex: 58, skills: [62, 60, 68, 65] },
  { name: 'Omar F.', initials: 'OF', status: 'stuck', xp: 790, hintsUsed: 7, gritIndex: 38, skills: [48, 45, 55, 50] },
  { name: 'Zara H.', initials: 'ZH', status: 'thriving', xp: 1290, hintsUsed: 1, gritIndex: 86, skills: [86, 84, 90, 85] },
  { name: 'Aditya S.', initials: 'AS', status: 'thriving', xp: 1450, hintsUsed: 0, gritIndex: 98, skills: [98, 95, 100, 92] },
  { name: 'Maya P.', initials: 'MP', status: 'needs-attention', xp: 1050, hintsUsed: 3, gritIndex: 70, skills: [72, 70, 78, 75] }
];

const initialFeed: FeedItem[] = [
  { id: '1', tag: 'Intervention Required', text: 'Vaibhav K. has been stuck on First-Flush logic for over 5 minutes with 6 hint requests.', type: 'urgent', time: 'Just now' },
  { id: '2', tag: 'Badge Unlocked', text: 'Riya M. completed the water layout with an exceptionally high cost-efficiency (under ₹9,000)!', type: 'positive', time: '2 mins ago' },
  { id: '3', tag: 'Concept Roadblock', text: '5 students flagged standard Membrane Filter as too expensive but failed to research local Sand/Gravel alternatives.', type: 'warning', time: '5 mins ago' },
  { id: '4', tag: 'Lesson Started', text: 'Grade 7A Socratic Hydrology block initialized. 28 device nodes synchronized.', type: 'info', time: '12 mins ago' }
];

export default function TeacherCockpit() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [filter, setFilter] = useState<'all' | 'stuck' | 'thriving'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync listener: listen to cross-tab updates from student workspace
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'teacherXpUpdate' && e.newValue) {
        try {
          const update = JSON.parse(e.newValue);
          setStudents((prev) => {
            return prev.map((s) => {
              if (s.name.includes(update.name.split(' ')[0])) {
                // If it is Aarya, let's update her stats
                const newSkills = [...s.skills];
                newSkills[0] = Math.min(newSkills[0] + 5, 100);
                newSkills[1] = Math.min(newSkills[1] + 5, 100);
                return {
                  ...s,
                  xp: update.xp,
                  status: update.status === 'thriving' ? 'thriving' : s.status,
                  skills: newSkills
                };
              }
              return s;
            });
          });

          // Add to alert feed
          const newItem: FeedItem = {
            id: 'sync-' + Date.now(),
            tag: 'Telemetry Update',
            text: `${update.name} completed stage successfully and earned ${update.xp} XP!`,
            type: 'positive',
            time: 'Just now'
          };
          setFeed((prev) => [newItem, ...prev]);
          showToast(`Live update received for ${update.name}!`);
        } catch (e) {
          console.error('Failed to parse telemetry update', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Draw Class Avg Radar Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;

    // Calculate class averages
    const averages = [0, 0, 0, 0];
    students.forEach((s) => {
      averages[0] += s.skills[0];
      averages[1] += s.skills[1];
      averages[2] += s.skills[2];
      averages[3] += s.skills[3];
    });
    const N = averages.length;
    const avgData = averages.map((sum) => sum / students.length);
    const step = (Math.PI * 2) / N;

    ctx.clearRect(0, 0, W, H);

    // Rings
    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = step * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * (R * r / 5);
        const y = cy + Math.sin(angle) * (R * r / 5);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = r === 5 ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Data polygon
    ctx.save();
    ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const val = avgData[i] / 100;
      const x = cx + Math.cos(angle) * R * val;
      const y = cy + Math.sin(angle) * R * val;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.fill();
    ctx.strokeStyle = '#ff6b4a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Data points
    const colors = ['#635bff', '#1effa0', '#ffb347', '#ff6b4a'];
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const val = avgData[i] / 100;
      const x = cx + Math.cos(angle) * R * val;
      const y = cy + Math.sin(angle) * R * val;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    // Labels
    const labels = ['Hydrology', 'Critical', 'Grit', 'Collab'];
    ctx.font = '600 9px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const lx = cx + Math.cos(angle) * (R + 18);
      const ly = cy + Math.sin(angle) * (R + 14);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.fillText(labels[i], lx, ly);
    }
  }, [students]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const getStatusMessage = (status: string) => {
    if (status === 'thriving') return 'Designing rainwater harvests with high conceptual accuracy.';
    if (status === 'needs-attention') return 'Experiencing a budget or design bottleneck.';
    return 'Stuck on First-Flush logic. Needs visual modeling support.';
  };

  const filteredStudents = students.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9] font-sans">
      {/* TOP NAV */}
      <nav className="topnav">
        <Link href="/" className="nav-brand" id="nav-home-link">
          <div className="nav-logo">🏫</div>
          <span className="nav-title">SahAI for Shiksha</span>
        </Link>

        <div className="nav-center">
          <div className="session-badge">
            <div className="live-dot"></div>
            LIVE — EVS Science, Grade 7A &nbsp;·&nbsp; 10:30–11:15 AM
          </div>
        </div>

        <div className="nav-right">
          <button
            className="nav-action-btn"
            id="new-challenge-btn"
            onClick={() => showToast('Opening scenario builder...')}
          >
            + New Scenario
          </button>
          <div className="teacher-avatar" id="teacher-avatar" title="Priya Ma'am">PM</div>
        </div>
      </nav>

      {/* COCKPIT COLS */}
      <div className="cockpit-layout">
        {/* STATS BAR */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Active Students</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: 'var(--mint)' }}>
                {students.filter((s) => s.status === 'thriving').length}
              </div>
              <div className="stat-label">Thriving</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: 'var(--amber)' }}>
                {students.filter((s) => s.status === 'needs-attention').length}
              </div>
              <div className="stat-label">Needs Scaffolding</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆘</div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: 'var(--coral)' }}>
                {students.filter((s) => s.status === 'stuck').length}
              </div>
              <div className="stat-label">Stuck / Struggling</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧠</div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: 'var(--indigo-light)' }}>
                {Math.round(students.reduce((acc, s) => acc + s.gritIndex, 0) / students.length)}%
              </div>
              <div className="stat-label">Avg. Class Grit Index</div>
            </div>
          </div>
        </div>

        {/* COLUMN 1: CLASS MAP */}
        <div className="class-map-panel">
          <div className="panel-header">
            <div className="panel-title">Real-time Class Map</div>
            <div className="filter-chips">
              {(['all', 'stuck', 'thriving'] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="student-grid">
            {filteredStudents.map((s, idx) => (
              <div
                key={idx}
                className={`student-card ${s.status}`}
                title={s.name}
                onClick={() => setSelectedStudent(s)}
              >
                <div className="student-card-avatar">
                  {s.initials}
                  <div className="status-dot"></div>
                </div>
                <div className="student-card-name">{s.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: CONCEPT GAP & RADAR */}
        <div className="gap-panel">
          <div className="panel-header">
            <div className="panel-title">Holistic Growth Radar (Class Avg)</div>
          </div>

          <div className="growth-radar-card">
            <div className="radar-container">
              <canvas ref={canvasRef} id="radarCanvas" width="180" height="180"></canvas>
            </div>
          </div>

          <div className="panel-header" style={{ marginTop: '0.5rem' }}>
            <div className="panel-title">Concept Gap Analysis</div>
          </div>

          <div className="concept-list">
            {[
              { name: 'First-Flush Bypass Logic', pct: 62, severity: 'critical' },
              { name: 'Silt Filtration (Sand vs Membrane)', pct: 44, severity: 'moderate' },
              { name: 'Cost/Budget Limitations', pct: 28, severity: 'mild' }
            ].map((concept, idx) => (
              <div key={idx} className={`concept-item ${concept.severity}`}>
                <div className="concept-top">
                  <span className="concept-name">{concept.name}</span>
                  <span className="concept-pct">{concept.pct}% Gap</span>
                </div>
                <div className="concept-bar-track">
                  <div className="concept-bar-fill" style={{ width: `${concept.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-recommend-card">
            <div className="ai-rec-title">🤖 SahAI Diagnostic Recommendation</div>
            <div className="ai-rec-text">
              62% of students are stuck on **First-Flush Diverting**. Recommended 3-minute physical demo using a funnel and muddy water to illustrate first-flush bypass.
            </div>
          </div>
        </div>

        {/* COLUMN 3: HOLISTIC SUPPORT FEED */}
        <div className="feed-panel">
          <div className="panel-header">
            <div className="panel-title">Holistic Support Feed</div>
          </div>

          <div className="feed-list">
            {feed.map((item) => (
              <div key={item.id} className={`feed-card ${item.type}`}>
                <div className="feed-tag">{item.tag}</div>
                <div className="feed-text">{item.text}</div>
                <div className="feed-time">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div
          id="studentModal"
          style={{
            display: 'flex',
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,15,25,0.75)',
            backdropFilter: 'blur(14px)',
            zIndex: 500,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              background: 'var(--slate-800)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    background:
                      selectedStudent.status === 'thriving'
                        ? 'rgba(30, 255, 160, 0.15)'
                        : selectedStudent.status === 'stuck'
                        ? 'rgba(255, 107, 74, 0.15)'
                        : 'rgba(255, 179, 71, 0.15)',
                    color:
                      selectedStudent.status === 'thriving'
                        ? 'var(--mint)'
                        : selectedStudent.status === 'stuck'
                        ? 'var(--coral)'
                        : 'var(--amber)'
                  }}
                >
                  {selectedStudent.initials}
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--white)' }}>
                    {selectedStudent.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, marginTop: '0.15rem', color: 'var(--text-muted)' }}>
                    Status: {selectedStudent.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                &times;
              </button>
            </div>

            {/* XP Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.7rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--slate-700)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--indigo-light)' }}>
                  {selectedStudent.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total XP</div>
              </div>
              <div style={{ background: 'var(--slate-700)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--amber)' }}>
                  {selectedStudent.hintsUsed}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Hints Used</div>
              </div>
              <div style={{ background: 'var(--slate-700)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--mint)' }}>
                  {selectedStudent.gritIndex}%
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Grit Index</div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
              Skill Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[
                { name: 'Hydrology', color: '#635bff', val: selectedStudent.skills[0] },
                { name: 'Critical Think.', color: '#1effa0', val: selectedStudent.skills[1] },
                { name: 'Perseverance', color: '#ffb347', val: selectedStudent.skills[2] },
                { name: 'Collaboration', color: '#ff6b4a', val: selectedStudent.skills[3] }
              ].map((skill, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.name}</span>
                  <div style={{ flex: 1, height: '3px', background: 'var(--slate-600)', borderRadius: '2px', margin: '0 0.5rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.val}%`, background: skill.color }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: skill.color }}>{skill.val}</span>
                </div>
              ))}
            </div>

            {/* Challenge status */}
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Challenge Status
            </div>
            <div style={{ background: 'var(--slate-700)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem', lineHeight: 1.5, color: 'rgba(241,245,249,0.85)' }}>
              {getStatusMessage(selectedStudent.status)}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.1rem' }}>
              <button
                onClick={() => {
                  showToast(`Opening workspace inspection for ${selectedStudent.name}...`);
                  setSelectedStudent(null);
                }}
                style={{
                  flex: 1,
                  background: 'var(--indigo-dim)',
                  border: '1px solid var(--indigo-border)',
                  borderRadius: '10px',
                  color: 'var(--indigo-light)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                Inspect Workspace →
              </button>
              <button
                onClick={() => {
                  showToast('Pairing support nudge sent to student!');
                  setSelectedStudent(null);
                }}
                style={{
                  flex: 1,
                  background: 'rgba(30,255,160,0.08)',
                  border: '1px solid rgba(30,255,160,0.2)',
                  borderRadius: '10px',
                  color: 'var(--mint-dark)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                Send Support →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastVisible && (
        <div
          id="toast"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(0)',
            background: 'var(--slate-800)',
            border: '1px solid var(--indigo-border)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.85rem',
            color: '#fff',
            zIndex: 999,
            transition: 'transform 0.3s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
