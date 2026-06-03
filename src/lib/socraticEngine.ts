export interface Bubble {
  id: string;
  sender: 'ai' | 'student' | 'system';
  type: string;
  textEn: string;
  textHi: string;
  chips?: string[];
}

export interface EngineCallbacks {
  onAddBubble: (bubble: Bubble) => void;
  onSetMascotState: (state: 'success' | 'hint' | 'idle') => void;
  onUpdateProgress: (stage: number) => void;
  onAwardXP: (amount: number) => void;
  onOpenReflectionModal: () => void;
  onShowTyping: () => void;
  onHideTyping: () => void;
  onSaveLayout: () => void;
}

export class SocraticChatEngine {
  private activeChallenge: string = 'water-filtration';
  private fallbackData: any;
  private challenges: any = null;
  private callbacks: EngineCallbacks;

  public state = {
    activeTree: null as string | null,
    stepIndex: 0,
    questionCount: 0,
    language: 'en' as 'en' | 'hi',
    hintCounter: 0
  };

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
    this.initializeFallbackData();
    this.loadChallengesAndInit();
  }

  private initializeFallbackData() {
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
  }

  async loadChallengesAndInit() {
    try {
      const response = await fetch('/data/challenges/water-filtration.json');
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

    this.renderWelcome();
  }

  renderWelcome() {
    this.callbacks.onAddBubble({
      id: 'welcome-' + Date.now(),
      sender: 'ai',
      type: 'welcome',
      textEn: `<strong>Welcome back, Aarya!</strong> 🌱 We need your help to capture clean rainwater for the village. <br/><br/>Drag components from the <strong>Available Parts</strong> bin on the left into the 4 slots of our **Rainwater Harvesting Pipeline** above. Once your design is complete, click <strong>"Test My Design"</strong> so we can evaluate it together!`,
      textHi: `<strong>स्वागत है, आर्या!</strong> 🌱 हमें गाँव के लिए साफ़ बारिश का पानी इकट्ठा करने में आपकी मदद की ज़रूरत है। <br/><br/>बाईं ओर <strong>'Available Parts'</strong> वाले डिब्बे से घटकों को ऊपर हमारे **Rainwater Harvesting Pipeline** के 4 स्लॉट्स में खींचें। जब आपका डिज़ाइन पूरा हो जाए, तो <strong>"Test My Design"</strong> पर क्लिक करें ताकि हम मिलकर इसका मूल्यांकन कर सकें!`
    });
  }

  evaluateDesign(pipeline: Array<{ id: string; name: string; cost: number } | null>) {
    const intake = pipeline[0];
    const divert = pipeline[1];
    const filter = pipeline[2];
    const recharge = pipeline[3];

    const delay = Math.floor(Math.random() * 300) + 500;
    this.callbacks.onShowTyping();

    setTimeout(() => {
      this.callbacks.onHideTyping();

      // Case: Empty Setup
      if (!intake && !divert && !filter && !recharge) {
        this.callbacks.onAddBubble({
          id: 'eval-' + Date.now(),
          sender: 'ai',
          type: 'hint',
          textEn: "Let's put our heads together, beta! Place the Rooftop Collector in Step 1 to start capturing the rainfall!",
          textHi: "आइए मिलकर सोचते हैं, बेटा! बारिश के पानी को इकट्ठा करना शुरू करने के लिए स्टेप 1 में रूफटॉप कलेक्टर (Rooftop Collector) रखें!"
        });
        return;
      }

      // Case: Direct Connection (No filter, no diverter)
      if (intake && recharge && !divert && !filter) {
        this.callbacks.onUpdateProgress(1);
        this.callbacks.onSaveLayout();
        this.callbacks.onSetMascotState('hint');
        
        this.state.activeTree = 'direct_connection_dust';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['direct_connection_dust'].initial_question;
        this.callbacks.onAddBubble({
          id: 'eval-' + Date.now(),
          sender: 'ai',
          type: 'hint',
          textEn: q.textEn,
          textHi: q.textHi,
          chips: q.chips
        });
        return;
      }

      // Case: No first flush diverter placed (but filter is placed)
      if (intake && filter && recharge && !divert) {
        this.callbacks.onUpdateProgress(2);
        this.callbacks.onSaveLayout();
        this.callbacks.onSetMascotState('hint');
        
        this.state.activeTree = 'first_flush_divert';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['first_flush_divert'].initial_question;
        this.callbacks.onAddBubble({
          id: 'eval-' + Date.now(),
          sender: 'ai',
          type: 'hint',
          textEn: q.textEn,
          textHi: q.textHi,
          chips: q.chips
        });
        return;
      }

      // Case: High tech membrane filter used (budget crash check)
      if (intake && divert && filter && filter.id === 'comp-membrane') {
        this.callbacks.onUpdateProgress(2);
        this.callbacks.onSaveLayout();
        this.callbacks.onSetMascotState('hint');
        
        this.state.activeTree = 'budget_filter_choice';
        this.state.stepIndex = 0;
        this.state.questionCount = 1;
        
        const q = this.challenges['budget_filter_choice'].initial_question;
        this.callbacks.onAddBubble({
          id: 'eval-' + Date.now(),
          sender: 'ai',
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
        
        this.callbacks.onUpdateProgress(3);
        this.callbacks.onSaveLayout();
        this.callbacks.onSetMascotState('success');
        
        this.callbacks.onAddBubble({
          id: 'banner-' + Date.now(),
          sender: 'system',
          type: 'success-banner',
          textEn: "✅ Congratulations! System Designed Successfully!",
          textHi: "✅ बधाई हो! प्रणाली सफलतापूर्वक डिज़ाइन की गई!"
        });
        
        this.callbacks.onAddBubble({
          id: 'success-' + Date.now(),
          sender: 'ai',
          type: 'decompose',
          textEn: "<strong>Incredible work, beta! 🏮✨</strong> You have designed a flawless, low-cost rainwater harvesting recharge system for the village! You bypassed the initial dust, filtered the silt with sand and gravel, and safely recharged the groundwater.<br/><br/>You have mastered **Hydrology & Infrastructure Planning**! +150 XP!",
          textHi: "<strong>शानदार काम, बेटा! 🏮✨</strong> आपने गाँव के लिए एक दोषरहित, कम लागत वाला वर्षा जल संचयन रीचार्ज सिस्टम तैयार किया है! आपने शुरूआती धूल को अलग किया, रेत और बजरी से गाद को छाना और भूजल को सुरक्षित रूप से रीचार्ज किया।<br/><br/>आपने **जल विज्ञान और बुनियादी ढांचा योजना (Hydrology & Infrastructure Planning)** में महारत हासिल की है! +150 XP!"
        });

        this.callbacks.onAwardXP(150);
        this.state.activeTree = null;
        return;
      }

      // Fallback
      this.callbacks.onAddBubble({
        id: 'fallback-' + Date.now(),
        sender: 'ai',
        type: 'hint',
        textEn: "You are experimental, beta! Let's trace the water: it must flow from Rooftop (Step 1) -> First-Flush (Step 2) -> Sand/Gravel Filter (Step 3) -> Recharge Well (Step 4) to ensure absolute purity and cost efficiency. Give that sequence a shot!",
        textHi: "आप बहुत प्रयोग कर रहे हैं, बेटा! आइए पानी के मार्ग को देखें: शुद्धता और कम खर्च के लिए पानी रूफटॉप (स्टेप 1) -> फर्स्ट-फ्लश (स्टेप 2) -> रेत/बजरी फिल्टर (स्टेप 3) -> रीचार्ज कुआं (स्टेप 4) से होकर बहना चाहिए। इस क्रम को एक बार आज़माएं!"
      });
      this.state.activeTree = null;

    }, delay);
  }

  handleStudentMessage(text: string) {
    if (!text.trim()) return;

    this.callbacks.onAddBubble({
      id: 'student-msg-' + Date.now(),
      sender: 'student',
      type: 'chat',
      textEn: text,
      textHi: text
    });

    const delay = Math.floor(Math.random() * 300) + 500;
    this.callbacks.onShowTyping();

    setTimeout(() => {
      this.callbacks.onHideTyping();

      if (!this.state.activeTree) {
        const lc = text.toLowerCase();

        const teachings = [
          {
            keywords: ['what is', 'what are', 'explain', 'tell me', 'how does', 'how do', 'why'],
            fn: () => {
              if (lc.includes('rooftop') || lc.includes('collector') || lc.includes('roof')) {
                return { textEn: "The <strong>Rooftop Collector</strong> is Step 1 — it's the entry point for rainwater. The sloped roof acts like a giant funnel: when rain falls, water runs down and is channelled into our system through gutters and pipes. Without this, we'd have no water to harvest at all! It's placed in <strong>Step 1: Intake</strong>.", textHi: "<strong>रूफटॉप कलेक्टर</strong> स्टेप 1 है — यह वर्षा जल का प्रवेश बिंदु है। ढलान वाली छत एक विशाल फ़नल की तरह काम करती है: जब बारिश होती है, तो पानी नीचे बहता है और गटर और पाइपों के माध्यम से हमारी प्रणाली में प्रवाहित होता है।" };
              }
              if (lc.includes('first flush') || lc.includes('diverter') || lc.includes('first-flush')) {
                return { textEn: "Great question! The <strong>First-Flush Diverter</strong> works like throwing away the first dirty wash water. The very first rain of the season washes all the dust, bird droppings, and leaves from the roof. If that goes straight into the well — yikes! 🤢 The diverter automatically bypasses this first dirty burst and only lets clean water through. Goes in <strong>Step 2: Divert</strong>.", textHi: "<strong>फर्स्ट-फ्लश डाइवर्टर</strong> पहले गंदे पानी को बाहर फेंकने जैसा काम करता है। मौसम की पहली बारिश छत से सारी धूल, पक्षियों की बीट और पत्तों को धो देती है। डाइवर्टर इस पहले गंदे पानी को कुएं से दूर कर देता है।" };
              }
              if (lc.includes('sand') || lc.includes('gravel') || lc.includes('filter')) {
                return { textEn: "The <strong>Sand/Gravel Filter</strong> is our village-friendly purifier! Layers of sand and gravel are incredibly effective at removing silt, fine particles, and some bacteria from water. The best part? Sand and gravel are free from riverbeds — no expensive parts needed. It goes in <strong>Step 3: Filter</strong>. The membrane filter does the same job but costs ₹8,000 vs ₹2,500 for sand/gravel!", textHi: "<strong>रेत/बजरी फ़िल्टर</strong> गाँव के अनुकूल शुद्धिकरण यंत्र है! रेत और बजरी की परतें पानी से गाद और कणों को हटाने में बेहद प्रभावी हैं। और सबसे अच्छी बात? रेत और बजरी नदी तट से मुफ़्त मिलती है!" };
              }
              if (lc.includes('well') || lc.includes('recharge') || lc.includes('groundwater')) {
                return { textEn: "The <strong>Recharge Well Inlet</strong> is the final destination! 🎯 After water is filtered, it enters the recharge well. From here, water slowly percolates down through soil into the underground aquifer — recharging the village's groundwater supply. This is why it's called 'harvesting' — we're replenishing what nature gave us. Goes in <strong>Step 4: Recharge</strong>.", textHi: "<strong>रीचार्ज वेल इनलेट</strong> अंतिम गंतव्य है! फ़िल्टर होने के बाद, पानी रीचार्ज कुएं में प्रवेश करता है और धीरे-धीरे भूमिगत जलभृत में रिसता है, गाँव के भूजल की भरपाई करता है।" };
              }
              if (lc.includes('membrane')) {
                return { textEn: "The <strong>Membrane Filter</strong> is high-tech — it filters at a microscopic level, removing even bacteria. But for this village challenge, it costs ₹8,000 which blows the ₹12,000 budget! 💸 The Sand/Gravel Filter achieves 80% of the same result for ₹2,500. Smart engineering is about working within constraints, not just using the fanciest parts.", textHi: "<strong>मेम्ब्रेन फ़िल्टर</strong> हाई-टेक है लेकिन ₹8,000 में बहुत महंगा है। रेत/बजरी फ़िल्टर केवल ₹2,500 में 80% वही परिणाम देता है। स्मार्ट इंजीनियरिंग सीमाओं के भीतर काम करने के बारे में है।" };
              }
              if (lc.includes('rainwater') || lc.includes('harvesting') || lc.includes('water cycle')) {
                return { textEn: "Rainwater harvesting is the practice of collecting and storing rainwater before it runs off or evaporates. Here's the flow: ☁️ Rain falls → 🏠 Rooftop collects it → 🔀 First-Flush diverts the dirty first wash → 🪨 Sand/Gravel filters the silt → 🌊 Clean water recharges the underground well. India gets 80% of its annual rainfall in just 3 monsoon months — harvesting it makes all the difference for villages!", textHi: "वर्षा जल संचयन बारिश के पानी को इकट्ठा करने और संग्रहित करने की प्रथा है। भारत अपनी 80% वार्षिक वर्षा केवल 3 मानसून महीनों में प्राप्त करता है — इसे संरक्षित करना गाँवों के लिए महत्वपूर्ण है!" };
              }
              if (lc.includes('pipes') || lc.includes('conduit')) {
                return { textEn: "The <strong>Conduit Pipes</strong> are the connective tissue of the system — they transport water from one component to the next. Think of them as the roads between stations! Without pipes, your rooftop collector has nowhere to send its water. They're used between every major component in the pipeline.", textHi: "<strong>कंड्यूट पाइप</strong> सिस्टम की कनेक्टिव टिशू हैं — वे पानी को एक घटक से दूसरे घटक तक ले जाती हैं।" };
              }
              return { textEn: `Good question, beta! Let me think about "<em>${this.escapeHtml(text)}</em>"... Try asking me about any specific component or drag components to the pipeline above and click <strong>Test My Design</strong> to get Socratic feedback.`, textHi: `अच्छा सवाल, बेटा! किसी भी घटक के बारे में पूछें या पाइपलाइन में घटक खींचें और <strong>Test My Design</strong> दबाएं।` };
            }
          },
          {
            keywords: ['why', 'should i', 'which', 'what should', 'which one', 'suggest'],
            fn: () => ({ textEn: "Here's how to think about it, beta! 🤔 The correct pipeline order is: <strong>1. Rooftop Collector</strong> (catches rain) → <strong>2. First-Flush Diverter</strong> (throws away the first dirty water) → <strong>3. Sand/Gravel Filter</strong> (removes silt cheaply) → <strong>4. Recharge Well Inlet</strong> (replenishes groundwater). Try building it on the canvas and hit <strong>Test My Design</strong>!", textHi: "सही पाइपलाइन क्रम है: रूफटॉप कलेक्टर → फर्स्ट-फ्लश डाइवर्टर → रेत/बजरी फ़िल्टर → रीचार्ज वेल इनलेट।" })
          },
          {
            keywords: ['help', 'stuck', 'dont know', "don't know", 'lost', 'confused', 'idk'],
            fn: () => ({ textEn: "No worries, beta! 🌱 Here's your starter guide:\n\n• <strong>Step 1 (Intake)</strong>: Drag the <strong>Rooftop Collector</strong> — it catches rainwater\n• <strong>Step 2 (Divert)</strong>: Drag the <strong>First-Flush Diverter</strong> — removes dirty first rain\n• <strong>Step 3 (Filter)</strong>: Drag the <strong>Sand/Gravel Filter</strong> — cleans the water cheaply\n• <strong>Step 4 (Recharge)</strong>: Drag the <strong>Well Inlet</strong> — sends it underground\n\nThen click <strong>Test My Design →</strong> and I'll guide you with Socratic questions!", textHi: "कोई बात नहीं, बेटा! स्टेप 1 में रूफटॉप कलेक्टर, स्टेप 2 में फर्स्ट-फ्लश डाइवर्टर, स्टेप 3 में रेत/बजरी फ़िल्टर, और स्टेप 4 में वेल इनलेट रखें। फिर Test My Design दबाएं!" })
          },
          {
            keywords: ['okay', 'ok', 'got it', 'thanks', 'thank you', 'understood', 'cool'],
            fn: () => ({ textEn: "Great! 🎯 Now try applying that on the canvas above. Drag the components into the right slots and when you're ready, hit <strong>Test My Design →</strong> so I can evaluate your solution with Socratic questions!", textHi: "शानदार! ऊपर कैनवास पर घटकों को सही स्लॉट में खींचें और जब तैयार हों, <strong>Test My Design</strong> दबाएं!" })
          }
        ];

        for (const t of teachings) {
          if (t.keywords.some(k => lc.includes(k))) {
            const resp = t.fn();
            this.callbacks.onAddBubble({
              id: 'teach-' + Date.now(),
              sender: 'ai',
              type: 'decompose',
              ...resp
            });
            return;
          }
        }

        // Final fallback
        this.callbacks.onAddBubble({
          id: 'help-fallback-' + Date.now(),
          sender: 'ai',
          type: 'hint',
          textEn: `You said: "<em>${this.escapeHtml(text)}</em>" — I'm your Rainwater Harvesting guide! Ask me anything about the components, how water filtration works, or why we need each step. Or try dragging parts into the pipeline above and click <strong>Test My Design →</strong> to start a Socratic learning session!`,
          textHi: `आप कह रहे हैं: "<em>${this.escapeHtml(text)}</em>" — किसी भी घटक के बारे में पूछें या पाइपलाइन में घटक रखें और <strong>Test My Design</strong> दबाएं!`
        });
        return;
      }

      const activeTreeName = this.state.activeTree;
      const tree = this.challenges[activeTreeName];
      const steps = tree.steps;
      
      // Strict 4 questions loop cap
      if (this.state.questionCount >= 4) {
        this.callbacks.onAddBubble({
          id: 'simplify-' + Date.now(),
          sender: 'ai',
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
        matchesKeywords = currentStep.keywords.some((kw: string) => normalizedText.includes(kw));
      }
      if (currentStep.chips && currentStep.chips[0] && normalizedText.includes(currentStep.chips[0].toLowerCase())) {
        matchesKeywords = true;
      }

      if (matchesKeywords) {
        this.state.stepIndex++;
        this.state.questionCount++;
        
        if (this.state.stepIndex < steps.length) {
          const nextStep = steps[this.state.stepIndex];
          this.callbacks.onAddBubble({
            id: 'step-' + Date.now(),
            sender: 'ai',
            type: 'decompose',
            textEn: nextStep.questionEn || nextStep.question,
            textHi: nextStep.questionHi || nextStep.questionEn || nextStep.question,
            chips: nextStep.chips
          });
        } else {
          // Finished Socratic path
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
          
          this.callbacks.onAddBubble({
            id: 'sol-' + Date.now(),
            sender: 'ai',
            type: 'decompose',
            textEn: solEn,
            textHi: solHi
          });
          this.state.activeTree = null;
        }
      } else {
        this.state.questionCount++;
        
        if (this.state.questionCount >= 4) {
          this.callbacks.onAddBubble({
            id: 'simplify-' + Date.now(),
            sender: 'ai',
            type: 'hint',
            textEn: `<strong>Let's simplify this, beta! 💡</strong> Here is exactly how we can wire it:<br/><br/>${tree.fallbackEn || tree.fallback_visual_description}`,
            textHi: `<strong>इसे आसान बनाते हैं, बेटा! 💡</strong> इसे हमें बिल्कुल इस तरह जोड़ना है:<br/><br/>${tree.fallbackHi || tree.fallbackEn}`
          });
          this.state.activeTree = null;
        } else {
          this.callbacks.onAddBubble({
            id: 'hint-retry-' + Date.now(),
            sender: 'ai',
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
      this.callbacks.onOpenReflectionModal();
      return;
    }

    this.callbacks.onShowTyping();
    this.callbacks.onSetMascotState('hint');
    
    setTimeout(() => {
      this.callbacks.onHideTyping();
      this.callbacks.onAddBubble({
        id: 'nudge-' + Date.now(),
        sender: 'ai',
        type: 'hint',
        textEn: "A gentle nudge, beta! 💡 The water should pass through a filter of sand and gravel before entering the recharge well. Make sure you place the <strong>Sand/Gravel Filter</strong> in Step 3!",
        textHi: "एक हल्का संकेत, बेटा! 💡 पानी को रीचार्ज कुएं में प्रवेश करने से पहले रेत और बजरी के फिल्टर से गुजरना चाहिए। सुनिश्चित करें कि आप <strong>Sand/Gravel Filter</strong> को स्टेप 3 में रखें!"
      });
    }, 1000);
  }

  submitReflection(text: string) {
    this.state.hintCounter = 0; // reset hint count
    this.callbacks.onAddBubble({
      id: 'reflection-response-' + Date.now(),
      sender: 'ai',
      type: 'hint',
      textEn: "Thank you for reflecting, beta! Your hints are now unlocked. Remember: learning is a journey, not a race. You've got this! 🌱",
      textHi: "चिंतन करने के लिए धन्यवाद, बेटा! आपके संकेत अब अनलॉक हो गए हैं। याद रखें: सीखना एक यात्रा है, दौड़ नहीं। आप यह कर सकते हैं! 🌱"
    });
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
