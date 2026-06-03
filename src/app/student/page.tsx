'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db, saveSessionState, addChatLog, queueOutboxAction } from '@/lib/db';
import { SocraticChatEngine, type Bubble } from '@/lib/socraticEngine';

interface PipelineComponent {
  id: string;
  name: string;
  cost: number;
  svgPath: React.ReactNode;
  strokeColor: string;
  fillColor: string;
}

const AVAILABLE_COMPONENTS: PipelineComponent[] = [
  {
    id: 'comp-rooftop',
    name: 'Rooftop Collector',
    cost: 2000,
    strokeColor: '#6366F1',
    fillColor: 'rgba(99,102,241,0.15)',
    svgPath: (
      <>
        <path d="M3 20h18M12 4L4 11h16z" />
        <path d="M6 11v7h12v-7" />
      </>
    )
  },
  {
    id: 'comp-pipes',
    name: 'Conduit Pipes',
    cost: 1000,
    strokeColor: '#10B981',
    fillColor: 'rgba(16,185,129,0.15)',
    svgPath: (
      <>
        <path d="M3 8h10v8H3z" />
        <path d="M13 12h8" />
        <path d="M18 9l3 3-3 3" />
      </>
    )
  },
  {
    id: 'comp-first-flush',
    name: 'First-Flush Diverter',
    cost: 1500,
    strokeColor: '#F43F5E',
    fillColor: 'rgba(244,63,94,0.15)',
    svgPath: (
      <>
        <path d="M12 3v13M12 16l-4-4m4 4l4-4M4 21h16" />
        <circle cx="12" cy="16" r="2" fill="#F43F5E" />
      </>
    )
  },
  {
    id: 'comp-filter-chamber',
    name: 'Sand/Gravel Filter',
    cost: 2500,
    strokeColor: '#ffb347',
    fillColor: 'rgba(255,179,71,0.15)',
    svgPath: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <line x1="4" y1="9" x2="20" y2="9" stroke="rgba(255,255,255,0.2)" />
        <line x1="4" y1="15" x2="20" y2="15" stroke="rgba(255,255,255,0.2)" />
        <circle cx="8" cy="12" r="1.5" fill="#ffb347" />
        <circle cx="12" cy="12" r="1.5" fill="#ffb347" />
        <circle cx="16" cy="12" r="1.5" fill="#ffb347" />
      </>
    )
  },
  {
    id: 'comp-membrane',
    name: 'Membrane Filter',
    cost: 8000,
    strokeColor: '#F43F5E',
    fillColor: 'rgba(244,63,94,0.1)',
    svgPath: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeDasharray="2,2" />
      </>
    )
  },
  {
    id: 'comp-recharge-well',
    name: 'Recharge Well Inlet',
    cost: 3000,
    strokeColor: '#6366F1',
    fillColor: 'rgba(99,102,241,0.15)',
    svgPath: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" stroke="#10B981" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeOpacity="0.6" />
      </>
    )
  }
];

