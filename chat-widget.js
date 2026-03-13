/* ============================================================
   Meet Shah — AI Portfolio Chat Widget
   Drop this <script> tag at the bottom of any portfolio page.
   Requires: nothing. Self-contained.
   ============================================================ */

(function () {
  // ── STYLES ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

    #ms-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #C4552A;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(196,85,42,0.45);
      z-index: 9999;
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
    }
    #ms-chat-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(196,85,42,0.6);
    }
    #ms-chat-btn svg { transition: transform 0.3s ease; }
    #ms-chat-btn.open svg { transform: rotate(90deg); }

    #ms-chat-bubble {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 380px;
      max-height: 560px;
      background: #FFFFF8;
      border-radius: 20px;
      box-shadow: 0 12px 48px rgba(26,22,18,0.18), 0 2px 8px rgba(26,22,18,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      font-family: 'DM Sans', sans-serif;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(.34,1.56,.64,1);
    }
    #ms-chat-bubble.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .ms-chat-header {
      background: #1A1612;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ms-chat-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #C4552A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      color: white;
      flex-shrink: 0;
      font-family: 'DM Sans', sans-serif;
    }
    .ms-chat-header-info { flex: 1; }
    .ms-chat-header-name {
      color: #F5F0E8;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .ms-chat-header-status {
      color: #6B5F52;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .ms-chat-header-status::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }

    .ms-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 380px;
      background: #F5F0E8;
    }
    .ms-chat-messages::-webkit-scrollbar { width: 4px; }
    .ms-chat-messages::-webkit-scrollbar-track { background: transparent; }
    .ms-chat-messages::-webkit-scrollbar-thumb { background: #E8A98A; border-radius: 4px; }

    .ms-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.5;
      animation: ms-pop 0.2s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes ms-pop {
      from { opacity: 0; transform: scale(0.92) translateY(6px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .ms-msg.bot {
      background: #FFFFF8;
      color: #1A1612;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(26,22,18,0.08);
    }
    .ms-msg.user {
      background: #C4552A;
      color: white;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }

    .ms-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: #FFFFF8;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(26,22,18,0.08);
    }
    .ms-typing span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #C4552A;
      animation: ms-bounce 1.2s infinite;
    }
    .ms-typing span:nth-child(2) { animation-delay: 0.2s; }
    .ms-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ms-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    .ms-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 8px;
      background: #F5F0E8;
    }
    .ms-suggestion-chip {
      background: #FFFFF8;
      border: 1px solid #E8A98A;
      color: #1A1612;
      font-size: 12px;
      padding: 5px 11px;
      border-radius: 20px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap;
    }
    .ms-suggestion-chip:hover {
      background: #C4552A;
      border-color: #C4552A;
      color: white;
    }

    .ms-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #FFFFF8;
      border-top: 1px solid rgba(26,22,18,0.08);
    }
    .ms-chat-input {
      flex: 1;
      background: #F5F0E8;
      border: 1.5px solid transparent;
      border-radius: 24px;
      padding: 9px 16px;
      font-size: 13.5px;
      font-family: 'DM Sans', sans-serif;
      color: #1A1612;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }
    .ms-chat-input:focus { border-color: #C4552A; }
    .ms-chat-input::placeholder { color: #6B5F52; }
    .ms-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #C4552A;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
      align-self: flex-end;
    }
    .ms-send-btn:hover { background: #a8441f; transform: scale(1.05); }
    .ms-send-btn:disabled { background: #E8A98A; cursor: not-allowed; transform: none; }

    @media (max-width: 480px) {
      #ms-chat-bubble { width: calc(100vw - 32px); right: 16px; bottom: 84px; }
      #ms-chat-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'ms-chat-btn';
  btn.title = 'Chat with Meet\'s Portfolio';
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white"/>
    </svg>`;

  const bubble = document.createElement('div');
  bubble.id = 'ms-chat-bubble';
  bubble.innerHTML = `
    <div class="ms-chat-header">
      <div class="ms-chat-avatar">MS</div>
      <div class="ms-chat-header-info">
        <div class="ms-chat-header-name">Meet's Portfolio Assistant</div>
        <div class="ms-chat-header-status">Online — ask me anything</div>
      </div>
    </div>
    <div class="ms-chat-messages" id="ms-messages"></div>
    <div class="ms-suggestions" id="ms-suggestions"></div>
    <div class="ms-chat-input-row">
      <input class="ms-chat-input" id="ms-input" type="text" placeholder="Ask about Meet's work..." maxlength="300" />
      <button class="ms-send-btn" id="ms-send" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/>
        </svg>
      </button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(bubble);

  // ── SYSTEM PROMPT ───────────────────────────────────────────
  const SYSTEM = `You are the portfolio assistant for Meet Shah, a UX/UI designer. You speak on his behalf in a friendly, conversational tone with a dash of dry wit and sarcasm — but never rude, never arrogant, never undermining to the person you're talking to. Think: helpful colleague who's also quietly the funniest person in the room.

ABOUT MEET:
Meet is a UX/UI designer based in Dublin with an MSc in HCI from UCD — he studied how humans interact with technology, which basically means he has no excuse for bad UX. He's worked across HealthTech and EdTech, designing everything from clinical risk dashboards used by actual doctors under pressure, to platforms helping students access educational resources. He moves comfortably between sticky notes and Figma, between a user interview and a pixel-perfect prototype — without making it weird. He's led design in team settings, gets along with developers, and somehow manages to care deeply about 8px of spacing without being insufferable about it. He uses AI in his process the way most people use coffee — practically and without overthinking it. Sarcasm is a second language. Good design is the first.

CASE STUDIES:
1. ARK — Healthcare Risk Assessment Platform (HealthTech, Enterprise)
   - Redesigned a legacy clinical dashboard for healthcare professionals (nurses, admins, doctors)
   - 14-week project, led by Meet as Lead UX/UI Designer alongside 2 designers + 2 researchers
   - Process: discovery, user interviews, journey mapping, wireframes, prototyping in Figma
   - Key challenge: high-stakes environment where bad UX literally affects patient care
   - Outcome: cleaner decision-making interface, reduced cognitive load for clinical staff

2. Aiducate — Educational Resource Platform (EdTech)
   - Platform connecting teachers, providers, and admins around educational resources
   - 8-week project, 3 designers, Meet as Lead UX Designer
   - Three distinct user types (teachers, providers, admins) each with different needs
   - Heavy research phase, distinct design system, role-specific dashboards

3. UniCare — Campus Healthcare Platform (HealthTech, Mobile-first)
   - Healthcare app for university students — appointment booking, mental health, nutrition
   - 6-week project, 3 designers + 1 research lead
   - Personas: Dara & John (students with very different healthcare needs)
   - Features: registration, appointment booking, calendar, mental health doctors, nutrition plans

SKILLS & TOOLS:
Figma (expert), UX Research, User Interviews, Journey Mapping, Wireframing, Prototyping, Design Systems, Usability Testing, Notion, Miro, Photoshop, Illustrator, HTML/CSS (working knowledge), AI-integrated design workflows

EDUCATION:
MSc Human-Computer Interaction — University College Dublin (UCD), 2024
Based in Dublin, Ireland. Originally from outside Ireland.

AVAILABILITY:
Actively looking for UX/UI roles. Open to full-time, part-time, freelance, remote — anywhere in the world. Yes, anywhere. He means it.

RULES — NEVER:
- Discuss salary expectations or numbers
- Reveal which companies he has applied to or plans to apply to
- Share personal details beyond professional background
- Be rude, arrogant, or dismissive to the user
- Make up projects or skills not listed above

TONE GUIDE:
- Warm and helpful first, witty second
- A little sarcasm is fine, mean-spirited is not
- Keep answers concise — recruiters are busy humans, not Wikipedia readers
- If you don't know something, say so honestly rather than guessing`;

  // ── STATE ───────────────────────────────────────────────────
  let history = [];
  let isOpen = false;
  let isLoading = false;
  let greeted = false;

  const SUGGESTIONS = [
    "Tell me about Meet 👋",
    "What's his strongest project?",
    "What tools does he use?",
    "Is he available for work?",
    "What makes him different?",
  ];

  // ── HELPERS ─────────────────────────────────────────────────
  function scrollToBottom() {
    const msgs = document.getElementById('ms-messages');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addMessage(text, role) {
    const msgs = document.getElementById('ms-messages');
    const div = document.createElement('div');
    div.className = `ms-msg ${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const msgs = document.getElementById('ms-messages');
    const div = document.createElement('div');
    div.className = 'ms-typing';
    div.id = 'ms-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeTyping() {
    const t = document.getElementById('ms-typing-indicator');
    if (t) t.remove();
  }

  function renderSuggestions(chips) {
    const container = document.getElementById('ms-suggestions');
    container.innerHTML = '';
    chips.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'ms-suggestion-chip';
      chip.textContent = text;
      chip.onclick = (e) => { e.stopPropagation(); sendMessage(text); };
      container.appendChild(chip);
    });
  }

  function clearSuggestions() {
    document.getElementById('ms-suggestions').innerHTML = '';
  }

  // ── SEND ────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;
    clearSuggestions();

    const input = document.getElementById('ms-input');
    const sendBtn = document.getElementById('ms-send');
    input.value = '';

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    const typing = showTyping();

    try {
      const res = await fetch('https://api.meetdesignsit.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "fuck";

      removeTyping();
      addMessage(reply, 'bot');
      history.push({ role: 'assistant', content: reply });

    } catch (err) {
      removeTyping();
      addMessage("Something went wrong on my end. Meet would be embarrassed. Try again?", 'bot');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── TOGGLE ──────────────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    bubble.classList.toggle('visible', isOpen);

    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage("Hey! 👋 I'm Meet's portfolio assistant — basically his hype person, but make it professional. Ask me anything about his work, skills, or background.", 'bot');
        renderSuggestions(SUGGESTIONS);
      }, 200);
    }
  }

  // ── EVENTS ──────────────────────────────────────────────────
  btn.addEventListener('click', toggleChat);

  document.getElementById('ms-send').addEventListener('click', () => {
    const val = document.getElementById('ms-input').value.trim();
    sendMessage(val);
  });

  document.getElementById('ms-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const val = e.target.value.trim();
      sendMessage(val);
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!isOpen) return;
    if (btn.contains(e.target)) return;
    if (bubble.contains(e.target)) return;
    toggleChat();
  }, true);

})();
