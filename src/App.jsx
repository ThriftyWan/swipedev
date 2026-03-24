import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Unbounded:wght@400;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #07080f;
    --surface: #0e1020;
    --surface2: #161829;
    --border: #1e2240;
    --accent: #ff2d6b;
    --accent2: #00e5a0;
    --accent3: #7b5ea7;
    --text: #e8eaf6;
    --text-muted: #6b7094;
    --yes: #00e5a0;
    --no: #ff2d6b;
    --code-bg: #0a0b15;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Space Mono', monospace; overflow: hidden; height: 100vh; }

  .app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    gap: 0;
  }

  /* HEADER */
  .header {
    grid-column: 1 / -1;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--surface);
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255,45,107,0.05) 0%, transparent 50%, rgba(0,229,160,0.05) 100%);
    pointer-events: none;
  }
  .logo {
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 18px;
    background: linear-gradient(135deg, var(--accent), #ff8c42, var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }
  .header-prompt {
    flex: 1;
    font-size: 12px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header-prompt span {
    color: var(--accent2);
    font-weight: 700;
  }
  .stage-badge {
    font-family: 'Unbounded', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* LEFT PANEL - Cards */
  .card-panel {
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-right: 1px solid var(--border);
    padding: 20px;
    gap: 16px;
  }
  .card-panel::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,45,107,0.04) 0%, transparent 70%);
    top: -200px; left: -200px;
    pointer-events: none;
  }
  .card-panel::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
  }

  /* STAGE DESCRIPTION */
  .stage-description {
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
    max-width: 340px;
    line-height: 1.6;
    z-index: 2;
    position: relative;
  }
  .stage-description strong {
    color: var(--accent2);
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
  }

  /* CARD STACK */
  .card-stack {
    position: relative;
    width: 340px;
    height: 380px;
    z-index: 2;
    flex-shrink: 0;
  }
  .code-card {
    position: absolute;
    inset: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    cursor: grab;
    transition: transform 0.08s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  .code-card:active { cursor: grabbing; }
  .code-card.dragging { transition: none; }
  .code-card.animate-out-right {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease !important;
    transform: translateX(150%) rotate(20deg) !important;
    opacity: 0 !important;
  }
  .code-card.animate-out-left {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease !important;
    transform: translateX(-150%) rotate(-20deg) !important;
    opacity: 0 !important;
  }
  .code-card:nth-child(2) { transform: scale(0.96) translateY(8px); z-index: 1; filter: brightness(0.7); }
  .code-card:nth-child(3) { transform: scale(0.92) translateY(16px); z-index: 0; filter: brightness(0.5); }

  .card-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
    flex-shrink: 0;
  }
  .card-approach {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .approach-badge {
    font-size: 9px;
    font-weight: 700;
    font-family: 'Unbounded', sans-serif;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .approach-badge.a1 { background: rgba(255,45,107,0.15); color: #ff2d6b; border: 1px solid rgba(255,45,107,0.3); }
  .approach-badge.a2 { background: rgba(0,229,160,0.15); color: #00e5a0; border: 1px solid rgba(0,229,160,0.3); }
  .approach-badge.a3 { background: rgba(123,94,167,0.2); color: #b08fe8; border: 1px solid rgba(123,94,167,0.3); }

  .card-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
  }
  .card-desc {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 3px;
    line-height: 1.5;
    font-style: italic;
  }

  .card-code {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .card-code pre {
    padding: 12px 14px;
    font-size: 10.5px;
    line-height: 1.65;
    color: #a9b1d6;
    overflow: hidden;
    height: 100%;
    background: var(--code-bg);
    font-family: 'Space Mono', monospace;
    white-space: pre;
  }
  .card-code::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 40px;
    background: linear-gradient(transparent, var(--code-bg));
    pointer-events: none;
  }

  /* Drag feedback overlays */
  .swipe-feedback {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: 2px;
  }
  .swipe-feedback.yes {
    background: rgba(0,229,160,0.12);
    border: 3px solid var(--yes);
    color: var(--yes);
    transform: rotate(-8deg);
  }
  .swipe-feedback.no {
    background: rgba(255,45,107,0.12);
    border: 3px solid var(--no);
    color: var(--no);
    transform: rotate(8deg);
  }

  /* ACTION BUTTONS */
  .action-buttons {
    display: flex;
    gap: 24px;
    align-items: center;
    z-index: 2;
    position: relative;
  }
  .action-btn {
    width: 54px; height: 54px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
  }
  .action-btn:hover { transform: scale(1.1); }
  .action-btn:active { transform: scale(0.95); }
  .action-btn.nope {
    background: rgba(255,45,107,0.1);
    border: 2px solid rgba(255,45,107,0.4);
    color: var(--no);
    box-shadow: 0 0 20px rgba(255,45,107,0.15);
  }
  .action-btn.nope:hover { box-shadow: 0 0 30px rgba(255,45,107,0.3); border-color: var(--no); }
  .action-btn.yep {
    background: rgba(0,229,160,0.1);
    border: 2px solid rgba(0,229,160,0.4);
    color: var(--yes);
    box-shadow: 0 0 20px rgba(0,229,160,0.15);
  }
  .action-btn.yep:hover { box-shadow: 0 0 30px rgba(0,229,160,0.3); border-color: var(--yes); }
  .action-btn.skip {
    width: 40px; height: 40px;
    font-size: 16px;
    background: rgba(255,255,255,0.03);
    border: 2px solid var(--border);
    color: var(--text-muted);
  }

  /* Cards remaining indicator */
  .cards-remaining {
    display: flex;
    gap: 5px;
    z-index: 2;
  }
  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border);
    transition: background 0.2s;
  }
  .dot.active { background: var(--accent2); }

  /* RIGHT PANEL - Editor */
  .editor-panel {
    background: var(--bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .editor-header {
    padding: 10px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .editor-dots { display: flex; gap: 5px; }
  .editor-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }
  .d1 { background: #ff5f57; }
  .d2 { background: #febc2e; }
  .d3 { background: #28c840; }
  .editor-title {
    font-size: 11px;
    color: var(--text-muted);
    margin-left: 6px;
    flex: 1;
  }
  .editor-title span { color: var(--accent2); }
  .line-count {
    font-size: 10px;
    color: var(--text-muted);
    font-style: italic;
  }
  .editor-body {
    flex: 1;
    overflow: auto;
    position: relative;
  }
  .editor-body::-webkit-scrollbar { width: 4px; }
  .editor-body::-webkit-scrollbar-track { background: transparent; }
  .editor-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .editor-content {
    display: flex;
    min-height: 100%;
  }
  .line-numbers {
    padding: 16px 0;
    width: 36px;
    text-align: right;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.65;
    border-right: 1px solid var(--border);
    flex-shrink: 0;
    background: var(--surface);
    padding-right: 8px;
    opacity: 0.5;
    user-select: none;
  }
  .editor-code {
    flex: 1;
    padding: 16px 16px;
    font-size: 11px;
    line-height: 1.65;
    color: #a9b1d6;
    font-family: 'Space Mono', monospace;
    white-space: pre;
    overflow-x: auto;
  }
  .editor-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    pointer-events: none;
  }
  .editor-empty .empty-icon {
    font-size: 36px;
    opacity: 0.3;
  }
  .new-block-line {
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent2), transparent);
    margin: 8px 0;
    animation: pulse 1.5s ease-in-out;
  }
  @keyframes pulse {
    0% { opacity: 0; transform: scaleX(0); }
    50% { opacity: 1; transform: scaleX(1); }
    100% { opacity: 1; transform: scaleX(1); }
  }

  /* PROMPT SCREEN */
  .prompt-screen {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  .prompt-screen::before {
    content: '';
    position: absolute;
    width: 80vw; height: 80vw;
    background: radial-gradient(circle, rgba(255,45,107,0.06) 0%, transparent 60%);
    top: -30vw; left: -10vw;
  }
  .prompt-screen::after {
    content: '';
    position: absolute;
    width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 60%);
    bottom: -20vw; right: -10vw;
  }
  .prompt-hero {
    text-align: center;
    z-index: 2;
  }
  .prompt-hero h1 {
    font-family: 'Unbounded', sans-serif;
    font-size: 36px;
    font-weight: 900;
    background: linear-gradient(135deg, var(--accent), #ff8c42, var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    margin-bottom: 12px;
  }
  .prompt-hero p {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.7;
    max-width: 440px;
    margin: 0 auto;
  }
  .prompt-hero p em {
    color: var(--accent2);
    font-style: normal;
    font-weight: 700;
  }
  .prompt-form {
    width: 100%;
    max-width: 540px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .prompt-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    color: var(--text);
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    resize: none;
    outline: none;
    line-height: 1.6;
    transition: border-color 0.2s;
    min-height: 100px;
  }
  .prompt-input:focus { border-color: var(--accent2); }
  .prompt-input::placeholder { color: var(--text-muted); }
  .prompt-submit {
    background: linear-gradient(135deg, var(--accent), #c02050);
    border: none;
    border-radius: 12px;
    padding: 14px 28px;
    color: #fff;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 24px rgba(255,45,107,0.3);
  }
  .prompt-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 32px rgba(255,45,107,0.4); }
  .prompt-submit:active { transform: translateY(0); }
  .prompt-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .examples {
    z-index: 2;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 540px;
  }
  .example-chip {
    font-size: 10px;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Space Mono', monospace;
  }
  .example-chip:hover { border-color: var(--accent2); color: var(--accent2); }

  /* LOADING */
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(7,8,15,0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--accent2);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
  }
  .loading-text span {
    color: var(--accent2);
    font-weight: 700;
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
  }

  /* NO MORE CARDS */
  .no-more-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 2;
    text-align: center;
  }
  .no-more-icon { font-size: 40px; opacity: 0.5; }
  .no-more-text { font-size: 12px; color: var(--text-muted); line-height: 1.6; }
  .regenerate-btn {
    background: rgba(123,94,167,0.15);
    border: 1px solid rgba(123,94,167,0.4);
    color: #b08fe8;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .regenerate-btn:hover { background: rgba(123,94,167,0.25); }

  /* SYNTAX HIGHLIGHTING */
  .kw { color: #bb9af7; }
  .fn { color: #7aa2f7; }
  .str { color: #9ece6a; }
  .num { color: #ff9e64; }
  .cmt { color: #565f89; font-style: italic; }
  .op { color: #89ddff; }
  .cls { color: #e0af68; }
`;

function highlight(code) {
  if (!code) return '';
  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(\/\/.*?)(\n|$)/g, '<span class="cmt">$1</span>$2')
    .replace(/\b(const|let|var|function|class|return|if|else|for|while|do|import|export|default|from|async|await|new|typeof|instanceof|this|super|extends|yield|try|catch|throw|of|in|switch|case|break|continue|=>)\b/g, '<span class="kw">$1</span>')
    .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="cls">$1</span>')
    .replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>')
    .replace(/"([^"]*)"/g, '<span class="str">"$1"</span>')
    .replace(/'([^']*)'/g, '<span class="str">\'$1\'</span>')
    .replace(/`([^`]*)`/g, '<span class="str">`$1`</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>');
}

const EXAMPLES = [
  "A todo list app",
  "Snake game",
  "Password generator",
  "Fibonacci sequence",
  "Simple REST API",
];

const APPROACH_LABELS = [
  ["a1", "⚡ Functional"],
  ["a2", "🏗️ OOP Style"],
  ["a3", "✨ One-liner"],
];

export default function App() {
  const [screen, setScreen] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState(0);
  const [stageDesc, setStageDesc] = useState("");
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [acceptedCode, setAcceptedCode] = useState("");
  const [newBlockAdded, setNewBlockAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);
  const [dragState, setDragState] = useState({ dragging: false, x: 0, y: 0, startX: 0, startY: 0 });
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }
  }, [acceptedCode]);

  async function generateOptions(userPrompt, currentCode, stageNum) {
    setLoading(true);
    try {
      const systemPrompt = `You are a creative coding assistant generating swipeable code options for a "Tinder for coding" app. 
Return ONLY valid JSON, no markdown fences, no explanation, just raw JSON.

The user wants to build: "${userPrompt}"

You generate exactly 3 code options for the NEXT stage of implementation.
Each option should use a DISTINCTLY different approach, style, or coding pattern.
Make them genuinely different - functional vs OOP vs one-liner/shorthand, different algorithms, etc.
Keep each code snippet focused on ONE stage/step, not the entire program.

Return this exact JSON structure:
{
  "stage_description": "Short description of what this stage implements (max 10 words)",
  "options": [
    {
      "id": 1,
      "title": "Short title for this approach (max 5 words)",
      "approach": "Style label (e.g. Functional, OOP, Compact, Recursive, Imperative, Declarative, ES6+, Classic, etc.)",
      "description": "One sentence explaining this specific approach",
      "code": "the actual code snippet (use \\n for newlines, keep under 20 lines)"
    },
    ...
  ]
}`;

      const userMsg = currentCode
        ? `Stage ${stageNum + 1}. Current accepted code so far:\n\`\`\`\n${currentCode}\n\`\`\`\n\nGenerate 3 options for the NEXT stage to build upon this.`
        : `Stage 1. Generate 3 different starting options (setup/initialization/structure) for this project.`;

      // ✅ Calls your Vercel proxy instead of Anthropic directly
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }]
        })
      });

      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setStageDesc(parsed.stage_description || `Stage ${stageNum + 1}`);
      setCards(parsed.options || []);
      setCurrentCardIndex(0);
      setSwipeDir(null);
    } catch (e) {
      console.error(e);
      setStageDesc("Setup & Initialize");
      setCards([
        { id: 1, title: "Try Again?", approach: "Error", description: "Something went wrong. Try regenerating.", code: "// Error loading options\n// Please try again" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    if (!prompt.trim()) return;
    setScreen("swipe");
    setStage(0);
    setAcceptedCode("");
    await generateOptions(prompt.trim(), "", 0);
  }

  function handleSwipe(direction) {
    if (loading || currentCardIndex >= cards.length) return;
    const card = cards[currentCardIndex];
    setSwipeDir(direction);

    setTimeout(async () => {
      if (direction === "right") {
        const newCode = acceptedCode
          ? acceptedCode + "\n\n// --- Stage " + (stage + 1) + " ---\n" + card.code
          : "// --- Stage 1 ---\n" + card.code;
        setAcceptedCode(newCode);
        setNewBlockAdded(true);
        setTimeout(() => setNewBlockAdded(false), 1500);

        const nextStage = stage + 1;
        setStage(nextStage);
        setSwipeDir(null);
        setCards([]);
        await generateOptions(prompt, newCode, nextStage);
      } else {
        const next = currentCardIndex + 1;
        setCurrentCardIndex(next);
        setSwipeDir(null);
      }
    }, 380);
  }

  async function handleRegenerate() {
    await generateOptions(prompt, acceptedCode, stage);
  }

  function onMouseDown(e) {
    setDragState({ dragging: true, x: 0, y: 0, startX: e.clientX, startY: e.clientY });
  }
  function onMouseMove(e) {
    if (!dragState.dragging) return;
    setDragState(d => ({ ...d, x: e.clientX - d.startX, y: e.clientY - d.startY }));
  }
  function onMouseUp() {
    if (!dragState.dragging) return;
    const threshold = 80;
    if (dragState.x > threshold) handleSwipe("right");
    else if (dragState.x < -threshold) handleSwipe("left");
    setDragState({ dragging: false, x: 0, y: 0, startX: 0, startY: 0 });
  }

  const currentCard = cards[currentCardIndex];
  const hasNoMoreCards = !loading && currentCardIndex >= cards.length && cards.length > 0;

  const dragTransform = dragState.dragging && currentCard
    ? `translateX(${dragState.x}px) translateY(${dragState.y * 0.3}px) rotate(${dragState.x * 0.04}deg)`
    : undefined;

  const dragYesFeedback = dragState.x > 40 ? Math.min((dragState.x - 40) / 60, 1) : 0;
  const dragNoFeedback = dragState.x < -40 ? Math.min((-dragState.x - 40) / 60, 1) : 0;

  const editorLines = acceptedCode ? acceptedCode.split('\n') : [];

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="app"
        style={{ gridTemplateRows: screen === "prompt" ? "1fr" : "auto 1fr" }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {screen === "prompt" ? (
          <div className="prompt-screen">
            <div className="prompt-hero">
              <h1>SWIPE TO CODE</h1>
              <p>
                Describe what you want to build. We'll generate <em>multiple approaches</em> for each step.
                Swipe right on the ones you vibe with. Build your app one swipe at a time. 💘
              </p>
            </div>
            <div className="prompt-form">
              <textarea
                className="prompt-input"
                placeholder="What do you want to build? e.g. 'A todo list app in JavaScript'"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && e.metaKey && handleStart()}
              />
              <button className="prompt-submit" onClick={handleStart} disabled={!prompt.trim()}>
                Find My Code Match ❤️
              </button>
            </div>
            <div className="examples">
              {EXAMPLES.map(ex => (
                <span key={ex} className="example-chip" onClick={() => setPrompt(ex)}>{ex}</span>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="header">
              <div className="logo">SWIPEDEV</div>
              <div className="header-prompt">Building: <span>{prompt}</span></div>
              <div className="stage-badge">Stage {stage + 1}</div>
            </div>

            <div className="card-panel">
              {loading && (
                <div className="loading-overlay" style={{ position: 'absolute', borderRadius: 0 }}>
                  <div className="spinner" />
                  <div className="loading-text">
                    <span>Generating options...</span>
                    AI is cooking up stage {stage + 1} 🍳
                  </div>
                </div>
              )}

              {!loading && stageDesc && (
                <div className="stage-description">
                  <strong>📍 {stageDesc}</strong>
                  Swipe right to accept • Swipe left to skip
                </div>
              )}

              {!loading && !hasNoMoreCards && cards.length > 0 && (
                <>
                  <div className="card-stack">
                    {cards.slice(currentCardIndex).reverse().map((card, i) => {
                      const isTop = i === cards.slice(currentCardIndex).length - 1;
                      const approachInfo = APPROACH_LABELS[cards.indexOf(card) % 3];

                      let cardStyle = {};
                      let cardClass = "code-card";

                      if (isTop) {
                        if (dragState.dragging && dragTransform) {
                          cardStyle = { transform: dragTransform, zIndex: 10 };
                          cardClass += " dragging";
                        }
                        if (swipeDir === "right") cardClass += " animate-out-right";
                        if (swipeDir === "left") cardClass += " animate-out-left";
                      }

                      return (
                        <div
                          key={card.id}
                          className={cardClass}
                          style={cardStyle}
                          onMouseDown={isTop ? onMouseDown : undefined}
                        >
                          {isTop && (
                            <>
                              <div className="swipe-feedback yes" style={{ opacity: dragYesFeedback }}>MATCH ✓</div>
                              <div className="swipe-feedback no" style={{ opacity: dragNoFeedback }}>NOPE ✗</div>
                            </>
                          )}
                          <div className="card-header">
                            <div className="card-approach">
                              <span className={`approach-badge ${approachInfo?.[0]}`}>{approachInfo?.[1]} {card.approach}</span>
                            </div>
                            <div className="card-title">{card.title}</div>
                            <div className="card-desc">{card.description}</div>
                          </div>
                          <div className="card-code">
                            <pre dangerouslySetInnerHTML={{ __html: highlight(card.code) }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="cards-remaining">
                    {cards.map((_, i) => (
                      <div key={i} className={`dot ${i >= currentCardIndex ? 'active' : ''}`} />
                    ))}
                  </div>

                  <div className="action-buttons">
                    <button className="action-btn nope" onClick={() => handleSwipe("left")} title="Skip this one">✕</button>
                    <button className="action-btn skip" onClick={handleRegenerate} title="Regenerate options">↺</button>
                    <button className="action-btn yep" onClick={() => handleSwipe("right")} title="Accept!">♥</button>
                  </div>
                </>
              )}

              {!loading && hasNoMoreCards && (
                <div className="no-more-cards">
                  <div className="no-more-icon">😬</div>
                  <div className="no-more-text">
                    You've seen all options for this stage.<br />
                    Regenerate for fresh approaches, or accept<br /> one from the editor panel.
                  </div>
                  <button className="regenerate-btn" onClick={handleRegenerate}>↺ Generate New Options</button>
                </div>
              )}
            </div>

            <div className="editor-panel">
              <div className="editor-header">
                <div className="editor-dots">
                  <div className="editor-dot d1" />
                  <div className="editor-dot d2" />
                  <div className="editor-dot d3" />
                </div>
                <div className="editor-title">main.js — <span>your matches</span></div>
                {editorLines.length > 0 && (
                  <div className="line-count">{editorLines.length} lines</div>
                )}
              </div>
              <div className="editor-body" ref={editorRef}>
                {!acceptedCode ? (
                  <div className="editor-empty">
                    <div className="empty-icon">💾</div>
                    <div>Swipe right to add code here</div>
                  </div>
                ) : (
                  <div className="editor-content">
                    <div className="line-numbers">
                      {editorLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <div
                      className="editor-code"
                      dangerouslySetInnerHTML={{ __html: highlight(acceptedCode) }}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