export default function StudentPortal() {
  const router = useRouterState();
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [studentXp, setStudentXp] = useState(1240);
  const [budget, setBudget] = useState(12000);
  const [pipeline, setPipeline] = useState<Array<PipelineComponent | null>>([null, null, null, null]);
  const [conceptStage, setConceptStage] = useState(1);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [typing, setTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [skills, setSkills] = useState([72, 58, 85, 64]);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [hintBtnDisabled, setHintBtnDisabled] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<SocraticChatEngine | null>(null);

  // Initialize and load profile/save state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('sahai_active_profile');
      if (savedProfile) {
        setActiveProfile(JSON.parse(savedProfile));
      } else {
        setActiveProfile({
          challengeId: 'water-filtration',
          challengeName: 'Water Filtration Challenge',
          challengeSubject: 'Science',
          challengeIcon: '💧'
        });
      }

      const savedXp = localStorage.getItem('studentXp');
      if (savedXp) {
        setStudentXp(parseInt(savedXp));
      }

      const savedLayout = localStorage.getItem('sahai_session_rainwater');
      if (savedLayout) {
        try {
          const layoutData = JSON.parse(savedLayout);
          if (typeof layoutData.budget === 'number') setBudget(layoutData.budget);
          if (layoutData.conceptStage) setConceptStage(layoutData.conceptStage);
          if (Array.isArray(layoutData.pipeline)) {
            const restoredPipeline = layoutData.pipeline.map((item: any) => {
              if (!item) return null;
              return AVAILABLE_COMPONENTS.find(c => c.id === item.id) || null;
            });
            setPipeline(restoredPipeline);
          }
        } catch (e) {
          console.error('Failed to restore layout state', e);
        }
      }
    }
  }, []);

  // Sync Socratic Chat Engine callback bindings
  useEffect(() => {
    engineRef.current = new SocraticChatEngine({
      onAddBubble: (bubble) => {
        setBubbles((prev) => {
          // Avoid duplicate welcome or initial status bubbles
          if (bubble.type === 'welcome' && prev.some(b => b.type === 'welcome')) {
            return prev;
          }
          return [...prev, bubble];
        });
        // Save chat log locally in Dexie
        addChatLog('student_1', bubble.textEn, bubble.textHi);
      },
      onSetMascotState: (state) => {
        // Log or trigger minor UI animations depending on mascot state
        console.log('[Mascot State Changed]:', state);
      },
      onUpdateProgress: (stage) => {
        setConceptStage(stage);
      },
      onAwardXP: (amount) => {
        setStudentXp((prev) => {
          const next = prev + amount;
          if (typeof window !== 'undefined') {
            localStorage.setItem('studentXp', next.toString());
            localStorage.setItem('teacherXpUpdate', JSON.stringify({ name: 'Aarya S.', xp: next, status: 'thriving' }));
          }
          return next;
        });
        // Update local Dexie session state
        saveSessionState('student_1', { currentNodeId: `stage_${conceptStage}`, language, synced: isOnline ? 1 : 0 });
      },
      onOpenReflectionModal: () => {
        setReflectionOpen(true);
      },
      onShowTyping: () => setTyping(true),
      onHideTyping: () => setTyping(false),
      onSaveLayout: () => {
        saveCurrentLayout();
      }
    });
  }, [conceptStage, language, isOnline]);

  // Scroll chat area to bottom when new bubbles arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [bubbles, typing]);

  // Draw Radar Chart when skills state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    const N = skills.length;
    const step = (Math.PI * 2) / N;

    ctx.clearRect(0, 0, W, H);

    // Draw rings
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
    ctx.shadowColor = 'rgba(99, 91, 255, 0.5)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const val = skills[i] / 100;
      const x = cx + Math.cos(angle) * R * val;
      const y = cy + Math.sin(angle) * R * val;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(99, 91, 255, 0.12)';
    ctx.fill();
    ctx.strokeStyle = '#635bff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Data points
    const colors = ['#635bff', '#1effa0', '#ffb347', '#ff6b4a'];
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const val = skills[i] / 100;
      const x = cx + Math.cos(angle) * R * val;
      const y = cy + Math.sin(angle) * R * val;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    // Labels
    const labels = ['Hydrology', 'Critical', 'Grit', 'Collab'];
    ctx.font = '600 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      const angle = step * i - Math.PI / 2;
      const lx = cx + Math.cos(angle) * (R + 24);
      const ly = cy + Math.sin(angle) * (R + 20);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.fillText(labels[i], lx, ly);
    }
  }, [skills]);

  const saveCurrentLayout = () => {
    if (typeof window === 'undefined') return;
    const layoutState = {
      pipeline: pipeline.map(item => item ? { id: item.id } : null),
      budget: budget,
      conceptStage: conceptStage
    };
    localStorage.setItem('sahai_session_rainwater', JSON.stringify(layoutState));
  };

  const handleNetworkToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.checked;
    setIsOnline(nextVal);
    
    // Add system notification bubble
    const newBubble: Bubble = {
      id: 'net-' + Date.now(),
      sender: 'system',
      type: 'notification',
      textEn: nextVal ? "Connected back online! Dynamic Socratic AI active." : "Running offline. Pre-loaded local Socratic trees active.",
      textHi: nextVal ? "वापस ऑनलाइन जुड़े! सक्रिय सुकराती एआई एक्टिव है।" : "ऑफ़लाइन मोड सक्रिय। पहले से लोड की गई स्थानीय सुकराती प्रश्न श्रृंखला सक्रिय।"
    };
    setBubbles((prev) => [...prev, newBubble]);
  };

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('componentId', componentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.currentTarget.classList.add('highlight');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('highlight');
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('highlight');

    const componentId = e.dataTransfer.getData('componentId');
    const comp = AVAILABLE_COMPONENTS.find(c => c.id === componentId);
    if (!comp) return;

    // Check if component already placed
    if (pipeline.some(item => item && item.id === componentId)) {
      showToast('This component is already placed in the pipeline!');
      return;
    }

    // Budget check
    if (budget - comp.cost < 0) {
      showToast('Not enough budget left for this component!');
      return;
    }

    // Place component
    const newPipeline = [...pipeline];
    const prevItem = newPipeline[slotIndex];
    let budgetDelta = comp.cost;
    if (prevItem) {
      budgetDelta -= prevItem.cost;
    }

    newPipeline[slotIndex] = comp;
    setPipeline(newPipeline);
    setBudget((prev) => prev - budgetDelta);

    // Save layouts
    setTimeout(() => saveCurrentLayout(), 50);
  };

  const removeNode = (slotIndex: number) => {
    const item = pipeline[slotIndex];
    if (!item) return;

    const newPipeline = [...pipeline];
    newPipeline[slotIndex] = null;
    setPipeline(newPipeline);
    setBudget((prev) => prev + item.cost);

    setTimeout(() => saveCurrentLayout(), 50);
  };

  const clearCanvas = () => {
    setPipeline([null, null, null, null]);
    setBudget(12000);
    showToast('Workspace reset complete.');
    setTimeout(() => saveCurrentLayout(), 50);
  };

  const validateDesign = () => {
    if (engineRef.current) {
      engineRef.current.evaluateDesign(pipeline);
    }
  };

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendStudentMessage();
    }
  };

  const [inputVal, setInputVal] = useState('');

  const sendStudentMessage = () => {
    const text = inputVal.trim();
    if (!text) return;

    setInputVal('');
    if (engineRef.current) {
      engineRef.current.handleStudentMessage(text);
    }
  };

  const requestHint = () => {
    if (engineRef.current) {
      engineRef.current.requestHint();
    }
  };

  const submitReflection = () => {
    if (reflectionText.trim().length >= 10) {
      if (engineRef.current) {
        engineRef.current.submitReflection(reflectionText);
      }
      setReflectionOpen(false);
      setReflectionText('');
      // Save offline outbox action in Dexie
      queueOutboxAction('student_1', 'SELF_REFLECTION', { text: reflectionText, timestamp: Date.now() });
    }
  };

  // Safe fallback routing
  function useRouterState() {
    if (typeof window !== 'undefined') {
      return {
        push: (url: string) => window.location.href = url
      };
    }
    return { push: () => {} };
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9]">
      {/* TOP NAV */}
      <nav className="topnav">
        <Link href="/" className="nav-brand" id="nav-home-link">
          <div className="nav-logo">⚡</div>
          <span className="nav-title">SahAI for Shiksha</span>
        </Link>

        <div className="nav-right">
          {/* Simulated Online/Offline Toggle */}
          <div className="toggle-container">
            <span className="toggle-label">Network:</span>
            <label className="switch">
              <input
                type="checkbox"
                id="networkToggle"
                checked={isOnline}
                onChange={handleNetworkToggle}
              />
              <span className="slider"></span>
            </label>
            <span id="networkBadge" className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 Online' : '🟡 Offline Mode'}
            </span>
          </div>

          <div className="xp-badge">
            <span className="xp-icon">⚡</span> <span id="studentXp">{studentXp.toLocaleString()}</span> XP
          </div>
          <div className="level-badge">🌱 Level 4 — Thinker</div>
          <div className="student-avatar" id="student-avatar-btn" title="Aarya Singh">AS</div>
        </div>
      </nav>

      {/* APP LAYOUT */}
      <div className="app-layout">
        
        {/* LEFT VIEWPORT: WORKSPACE & PIPELINE */}
        <div className="left-viewport">
          <div className="canvas-panel-container">
            <div className="canvas-panel">
              <div className="canvas-header">
                <div className="challenge-tag">
                  {activeProfile?.challengeIcon || '💧'} {activeProfile?.challengeName || 'Water Filtration'}
                </div>
                <div className="budget-indicator">
                  Budget: <span style={{ color: budget < 3000 ? 'var(--coral)' : 'var(--mint)' }}>
                    ₹{budget.toLocaleString()}
                  </span> / ₹12,000
                </div>
              </div>

              {/* Socratic Progress Bar */}
              <div className="socratic-progress-container" style={{ marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Socratic Progress</span>
                  <span id="socraticProgressText">Concept {conceptStage} of 3</span>
                </div>
                <div className="socratic-progress-track" style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div
                    id="socraticProgressFill"
                    style={{
                      height: '100%',
                      width: `${(conceptStage / 3) * 100}%`,
                      background: '#6366f1',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>

              <div className="village-context">
                <strong>Village Context:</strong> Low annual rainfall. Silt-heavy runoff. Recharge well needs clean groundwater feeding. High cost membranes are too expensive.
              </div>

              <div className="workspace-area">
                {/* Available Parts repository */}
                <div className="components-bin">
                  <div className="bin-title">Available Parts</div>
                  {AVAILABLE_COMPONENTS.map((comp) => (
                    <div
                      key={comp.id}
                      className={`drag-node ${comp.id === 'comp-membrane' ? 'expensive' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp.id)}
                      id={comp.id}
                    >
                      <svg
                        className="node-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={comp.strokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {comp.svgPath}
                      </svg>
                      <span>{comp.name.substring(0, 14)}.</span>
                    </div>
                  ))}
                </div>

                {/* Target Pipeline Slots */}
                <div className="system-pipeline">
                  {[0, 1, 2, 3].map((idx) => {
                    const stepLabels = ['Step 1: Intake', 'Step 2: Divert', 'Step 3: Filter', 'Step 4: Recharge'];
                    const item = pipeline[idx];
                    return (
                      <div
                        key={idx}
                        className={`pipeline-slot snap-zone ${item ? 'filled' : ''}`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, idx)}
                      >
                        {item ? (
                          <div className="placed-item scale-bounce">
                            <div className="placed-icon-container">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={item.strokeColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ width: '32px', height: '32px' }}
                              >
                                {item.svgPath}
                              </svg>
                            </div>
                            <span className="placed-item-text">{item.name}</span>
                            <button className="remove-node-btn" onClick={() => removeNode(idx)}>✕</button>
                          </div>
                        ) : (
                          <span className="slot-label">{stepLabels[idx]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="canvas-actions">
                <button
                  className="hint-btn"
                  onClick={clearCanvas}
                  style={{ marginTop: 0, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  Reset Setup
                </button>
                <button className="test-idea-btn" onClick={validateDesign}>
                  Test My Design →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE CHAT COLUMN */}
        <div className="chat-panel" id="chatPanel">
          <div className="chat-panel-header" id="chatPanelHeader">
            <div className="chat-panel-title">🏮 Sparky — AI Mentor</div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 400 }}>Ask me anything!</span>
          </div>

          <div className="chat-panel-body">
            <div className="chat-area" id="chatArea" ref={chatAreaRef}>
              {bubbles.map((bubble) => {
                if (bubble.sender === 'system') {
                  return (
                    <div
                      key={bubble.id}
                      className={`feedback-banner ${bubble.type === 'warn' ? 'warn' : ''}`}
                    >
                      <span>
                        <strong>{language === 'hi' ? bubble.textHi : bubble.textEn}</strong>
                      </span>
                    </div>
                  );
                }

                if (bubble.sender === 'student') {
                  return (
                    <div key={bubble.id} className="msg-student">
                      <div className="student-bubble">{bubble.textEn}</div>
                    </div>
                  );
                }

                // AI Bubbles (with optional bilingual inline translation toggle)
                const isHint = bubble.type === 'hint';
                const isDecompose = bubble.type === 'decompose';
                return (
                  <div key={bubble.id} className="msg-ai">
                    <div className={`ai-avatar ${isHint ? 'hint' : isDecompose ? 'thinking' : ''}`}>🏮</div>
                    <div className={`ai-bubble ${isHint ? 'hint' : isDecompose ? 'decompose' : ''}`} style={{ position: 'relative' }}>
                      <div className="ai-label">
                        {isHint ? '💡 Sparky\'s Hint' : isDecompose ? '🧩 Socratic Step' : '🏮 Sparky'}
                      </div>
                      
                      {/* Lang Switcher Button */}
                      <button
                        className="translate-toggle-btn"
                        onClick={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
                      >
                        <span className={`lang-label en ${language === 'en' ? 'active' : ''}`}>EN</span>
                        <span className="lang-divider">|</span>
                        <span className={`lang-label hi ${language === 'hi' ? 'active' : ''}`}>हि</span>
                      </button>

                      <div
                        className="ai-text-content"
                        dangerouslySetInnerHTML={{ __html: language === 'hi' ? bubble.textHi : bubble.textEn }}
                      />

                      {bubble.chips && (
                        <div className="scaffold-chips">
                          {bubble.chips.map((chip, cIdx) => (
                            <div
                              key={cIdx}
                              className="scaffold-chip"
                              onClick={() => setInputVal(chip)}
                            >
                              {chip}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="typing-indicator" id="typingIndicator">
                  <div className="ai-avatar">🏮</div>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="input-area">
              <div className="input-row">
                <textarea
                  id="studentInput"
                  className="chat-input"
                  placeholder="Ask Sparky anything — about components, or water science..."
                  rows={1}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                ></textarea>
                <button className="send-btn" id="sendBtn" onClick={sendStudentMessage}>
                  ➤
                </button>
              </div>
              <button
                className="hint-btn"
                id="hintBtn"
                disabled={hintBtnDisabled}
                onClick={requestHint}
              >
                💡 Ask Sparky for a Hint
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SKILLS COLUMN */}
        <div className="skills-panel">
          <div className="panel-section">
            <div className="panel-section-title">Skill Growth Radar</div>
            <div className="radar-container">
              <canvas ref={canvasRef} id="radarCanvas" width="250" height="250"></canvas>
            </div>
            <div className="skill-legend">
              {[
                { name: 'Hydrology', color: '#635bff', val: skills[0] },
                { name: 'Critical Think.', color: '#1effa0', val: skills[1] },
                { name: 'Perseverance', color: '#ffb347', val: skills[2] },
                { name: 'Collaboration', color: '#ff6b4a', val: skills[3] }
              ].map((skill, sIdx) => (
                <div key={sIdx} className="skill-item">
                  <span className="skill-name">
                    <span className="skill-dot" style={{ background: skill.color }}></span>
                    {skill.name}
                  </span>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill" style={{ width: `${skill.val}%`, background: skill.color }}></div>
                  </div>
                  <span className="skill-value" style={{ color: skill.color }}>
                    {skill.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* XP & Level Status */}
          <div className="panel-section">
            <div className="panel-section-title">Level Progress</div>
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${((studentXp - 1000) / 1000) * 100}%` }}
              ></div>
            </div>
            <div className="xp-row">
              <span>Level 4 Thinker</span>
              <span>{studentXp.toLocaleString()} XP / 2,000 XP</span>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="panel-section">
            <div className="panel-section-title">Badges Earned</div>
            <div className="badges-grid">
              <div className="badge-item" id="badge-hydrologist">
                <div className="badge-icon">💧</div>
                <div className="badge-name">Hydro Pro</div>
              </div>
              <div className="badge-item locked" id="badge-resilience">
                <div className="badge-icon">💪</div>
                <div className="badge-name">Resilience</div>
              </div>
              <div className="badge-item locked" id="badge-budget">
                <div className="badge-icon">🪙</div>
                <div className="badge-name">Frugal Guru</div>
              </div>
            </div>
          </div>

          {/* EVS Milestones */}
          <div className="panel-section">
            <div className="panel-section-title">Learning Steps</div>
            <div className="steps-list">
              <div className="step-item done">
                <div className="step-indicator">✓</div>
                <span>Step 1: Inspect classroom rainfall models</span>
              </div>
              <div className={`step-item ${conceptStage >= 2 ? 'done' : 'active'}`}>
                <div className="step-indicator">{conceptStage >= 2 ? '✓' : '2'}</div>
                <span>Step 2: Balance cost vs filter efficiency</span>
              </div>
              <div className={`step-item ${conceptStage >= 3 ? 'done' : conceptStage === 2 ? 'active' : ''}`}>
                <div className="step-indicator">{conceptStage >= 3 ? '✓' : '3'}</div>
                <span>Step 3: Harvest rainwater for drinking well</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Self-Reflection Modal */}
      {reflectionOpen && (
        <div
          id="modal-self-reflect"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            opacity: 1
          }}
        >
          <div style={{ background: 'var(--slate-800)', border: '1px solid var(--indigo-border)', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
              <span>🧠</span> Time to Reflect
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              You&apos;ve requested several hints! To unlock more hints, take a moment to reflect on what you&apos;ve tried so far. (Min 10 characters)
            </p>
            <textarea
              id="reflection-input"
              placeholder="I noticed that when I placed..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              style={{
                background: 'rgba(11, 15, 25, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                resize: 'none',
                minHeight: '80px',
                outline: 'none'
              }}
            ></textarea>
            <button
              id="btn-unlock-hints"
              disabled={reflectionText.length < 10}
              style={{
                background: 'linear-gradient(135deg, var(--indigo), var(--indigo-light))',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: reflectionText.length < 10 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onClick={submitReflection}
            >
              Unlock Hints
            </button>
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
