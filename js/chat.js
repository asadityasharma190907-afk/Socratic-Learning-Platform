/**
 * SahAI Socratic Learning Platform — Socratic Chat Engine
 * Cyber-Pedagogy Conversational Scaffolding & Bilingual Translation Switcher
 * File: js/chat.js
 */

class SocraticChatEngine {
  constructor() {
    this.challenges = null;
    this.activeChallenge = 'water-filtration';
    
    // Dynamic CSS Injection for absolute modularity
    this.injectStyles();

    // Default fallback analogies if network fetch fails (offline safety)
    this.fallbackData = {
      "direct_connection_dust": {
        "initial_question": {
          "textEn": "A lovely start, beta! The rooftop collects the rain, and it flows straight to the well. But think about the very first heavy rain of the monsoon. It washes off all the dry summer dust and leaves from the roof. If the water flows straight down, where will all that dust go?",
          "textHi": "बहुत बढ़िया शुरुआत, बेटा! छत बारिश का पानी इकट्ठा करती है, और यह सीधे कुएं में बह जाता है। लेकिन मानसून की पहली भारी बारिश के बारे में सोचें। यह छत से गर्मियों की सारी धूल और सूखे पत्तों को बहा ले जाती है। यदि पानी सीधे नीचे बहता है, तो वह सारी धूल कहाँ जाएगी?",
          "chips": ["It will go straight into our drinking well!", "It will get filtered automatically by earth."]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["well", "drinking", "dirty", "dust", "1"],
            "questionEn": "Let's imagine you are washing an apple covered in mud. If you eat the first muddy water splash from washing it, what are you drinking?",
            "questionHi": "जरा सोचिए कि आप कीचड़ से सना हुआ एक सेब धो रहे हैं। यदि आप इसे धोने से निकलने वाला पहला गंदा पानी पीते हैं, तो आप क्या पी रहे हैं?",
            "chips": ["Muddy, dirty water!", "Clean water."]
          },
          {
            "step_num": 2,
            "keywords": ["muddy", "dirty", "dust", "wash"],
            "questionEn": "Right! We want to separate the muddy water from the clean inside. In our village, how can we make sure we discard the first dirty splash of the roof?",
            "questionHi": "बिल्कुल सही! हम गंदे पानी को अंदर के साफ पानी से अलग करना चाहते हैं। हमारे गांव में, हम यह कैसे सुनिश्चित कर सकते हैं कि छत का पहला गंदा पानी बाहर निकाल दिया जाए?",
            "chips": ["Bypass/throw away the first splash", "Let it mix into the well"]
          },
          {
            "step_num": 3,
            "keywords": ["bypass", "throw", "divert", "first"],
            "questionEn": "Excellent! That's what the First-Flush Diverter does. It acts like throwing away the first dirty water. Shall we add it to Step 2?",
            "questionHi": "शानदार! यही काम फर्स्ट-फ्लश डाइवर्टर (First-Flush Diverter) करता है। यह पहले गंदे पानी को फेंकने जैसा है। क्या हम इसे स्टेप 2 में जोड़ें?",
            "chips": ["Yes, add First-Flush Diverter to Step 2", "No, keep direct connection"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "diverter", "add"],
            "questionEn": "Wonderful, beta! Placing the First-Flush Diverter in Step 2 will protect our drinking well from that first dusty wash. Let's adjust our canvas!",
            "questionHi": "अद्भुत, बेटा! स्टेप 2 में फर्स्ट-फ्लश डाइवर्टर रखने से हमारा पीने का कुआं उस पहली धूल भरी धुलाई से बच जाएगा। चलिए अपने कैनवास को ठीक करते हैं!",
            "chips": ["I'll add it now!"]
          }
        ],
        "fallbackEn": "Let's trace the water flow visually: Rooftop Collector (Step 1) -> First-Flush Diverter (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4). Placing them in this sequence ensures that dirty first rain is diverted, silt is filtered, and clean water enters the well.",
        "fallbackHi": "आइए पानी के बहाव को देखें: रूफटॉप कलेक्टर (स्टेप 1) -> फर्स्ट-फ्लश डाइवर्टर (स्टेप 2) -> रेत/बजरी फिल्टर (स्टेप 3) -> रीचार्ज कुआं (स्टेप 4)। इन्हें इस क्रम में रखने से यह सुनिश्चित होता है कि पहली गंदी बारिश का मार्ग बदल दिया जाता है, गाद को छान लिया जाता है और साफ पानी कुएं में जाता है।"
      },
      "first_flush_divert": {
        "initial_question": {
          "textEn": "You layered a filter! That will catch silt. But think: if the heavy dust, mud, and dry leaves from the very first rain hit the filter immediately, won't our local filter get clogged up on day one? How can we avoid that first muddy wave?",
          "textHi": "आपने एक फ़िल्टर लगाया है! यह गाद को रोकेगा। लेकिन सोचिए: यदि पहली बारिश की भारी धूल, कीचड़ और सूखे पत्ते तुरंत फिल्टर से टकराते हैं, तो क्या हमारा फिल्टर पहले ही दिन बंद नहीं हो जाएगा? हम उस पहली कीचड़ भरी लहर से कैसे बच सकते हैं?",
          "chips": ["Add a First-Flush Diverter to bypass it", "Just clean the filter daily"]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["diverter", "first", "bypass", "add"],
            "questionEn": "Imagine we have a small tea strainer. If we throw a handful of mud and dry leaves into it first, what happens to the tiny holes?",
            "questionHi": "मान लीजिए हमारे पास चाय की एक छोटी छलनी है। यदि हम उसमें सबसे पहले एक मुट्ठी मिट्टी और सूखे पत्ते डाल दें, तो छोटे-छोटे छेदों का क्या होगा?",
            "chips": ["They get completely clogged up!", "They remain clean."]
          },
          {
            "step_num": 2,
            "keywords": ["clogged", "blocked", "stopped"],
            "questionEn": "Exactly! It gets blocked. So to protect our fine strainer, we must first divert the big mud chunk. Which component can bypass the first mud splash?",
            "questionHi": "बिल्कुल सही! यह बंद हो जाती है। इसलिए अपनी छलनी को बचाने के लिए, हमें पहले कीचड़ के बड़े टुकड़े को अलग करना होगा। कौन सा घटक बारिश के पहले गंदे पानी को बाईपास कर सकता है?",
            "chips": ["The First-Flush Diverter", "A standard pipe"]
          },
          {
            "step_num": 3,
            "keywords": ["diverter", "flush", "first"],
            "questionEn": "Yes, the First-Flush Diverter! If we place it in Step 2, it intercepts the initial muddy wash and protects our filter. Ready to place it?",
            "questionHi": "हाँ, फर्स्ट-फ्लश डाइवर्टर! यदि हम इसे स्टेप 2 में रखते हैं, तो यह शुरूआती कीचड़ भरे पानी को रोक देता है और हमारे फिल्टर की रक्षा करता है। क्या इसे लगाने के लिए तैयार हैं?",
            "chips": ["Yes, let's place it in Step 2!", "No, keep it as is"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "place"],
            "questionEn": "Brilliant, beta! Add the First-Flush Diverter in Step 2 to protect the Sand/Gravel Filter in Step 3. Let's do it!",
            "questionHi": "शानदार, बेटा! स्टेप 3 में रेत/बजरी फिल्टर को बचाने के लिए स्टेप 2 में फर्स्ट-फ्लश डाइवर्टर जोड़ें। चलिए करते हैं!",
            "chips": ["Got it, let's update!"]
          }
        ],
        "fallbackEn": "To protect your filter from clogging: sequence the water from Rooftop Collector (Step 1) -> First-Flush Diverter (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4). The diverter takes the heavy mud brunt, keeping the filter clean!",
        "fallbackHi": "फिल्टर को बंद होने से बचाने के लिए पानी का बहाव इस तरह रखें: रूफटॉप कलेक्टर (स्टेप 1) -> फर्स्ट-फ्लश डाइवर्टर (स्टेप 2) -> रेत/बजरी फिल्टर (स्टेप 3) -> रीचार्ज कुआं (स्टेप 4)। डाइवर्टर कीचड़ का भार झेलता है, जिससे फिल्टर साफ रहता है!"
      },
      "budget_filter_choice": {
        "initial_question": {
          "textEn": "A very clean membrane filter indeed, beta! But look at the budget indicator: we spent a huge chunk! Membrane filters cost a lot to replace, and the village school has low funds. What natural, local materials could we layer in Step 3 instead to keep it extremely cheap but efficient?",
          "textHi": "वास्तव में एक बहुत ही साफ मेम्ब्रेन (झिल्ली) फिल्टर है, बेटा! लेकिन बजट संकेतक को देखें: हमने बहुत बड़ा हिस्सा खर्च कर दिया! मेम्ब्रेन फिल्टर को बदलने में बहुत खर्च होता है, और गांव के स्कूल के पास धन की कमी है। इसके बजाय हम स्टेप 3 में कौन सी प्राकृतिक, स्थानीय सामग्री लगा सकते हैं ताकि यह बेहद सस्ता लेकिन कुशल रहे?",
          "chips": ["Replace it with the Sand/Gravel Filter", "Keep the expensive membrane"]
        },
        "steps": [
          {
            "step_num": 1,
            "keywords": ["replace", "sand", "gravel", "local"],
            "questionEn": "If we need to filter water in a village but can't buy expensive fancy plastic filters, what clean materials does Mother Earth give us under our feet?",
            "questionHi": "यदि हमें किसी गाँव में पानी छानना है लेकिन महँगे फैंसी प्लास्टिक फिल्टर नहीं खरीद सकते, तो धरती माँ हमें अपने पैरों के नीचे कौन सी साफ सामग्री देती है?",
            "chips": ["Sand, gravel, and charcoal!", "Plastic membranes."]
          },
          {
            "step_num": 2,
            "keywords": ["sand", "gravel", "earth", "charcoal"],
            "questionEn": "Indeed! Sand and gravel can filter water beautifully. Why pay so much when sand and stones from our riverbed are free? Let's use local Sand/Gravel Filter!",
            "questionHi": "बिल्कुल! रेत और बजरी पानी को खूबसूरती से छान सकते हैं। जब हमारी नदी तट की रेत और पत्थर मुफ्त हैं तो इतना भुगतान क्यों करें? आइए स्थानीय रेत/बजरी फ़िल्टर का उपयोग करें!",
            "chips": ["Use local Sand/Gravel Filter", "Keep membrane filter"]
          },
          {
            "step_num": 3,
            "keywords": ["use", "sand", "gravel"],
            "questionEn": "Let's change our Step 3 to Sand/Gravel Filter to save our precious budget. Sound like a plan, beta?",
            "questionHi": "आइए अपने कीमती बजट को बचाने के लिए स्टेप 3 को रेत/बजरी फ़िल्टर में बदलें। क्या विचार है, बेटा?",
            "chips": ["Yes, change it to Sand/Gravel Filter!", "No, I like the expensive filter"]
          },
          {
            "step_num": 4,
            "keywords": ["yes", "change"],
            "questionEn": "Brilliant! Changing Step 3 to Sand/Gravel Filter cuts the initial setup and maintenance costs, making our system highly sustainable!",
            "questionHi": "शानदार! स्टेप 3 को रेत/बजरी फिल्टर में बदलने से प्रारंभिक सेटअप और रखरखाव की लागत कम हो जाती है, जिससे हमारी प्रणाली अत्यधिक टिकाऊ हो जाती है!",
            "chips": ["Excellent, let's change!"]
          }
        ],
        "fallbackEn": "For high cost-efficiency and local sustainability: replace the Membrane Filter in Step 3 with the Sand/Gravel Filter. This matches the EVS constraint of utilizing simple, local materials that village schools can easily maintain.",
        "fallbackHi": "उच्च लागत-दक्षता और स्थानीय स्थिरता के लिए: स्टेप 3 में मेम्ब्रेन फिल्टर को रेत/बजरी फिल्टर से बदलें। यह सरल, स्थानीय सामग्री का उपयोग करने की ईवीएस (EVS) आवश्यकता से मेल खाता है जिसे ग्रामीण स्कूल आसानी से बनाए रख सकते हैं।"
      }
    };

    // Global Reactive Shallow Proxy for Socratic & Translation State
    this.state = new Proxy({
      activeTree: null,
      stepIndex: 0,
      questionCount: 0,
      language: 'en',
      hintCounter: 0
    }, {
      set: (target, prop, value) => {
        const oldVal = target[prop];
        target[prop] = value;
        if (prop === 'language' && oldVal !== value) {
          // Fire event for UI update
          document.dispatchEvent(new CustomEvent('sahai:language-changed', {
            detail: { language: value }
          }));
        }
        return true;
      }
    });

    this.setupEventListeners();
    this.loadChallengesAndInit();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-bubble {
        position: relative;
        transition: border-color 0.3s ease, background-color 0.3s ease;
      }
      .translate-toggle-btn {
        position: absolute;
        top: 0.6rem;
        right: 0.8rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--rounded-full);
        padding: 0.2rem 0.6rem;
        font-size: 0.68rem;
        font-family: var(--font-display);
        font-weight: 600;
        color: var(--text-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 3px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10;
        outline: none;
      }
      .translate-toggle-btn:hover {
        background: var(--indigo-dim);
        border-color: var(--indigo-border);
        color: var(--text);
        transform: scale(1.04);
      }
      .translate-toggle-btn .lang-label {
        transition: color 0.2s ease, font-weight 0.2s ease;
      }
      .translate-toggle-btn .lang-label.active {
        color: var(--indigo-300);
        font-weight: 700;
      }
      .translate-toggle-btn .lang-divider {
        opacity: 0.25;
        margin: 0 1px;
      }
    `;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Reactive Event Listener: automatically swaps translations in-place for all visible AI bubbles
    document.addEventListener('sahai:language-changed', (e) => {
      const lang = e.detail.language;
      const bubbles = document.querySelectorAll('.ai-bubble');
      bubbles.forEach(bubble => {
        const textEn = bubble.getAttribute('data-text-en');
        const textHi = bubble.getAttribute('data-text-hi');
        const contentDiv = bubble.querySelector('.ai-text-content');
        if (contentDiv) {
          contentDiv.innerHTML = lang === 'hi' ? textHi : textEn;
        }

        // Sync toggle buttons
        const btn = bubble.querySelector('.translate-toggle-btn');
        if (btn) {
          const enLabel = btn.querySelector('.lang-label.en');
          const hiLabel = btn.querySelector('.lang-label.hi');
          if (enLabel && hiLabel) {
            if (lang === 'en') {
              enLabel.classList.add('active');
              hiLabel.classList.remove('active');
            } else {
              enLabel.classList.remove('active');
              hiLabel.classList.add('active');
            }
          }
        }
      });
    });
  }

  async loadChallengesAndInit() {
    try {
      const response = await fetch('data/challenges/water-filtration.json');
      if (response.ok) {
        const data = await response.json();
        this.challenges = data.challenges[this.activeChallenge].states;
      } else {
        throw new Error('Local file read failed');
      }
    } catch (e) {
      console.warn("Using inline fallback Socratic translation data.", e);
      this.challenges = this.fallbackData;
    }

    // Dynamic clean rendering of translatable Welcome Message
    this.renderWelcome();
  }

  renderWelcome() {
    const chat = document.getElementById('chatArea');
    if (!chat) return;

    // Clear static welcome if present to avoid duplicates
    const welcome = chat.querySelector('.msg-ai');
    if (welcome && !welcome.querySelector('.translate-toggle-btn')) {
      welcome.remove();
    }

    this.addAIBubble({
      type: 'welcome',
      textEn: `<strong>Welcome back, Aarya!</strong> 🌱 We need your help to capture clean rainwater for the village. <br/><br/>Drag components from the <strong>Available Parts</strong> bin on the left into the 4 slots of our **Rainwater Harvesting Pipeline** above. Once your design is complete, click <strong>"Test My Design"</strong> so we can evaluate it together!`,
      textHi: `<strong>स्वागत है, आर्या!</strong> 🌱 हमें गाँव के लिए साफ़ बारिश का पानी इकट्ठा करने में आपकी मदद की ज़रूरत है। <br/><br/>बाईं ओर <strong>'Available Parts'</strong> वाले डिब्बे से घटकों को ऊपर हमारे **Rainwater Harvesting Pipeline** के 4 स्लॉट्स में खींचें। जब आपका डिज़ाइन पूरा हो जाए, तो <strong>"Test My Design"</strong> पर क्लिक करें ताकि हम मिलकर इसका मूल्यांकन कर सकें!`
    });
  }

  evaluateDesign(pipeline) {
    const intake = pipeline[0];
    const divert = pipeline[1];
    const filter = pipeline[2];
    const recharge = pipeline[3];

    // Pulsing typing indicator duration between 500ms and 800ms
    const delay = Math.floor(Math.random() * 300) + 500;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      // Case: Empty Setup
      if (!intake && !divert && !filter && !recharge) {
        this.addAIBubble({
          type: 'hint',
          textEn: "Let's put our heads together, beta! Place the Rooftop Collector in Step 1 to start capturing the rainfall!",
          textHi: "आइए मिलकर सोचते हैं, बेटा! बारिश के पानी को इकट्ठा करना शुरू करने के लिए स्टेप 1 में रूफटॉप कलेक्टर (Rooftop Collector) रखें!"
        });
        return;
      }

      // Case: Direct Connection (No filter, no diverter)
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
          textEn: q.textEn,
          textHi: q.textHi,
          chips: q.chips
        });
        return;
      }

      // Case: No first flush diverter placed (but filter is placed)
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
          textEn: q.textEn,
          textHi: q.textHi,
          chips: q.chips
        });
        return;
      }

      // Case: High tech membrane filter used (budget crash check)
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
          textEn: q.textEn,
          textHi: q.textHi,
          chips: q.chips
        });
        return;
      }

      // Case: Correct configuration (Rooftop + Diverter + Sand/Gravel + Well)
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
          textEn: "<strong>Incredible work, beta! 🏮✨</strong> You have designed a flawless, low-cost rainwater harvesting recharge system for the village! You bypassed the initial dust, filtered the silt with sand and gravel, and safely recharged the groundwater.<br/><br/>You have mastered **Hydrology & Infrastructure Planning**! +150 XP!",
          textHi: "<strong>शानदार काम, बेटा! 🏮✨</strong> आपने गाँव के लिए एक दोषरहित, कम लागत वाला वर्षा जल संचयन रीचार्ज सिस्टम तैयार किया है! आपने शुरूआती धूल को अलग किया, रेत और बजरी से गाद को छाना और भूजल को सुरक्षित रूप से रीचार्ज किया।<br/><br/>आपने **जल विज्ञान और बुनियादी ढांचा योजना (Hydrology & Infrastructure Planning)** में महारत हासिल की है! +150 XP!"
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

        // Update skill metrics
        skillData[0] = 92; 
        skillData[1] = 84; 
        skillData[2] = 98; 
        animFrame = 0;
        animateRadar();
        
        this.state.activeTree = null;
        return;
      }

      // Fallback
      this.addAIBubble({
        type: 'hint',
        textEn: "You are experimental, beta! Let's trace the water: it must flow from Rooftop (Step 1) -> First-Flush (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4) to ensure absolute purity and cost efficiency. Give that sequence a shot!",
        textHi: "आप बहुत प्रयोग कर रहे हैं, बेटा! आइए पानी के मार्ग को देखें: शुद्धता और कम खर्च के लिए पानी रूफटॉप (स्टेप 1) -> फर्स्ट-फ्लश (स्टेप 2) -> रेत/बजरी फिल्टर (स्टेप 3) -> रीचार्ज कुआं (स्टेप 4) से होकर बहना चाहिए। इस क्रम को एक बार आज़माएं!"
      });
      this.state.activeTree = null;

    }, delay);
  }

  handleStudentMessage(text) {
    if (!text.trim()) return;

    this.addStudentBubble(text);

    const delay = Math.floor(Math.random() * 300) + 500;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      if (!this.state.activeTree) {
        this.addAIBubble({
          type: 'hint',
          textEn: "I hear your thinking, beta! Every attempt teaches us how water behaves. Make adjustments on our visual canvas above and hit 'Test My Design' to see Sparky evaluate it!",
          textHi: "मैं आपकी सोच समझ पा रहा हूँ, बेटा! हर प्रयास हमें पानी के व्यवहार के बारे में सिखाता है। ऊपर हमारे विज़ुअल कैनवास पर बदलाव करें और स्पार्की द्वारा मूल्यांकन देखने के लिए 'Test My Design' दबाएं!"
        });
        return;
      }

      const activeTreeName = this.state.activeTree;
      const tree = this.challenges[activeTreeName];
      const steps = tree.steps;
      
      // Strict 4 questions loop cap
      if (this.state.questionCount >= 4) {
        this.addAIBubble({
          type: 'hint',
          textEn: `<strong>Let's simplify this, beta! 💡</strong> Here is exactly how we can wire it:<br/><br/>${tree.fallbackEn || tree.fallback_visual_description}`,
          textHi: `<strong>इसे आसान बनाते हैं, बेटा! 💡</strong> इसे हमें बिल्कुल इस तरह जोड़ना है:<br/><br/>${tree.fallbackHi || tree.fallbackEn}`
        });
        this.state.activeTree = null;
        return;
      }

      const currentStep = steps[this.state.stepIndex];
      const normalizedText = text.toLowerCase();
      
      // Keyword matching
      let matchesKeywords = false;
      if (currentStep.keywords) {
        matchesKeywords = currentStep.keywords.some(kw => normalizedText.includes(kw));
      }
      if (currentStep.chips && currentStep.chips[0] && normalizedText.includes(currentStep.chips[0].toLowerCase())) {
        matchesKeywords = true;
      }

      if (matchesKeywords) {
        this.state.stepIndex++;
        this.state.questionCount++;
        
        if (this.state.stepIndex < steps.length) {
          const nextStep = steps[this.state.stepIndex];
          this.addAIBubble({
            type: 'decompose',
            textEn: nextStep.questionEn || nextStep.question,
            textHi: nextStep.questionHi || nextStep.questionEn || nextStep.question,
            chips: nextStep.chips
          });
        } else {
          // Finished the Socratic path
          let solEn = "";
          let solHi = "";
          
          if (activeTreeName === 'direct_connection_dust') {
            solEn = "Exactly, beta! The dusty runoff would ruin the clean village groundwater. That's why we need a way to bypass the first flush of rain. Try placing the <strong>First-Flush Diverter</strong> in Step 2 to solve this!";
            solHi = "बिल्कुल सही, बेटा! धूल भरा पानी कुएं के साफ पानी को खराब कर देगा। इसीलिए हमें बारिश की पहली फुहार को बाईपास करने की आवश्यकता है। इसे हल करने के लिए स्टेप 2 में <strong>First-Flush Diverter</strong> रखकर देखें!";
          } else if (activeTreeName === 'first_flush_divert') {
            solEn = "Correct! The First-Flush Diverter will wash the dust aside. Try placing it in Step 2 so only the cleaner water gets to our filter!";
            solHi = "सही कहा! फर्स्ट-फ्लश डाइवर्टर धूल को बाहर बहा देगा। इसे स्टेप 2 में रखने का प्रयास करें ताकि केवल साफ पानी ही हमारे फिल्टर तक पहुंचे!";
          } else if (activeTreeName === 'budget_filter_choice') {
            solEn = "Spot on! Replacing it with a low-cost <strong>Sand/Gravel Filter</strong> cuts the initial setup and maintenance costs, making our system highly sustainable!";
            solHi = "बिल्कुल सही! इसे कम लागत वाले <strong>रेत/बजरी फ़िल्टर (Sand/Gravel Filter)</strong> से बदलने से प्रारंभिक स्थापना और रखरखाव का खर्च कम हो जाता है, जिससे हमारा सिस्टम टिकाऊ बनता है!";
          }
          
          this.addAIBubble({
            type: 'decompose',
            textEn: solEn,
            textHi: solHi
          });
          this.state.activeTree = null;
        }
      } else {
        this.state.questionCount++;
        
        if (this.state.questionCount >= 4) {
          this.addAIBubble({
            type: 'hint',
            textEn: `<strong>Let's simplify this, beta! 💡</strong> Here is exactly how we can wire it:<br/><br/>${tree.fallbackEn || tree.fallback_visual_description}`,
            textHi: `<strong>इसे आसान बनाते हैं, बेटा! 💡</strong> इसे हमें बिल्कुल इस तरह जोड़ना है:<br/><br/>${tree.fallbackHi || tree.fallbackEn}`
          });
          this.state.activeTree = null;
        } else {
          this.addAIBubble({
            type: 'hint',
            textEn: `Let's think again, beta! Look closely at the choices. ${currentStep.questionEn || currentStep.question}`,
            textHi: `एक बार फिर सोचें, बेटा! विकल्पों को ध्यान से देखें। ${currentStep.questionHi || currentStep.questionEn || currentStep.question}`,
            chips: currentStep.chips
          });
        }
      }
    }, delay);
  }

  requestHint() {
    this.state.hintCounter++;
    
    if (this.state.hintCounter >= 8) {
      const modal = document.getElementById('modal-self-reflect');
      if (modal) {
        modal.style.display = 'flex';
        // force reflow
        void modal.offsetWidth;
        modal.style.opacity = '1';
      }
      return;
    }

    this.showTypingIndicator();
    if (window.setMascotState) window.setMascotState('hint');
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAIBubble({
        type: 'hint',
        textEn: "A gentle nudge, beta! 💡 The water should pass through a filter of sand and gravel before entering the recharge well. Make sure you place the <strong>Sand/Gravel Filter</strong> in Step 3!",
        textHi: "एक हल्का संकेत, बेटा! 💡 पानी को रीचार्ज कुएं में प्रवेश करने से पहले रेत और बजरी के फिल्टर से गुजरना चाहिए। सुनिश्चित करें कि आप <strong>Sand/Gravel Filter</strong> को स्टेप 3 में रखें!"
      });
    }, 1000);
  }

  submitReflection(text) {
    if (window.queueOutboxAction) {
      window.queueOutboxAction('student_1', 'SELF_REFLECTION', { text, timestamp: Date.now() });
    }
    
    const modal = document.getElementById('modal-self-reflect');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
    
    this.state.hintCounter = 0;
    this.requestHint(); 
  }

  toggleLanguage(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Toggle state reactive variable
    const nextLang = this.state.language === 'en' ? 'hi' : 'en';
    this.state.language = nextLang;

    // Retain textarea focus to not interrupt student's typing flow
    const input = document.getElementById('studentInput');
    if (input) {
      input.focus();
    }
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
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('role', 'log');

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
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('role', 'log');

    let chipsHtml = '';
    if (resp.chips) {
      chipsHtml = `<div class="scaffold-chips">` +
        resp.chips.map(c => `<div class="scaffold-chip" onclick="fillInput('${c}')">${c}</div>`).join('') +
        `</div>`;
    }

    const textEn = resp.textEn || resp.text || "";
    const textHi = resp.textHi || resp.textEn || resp.text || "";

    const activeText = this.state.language === 'hi' ? textHi : textEn;

    let bubbleStyle = `border: 1px solid var(--indigo); background: var(--surface); color: var(--text); position: relative;`;
    let labelColorStyle = `color: var(--indigo);`;
    
    if (resp.type === 'hint') {
      bubbleStyle = `border: 1px solid var(--coral); background: var(--surface); color: var(--text); position: relative;`;
      labelColorStyle = `color: var(--coral);`;
    } else if (resp.type === 'decompose') {
      bubbleStyle = `border: 1px solid var(--mint); background: var(--surface); color: var(--text); position: relative;`;
      labelColorStyle = `color: var(--mint);`;
    }

    const labelText = resp.type === 'hint' ? '💡 Sparky\'s Hint' :
                      resp.type === 'decompose' ? '🧩 Socratic Step' : '🏮 Sparky';

    const isEnActive = this.state.language === 'en' ? 'active' : '';
    const isHiActive = this.state.language === 'hi' ? 'active' : '';

    div.innerHTML = `
      <div class="ai-avatar" id="sparkyAvatar">🏮</div>
      <div class="ai-bubble" style="${bubbleStyle}" data-text-en="${this.escapeAttribute(textEn)}" data-text-hi="${this.escapeAttribute(textHi)}">
        <button class="translate-toggle-btn" onclick="window.socraticEngine.toggleLanguage(event)" aria-label="Translate bubble">
          <span class="lang-label en ${isEnActive}">EN</span>
          <span class="lang-divider">|</span>
          <span class="lang-label hi ${isHiActive}">हिं</span>
        </button>
        <div class="ai-label" style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.3rem; padding-right: 48px; ${labelColorStyle}">
          ${labelText}
        </div>
        <div class="ai-text-content">${activeText}</div>
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

  escapeAttribute(s) {
    return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
}

// Instantiate Socratic engine globally
window.socraticEngine = new SocraticChatEngine();
