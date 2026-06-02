/**
 * SahAI Socratic Learning Platform — Socratic Chat Engine
 * Cyber-Pedagogy Conversational Scaffolding
 * File: js/chat.js
 */

class SocraticChatEngine {
  constructor() {
    this.challenges = null;
    this.activeChallenge = 'water-filtration';
    
    // Default fallback analogies if network fetch fails (offline protection)
    this.fallbackData = {
      "direct_connection_dust": {
        "initial_question": {
          "text": "A lovely start, beta! The rooftop collects the rain, and it flows straight to the well. But think about the very first heavy rain of the monsoon. It washes off all the dry summer dust and leaves from the roof. If the water flows straight down, where will all that dust go?",
          "chips": ["It will go straight into our drinking well!", "It will get filtered automatically by earth."]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["well", "drinking", "dirty", "dust", "1"],
            "question": "Let's imagine you are washing an apple covered in mud. If you eat the first muddy water splash from washing it, what are you drinking?",
            "chips": ["Muddy, dirty water!", "Clean water."]
          },
          {
            "step_num": 2,
            "keywords": ["muddy", "dirty", "dust", "wash"],
            "question": "Right! We want to separate the muddy water from the clean inside. In our village, how can we make sure we discard the first dirty splash of the roof?",
            "chips": ["Bypass/throw away the first splash", "Let it mix into the well"]
          },
          {
            "step_num": 3,
            "keywords": ["bypass", "throw", "divert", "first"],
            "question": "Excellent! That's what the First-Flush Diverter does. It acts like throwing away the first dirty water. Shall we add it to Step 2?",
            "chips": ["Yes, add First-Flush Diverter to Step 2", "No, keep direct connection"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "diverter", "add"],
            "question": "Wonderful, beta! Placing the First-Flush Diverter in Step 2 will protect our drinking well from that first dusty wash. Let's adjust our canvas!",
            "chips": ["I'll add it now!"]
          }
        ],
        "fallback_visual_description": "Let's trace the water flow visually: Rooftop Collector (Step 1) -> First-Flush Diverter (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4). Placing them in this sequence ensures that dirty first rain is diverted, silt is filtered, and clean water enters the well."
      },
      "first_flush_divert": {
        "initial_question": {
          "text": "You layered a filter! That will catch silt. But think: if the heavy dust, mud, and dry leaves from the very first rain hit the filter immediately, won't our local filter get clogged up on day one? How can we avoid that first muddy wave?",
          "chips": ["Add a First-Flush Diverter to bypass it", "Just clean the filter daily"]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["diverter", "first", "bypass", "add"],
            "question": "Imagine we have a small tea strainer. If we throw a handful of mud and dry leaves into it first, what happens to the tiny holes?",
            "chips": ["They get completely clogged up!", "They remain clean."]
          },
          {
            "step_num": 2,
            "keywords": ["clogged", "blocked", "stopped"],
            "question": "Exactly! It gets blocked. So to protect our fine strainer, we must first divert the big mud chunk. Which component can bypass the first mud splash?",
            "chips": ["The First-Flush Diverter", "A standard pipe"]
          },
          {
            "step_num": 3,
            "keywords": ["diverter", "flush", "first"],
            "question": "Yes, the First-Flush Diverter! If we place it in Step 2, it intercepts the initial muddy wash and protects our filter. Ready to place it?",
            "chips": ["Yes, let's place it in Step 2!", "No, keep it as is"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "place"],
            "question": "Brilliant, beta! Add the First-Flush Diverter in Step 2 to protect the Sand/Gravel Filter in Step 3. Let's do it!",
            "chips": ["Got it, let's update!"]
          }
        ],
        "fallback_visual_description": "To protect your filter from clogging: sequence the water from Rooftop Collector (Step 1) -> First-Flush Diverter (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4). The diverter takes the heavy mud brunt, keeping the filter clean!"
      },
      "budget_filter_choice": {
        "initial_question": {
          "text": "A very clean membrane filter indeed, beta! But look at the budget indicator: we spent a huge chunk! Membrane filters cost a lot to replace, and the village school has low funds. What natural, local materials could we layer in Step 3 instead to keep it extremely cheap but efficient?",
          "chips": ["Replace it with the Sand/Gravel Filter", "Keep the expensive membrane"]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["replace", "sand", "gravel", "local"],
            "question": "If we need to filter water in a village but can't buy expensive fancy plastic filters, what clean materials does Mother Earth give us under our feet?",
            "chips": ["Sand, gravel, and charcoal!", "Plastic membranes."]
          },
          {
            "step_num": 2,
            "keywords": ["sand", "gravel", "earth", "charcoal"],
            "question": "Indeed! Sand and gravel can filter water beautifully. Why pay so much when sand and stones from our riverbed are free? Let's use local Sand/Gravel Filter!",
            "chips": ["Use local Sand/Gravel Filter", "Keep membrane filter"]
          },
          {
            "step_num": 3,
            "keywords": ["use", "sand", "gravel"],
            "question": "Let's change our Step 3 to Sand/Gravel Filter to save our precious budget. Sound like a plan, beta?",
            "chips": ["Yes, change it to Sand/Gravel Filter!", "No, I like the expensive filter"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "change"],
            "question": "Brilliant! Changing Step 3 to Sand/Gravel Filter cuts the initial setup and maintenance costs, making our system highly sustainable!",
            "chips": ["Excellent, let's change!"]
          }
        ],
        "fallback_visual_description": "For high cost-efficiency and local sustainability: replace the Membrane Filter in Step 3 with the Sand/Gravel Filter. This matches the EVS constraint of utilizing simple, local materials that village schools can easily maintain."
      }
    };

    // Initialize ES6 Proxy State Management
    this.state = new Proxy({
      activeTree: null,
      stepIndex: 0,
      questionCount: 0,
      language: 'en' // default language
    }, {
      set: (target, prop, value) => {
        const oldValue = target[prop];
        target[prop] = value;
        
        if (prop === 'language' && oldValue !== value) {
          document.dispatchEvent(new CustomEvent('sahai:language-changed', {
            detail: { language: value }
          }));
        }
        return true;
      }
    });

    this.loadChallenges();
  }

  async loadChallenges() {
    try {
      const response = await fetch('data/challenges/water-filtration.json');
      if (response.ok) {
        const data = await response.json();
        this.challenges = data.challenges[this.activeChallenge].states;
      } else {
        throw new Error('Local file fetch failure');
      }
    } catch (e) {
      console.warn("Offline or failed to fetch Socratic JSON. Activating localized Socratic trees.", e);
      this.challenges = this.fallbackData;
    }
  }

  // Intercept the incorrect drag layouts or inputs
  evaluateDesign(pipeline) {
    const intake = pipeline[0];
    const divert = pipeline[1];
    const filter = pipeline[2];
    const recharge = pipeline[3];

    // Show dynamic typing indicator with a random pulse duration between 500ms and 800ms
    const delay = Math.floor(Math.random() * 300) + 500;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      // 1. Case: Empty Setup
      if (!intake && !divert && !filter && !recharge) {
        this.addAIBubble({
          type: 'hint',
          text: "Let's put our heads together, beta! Place the Rooftop Collector in Step 1 to start capturing the rainfall!"
        });
        return;
      }

      // 2. Case: Direct Connection (No filter, no diverter)
      if (intake && recharge && !divert && !filter) {
        updateSocraticProgress(1);
        saveLayout();
        setMascotState('hint');
        
        this.state.activeTree = 'direct_connection_dust';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['direct_connection_dust'].initial_question;
        this.addAIBubble({
          type: 'hint',
          text: q.text,
          chips: q.chips
        });
        return;
      }

      // 3. Case: No first flush diverter placed (but filter is placed)
      if (intake && filter && recharge && !divert) {
        updateSocraticProgress(2);
        saveLayout();
        setMascotState('hint');
        
        this.state.activeTree = 'first_flush_divert';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['first_flush_divert'].initial_question;
        this.addAIBubble({
          type: 'hint',
          text: q.text,
          chips: q.chips
        });
        return;
      }

      // 4. Case: High tech membrane filter used (budget crash)
      if (intake && divert && filter && filter.id === 'comp-membrane') {
        updateSocraticProgress(2);
        saveLayout();
        setMascotState('hint');
        
        this.state.activeTree = 'budget_filter_choice';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['budget_filter_choice'].initial_question;
        this.addAIBubble({
          type: 'hint',
          text: q.text,
          chips: q.chips
        });
        return;
      }

      // 5. Case: Correct configuration (Rooftop + Diverter/First-Flush + Sand/Gravel + Well)
      if (intake && intake.id === 'comp-rooftop' &&
          divert && (divert.id === 'comp-diverter' || divert.id === 'comp-first-flush') &&
          filter && (filter.id === 'comp-filter' || filter.id === 'comp-filter-chamber') &&
          recharge && (recharge.id === 'comp-well' || recharge.id === 'comp-recharge-well')) {
        
        updateSocraticProgress(3);
        saveLayout();
        setMascotState('success');
        addFeedbackBanner("✅ Congratulations! System Designed Successfully!");
        
        this.addAIBubble({
          type: 'decompose',
          text: "<strong>Incredible work, beta! 🏮✨</strong> You have designed a flawless, low-cost rainwater harvesting recharge system for the village! You bypassed the initial dust, filtered the silt with sand and gravel, and safely recharged the groundwater.<br/><br/>You have mastered **Hydrology & Infrastructure Planning**! +150 XP!"
        });

        // Award rewards
        awardXP(150);
        const resilienceBadge = document.getElementById('badge-resilience');
        if (resilienceBadge) resilienceBadge.classList.remove('locked');
        
        const step2 = document.getElementById('step-2-item');
        if (step2) {
          step2.className = 'step-item done';
          step2.querySelector('.step-indicator').textContent = '✓';
        }
        const step3 = document.getElementById('step-3-item');
        if (step3) step3.className = 'step-item active';

        // Update skill metrics inline
        skillData[0] = 92; // Hydrology up
        skillData[1] = 84; // Critical up
        skillData[2] = 98; // Perseverance up
        animFrame = 0;
        animateRadar();
        
        this.state.activeTree = null;
        return;
      }

      // Fallback: Catch any other incorrect combinations
      this.addAIBubble({
        type: 'hint',
        text: "You are experimental, beta! Let's trace the water: it must flow from Rooftop (Step 1) -> First-Flush (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4) to ensure absolute purity and cost efficiency. Give that sequence a shot!"
      });
      this.state.activeTree = null;

    }, delay);
  }

  // Handle incoming student message (or chat input)
  handleStudentMessage(text) {
    if (!text.trim()) return;

    this.addStudentBubble(text);

    // Dynamic typing indicator with a random pulse duration
    const delay = Math.floor(Math.random() * 300) + 500;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      if (!this.state.activeTree) {
        // General fallback reply
        this.addAIBubble({
          type: 'hint',
          text: "I hear your thinking, beta! Every attempt teaches us how water behaves. Make adjustments on our visual canvas above and hit 'Test My Design' to see Sparky evaluate it!"
        });
        return;
      }

      const activeTreeName = this.state.activeTree;
      const tree = this.challenges[activeTreeName];
      const steps = tree.steps;
      
      // If we've already asked 4 Socratic sub-questions, redirect to simplified visual block description
      if (this.state.questionCount >= 4) {
        this.addAIBubble({
          type: 'hint',
          text: `<strong>Let's simplify this, beta! 💡</strong> Here is exactly how we can wire it:<br/><br/>${tree.fallback_visual_description}`
        });
        this.state.activeTree = null;
        return;
      }

      // Socratic analysis logic
      const currentStep = steps[this.state.stepIndex];
      const normalizedText = text.toLowerCase();
      
      // Check if user answer matches any of the keywords in the active Socratic node
      let matchesKeywords = false;
      if (currentStep.keywords) {
        matchesKeywords = currentStep.keywords.some(kw => normalizedText.includes(kw));
      }

      // Also match if they clicked the correct chip (first choice is usually the direct answer)
      if (currentStep.chips && currentStep.chips[0] && normalizedText.includes(currentStep.chips[0].toLowerCase())) {
        matchesKeywords = true;
      }

      if (matchesKeywords) {
        // Progress to next sub-question
        this.state.stepIndex++;
        this.state.questionCount++;
        
        if (this.state.stepIndex < steps.length) {
          const nextStep = steps[this.state.stepIndex];
          this.addAIBubble({
            type: 'decompose',
            text: nextStep.question,
            chips: nextStep.chips
          });
        } else {
          // Finished the Socratic tree successfully!
          let finalSolutionMessage = "";
          if (activeTreeName === 'direct_connection_dust') {
            finalSolutionMessage = "Exactly, beta! The dusty runoff would ruin the clean village groundwater. That's why we need a way to bypass the first flush of rain. Try placing the <strong>First-Flush Diverter</strong> in Step 2 to solve this!";
          } else if (activeTreeName === 'first_flush_divert') {
            finalSolutionMessage = "Correct! The First-Flush Diverter will wash the dust aside. Try placing it in Step 2 so only the cleaner water gets to our filter!";
          } else if (activeTreeName === 'budget_filter_choice') {
            finalSolutionMessage = "Spot on! Replacing it with a low-cost <strong>Sand/Gravel Filter</strong> cuts the initial setup and maintenance costs, making our system highly sustainable!";
          }
          
          this.addAIBubble({
            type: 'decompose',
            text: finalSolutionMessage
          });
          this.state.activeTree = null;
        }
      } else {
        // Increment question count anyway to enforce the 4 sub-question cap
        this.state.questionCount++;
        
        if (this.state.questionCount >= 4) {
          this.addAIBubble({
            type: 'hint',
            text: `<strong>Let's simplify this, beta! 💡</strong> Here is exactly how we can wire it:<br/><br/>${tree.fallback_visual_description}`
          });
          this.state.activeTree = null;
        } else {
          // Nudge them gently to think again without resetting their state
          this.addAIBubble({
            type: 'hint',
            text: `Let's think again, beta! Look closely at the choices. ${currentStep.question}`,
            chips: currentStep.chips
          });
        }
      }
    }, delay);
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.style.display = 'flex';
      this.scrollChat();
    }
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  addStudentBubble(text) {
    const chat = document.getElementById('chatArea');
    if (!chat) return;

    const div = document.createElement('div');
    div.className = 'msg-student';
    // Adding aria-live and role attributes for screen-reader accessibility
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('role', 'log');

    // Render User bubble with var(--indigo) background
    div.innerHTML = `
      <div class="student-bubble" style="background: var(--indigo); border: none; color: var(--white);">
        ${this.escapeHtml(text)}
      </div>
    `;
    chat.insertBefore(div, document.getElementById('typingIndicator'));
    this.scrollChat();
  }

  addAIBubble(resp) {
    const chat = document.getElementById('chatArea');
    if (!chat) return;

    const div = document.createElement('div');
    div.className = 'msg-ai';
    // Adding aria-live and role attributes for screen-reader accessibility
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('role', 'log');

    let chipsHtml = '';
    if (resp.chips) {
      chipsHtml = `<div class="scaffold-chips">` +
        resp.chips.map(c => `<div class="scaffold-chip" onclick="fillInput('${c}')">${c}</div>`).join('') +
        `</div>`;
    }

    // Border: 1px solid var(--indigo) (#6366F1), background: var(--surface) (#111827)
    let bubbleStyle = `border: 1px solid var(--indigo); background: var(--surface); color: var(--text);`;
    let labelColorStyle = `color: var(--indigo);`;
    
    if (resp.type === 'hint') {
      bubbleStyle = `border: 1px solid var(--coral); background: var(--surface); color: var(--text);`;
      labelColorStyle = `color: var(--coral);`;
    } else if (resp.type === 'decompose') {
      bubbleStyle = `border: 1px solid var(--mint); background: var(--surface); color: var(--text);`;
      labelColorStyle = `color: var(--mint);`;
    }

    const labelText = resp.type === 'hint' ? '💡 Sparky\'s Hint' :
                      resp.type === 'decompose' ? '🧩 Socratic Step' : '🏮 Sparky';

    div.innerHTML = `
      <div class="ai-avatar" id="sparkyAvatar">🏮</div>
      <div class="ai-bubble" style="${bubbleStyle}">
        <div class="ai-label" style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.3rem; ${labelColorStyle}">
          ${labelText}
        </div>
        ${resp.text}
        ${chipsHtml}
      </div>
    `;
    chat.insertBefore(div, document.getElementById('typingIndicator'));
    this.scrollChat();
  }

  scrollChat() {
    const chat = document.getElementById('chatArea');
    if (chat) {
      setTimeout(() => chat.scrollTop = chat.scrollHeight, 50);
    }
  }

  escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

// Instantiate Socratic engine globally
window.socraticEngine = new SocraticChatEngine();
