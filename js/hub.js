/**
 * SahAI for Shiksha — Challenge Hub Script
 * Separated from HTML per Architecture Separation of Concerns pattern.
 */
(function initChallengeHub() {
  'use strict';

  /**
   * Sets the sahai_active_profile in LocalStorage and navigates to student.html
   * @param {HTMLButtonElement} btn - The clicked select button element
   */
  function selectChallenge(btn) {
    const challengeId      = btn.dataset.challengeId;
    const challengeName    = btn.dataset.challengeName;
    const challengeSubject = btn.dataset.challengeSubject;
    const challengeIcon    = btn.dataset.challengeIcon;

    // AC: 6 — Initialize sahai_active_profile in LocalStorage
    const profile = {
      challengeId:      challengeId,
      challengeName:    challengeName,
      challengeSubject: challengeSubject,
      challengeIcon:    challengeIcon,
      selectedAt:       new Date().toISOString(),
    };

    // Finding 5: Safe LocalStorage checking
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('sahai_active_profile', JSON.stringify(profile));
      }
    } catch (e) {
      // LocalStorage write failed (e.g., private mode quota) — continue navigation
      console.warn('[SahAI] LocalStorage write failed:', e);
    }

    // Subtle page exit transition before navigation
    document.body.classList.add('navigating');

    // AC: 6 — Navigate directly to student.html
    setTimeout(function () {
      window.location.href = 'student.html';
    }, 280);
  }

  // Bind click handlers to all challenge select buttons
  var selectButtons = document.querySelectorAll('.btn-select[data-challenge-id]');
  selectButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Disable button during navigation to prevent double-tap (architecture pattern)
      btn.disabled = true;
      selectChallenge(btn);
    });
  });

  // Finding 4: bfcache restore guard
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      document.body.classList.remove('navigating');
      selectButtons.forEach(function (btn) {
        btn.disabled = false;
      });
    }
  });

})();
