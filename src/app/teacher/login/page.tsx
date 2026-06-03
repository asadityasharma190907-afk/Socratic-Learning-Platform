'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherLogin() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setNavigating(true);
    setTimeout(() => {
      router.push(`/teacher`);
    }, 400);
  };

  return (
    <div className={`hub-bg-wrapper ${navigating ? 'navigating-fade' : ''}`}>
      <div className="orb orb-indigo" aria-hidden="true"></div>

      <main className="login-container" role="main">
        <Link href="/" className="back-link">← Back to Roles</Link>
        
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">🧑‍🏫</span>
            <h2>Teacher Portal</h2>
            <p>Enter your credentials to continue</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="schoolId">School ID or Email</label>
              <input 
                type="text" 
                id="schoolId" 
                className="form-input" 
                placeholder="e.g. priya.maam@school.edu" 
                defaultValue="priya.sharma" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Passcode</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                placeholder="••••••••" 
                defaultValue="mockpassword" 
                required 
              />
            </div>
            
            <button type="submit" className="btn-select btn-teacher" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
              Secure Login <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-footer">
            <p className="login-demo-note">Demo Mode: Any credentials will work.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
