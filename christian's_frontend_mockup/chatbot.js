(() => {
  /**
   * ============================================================
   * Backend Integration Notes
   * ============================================================
   *
   * The widget sends a POST request to API_URL with JSON:
   *   { sessionId, message, top_k }
   *
   * The JSON response should ideally be structured like this:
   * {
   *   "refused": false,
   *   "answer": "Text with inline citations like [1] ...",
   *   "retrieval": [
   *     { "rank": 1, "score": 0.82, "title": "Doc title", "url": "https://...", "snippet": "..." }
   *   ],
   *   "citations": [
   *     { "id": 1, "title": "Doc title", "url": "https://...", "snippet": "..." }
   *   ]
   * }
   *
   * Refusal case:
   * {
   *   "refused": true,
   *   "answer": "I cannot find supporting information in the indexed TAMUSA documents.",
   *   "retrieval": [],
   *   "citations": []
   * }
   * ============================================================
   */

  /**
   * Change This:
   * Set this to the running API endpoint.
   *
   */
  const API_URL = "http://localhost:3001/chat";

  /**
   * Change This (Optional):
   * If the backend uses a different path or needs headers (auth), update below.
   * For example, add:
   *   headers: { "Authorization": "Bearer ...", "Content-Type":"application/json" }
   */
  const DEFAULT_TOP_K = 5;

  const root = document.getElementById("tamusa-chat-root");
  if (!root) {
    console.error("Missing #tamusa-chat-root");
    return;
  }

  // --- Build DOM ---
  const fab = document.createElement("button");
  fab.className = "chat-fab";
  fab.type = "button";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-expanded", "false");
  fab.textContent = "Chat";

  const panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "TAMUSA help chat");

  const header = document.createElement("div");
  header.className = "chat-header";

  const title = document.createElement("div");
  title.className = "chat-title";
  title.textContent = "TAMUSA Help";

  const closeBtn = document.createElement("button");
  closeBtn.className = "chat-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.textContent = "✕";

  header.append(title, closeBtn);

  // Screen-reader live region for new bot messages
  const live = document.createElement("div");
  live.className = "sr-only";
  live.setAttribute("aria-live", "polite");

  const log = document.createElement("div");
  log.className = "chat-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-relevant", "additions");

  const inputWrap = document.createElement("form");
  inputWrap.className = "chat-input";
  inputWrap.setAttribute("aria-label", "Chat input");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask a question…";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Type your question");

  const sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.textContent = "Send";

  inputWrap.append(input, sendBtn);
  panel.append(header, live, log, inputWrap);
  root.append(fab, panel);

  // --- State ---
  const sessionId = (crypto?.randomUUID?.() || String(Date.now()));
  let isOpen = false;
  let isSending = false;

  // --- Helpers ---
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function formatScore(score) {
    if (typeof score !== "number") return "";
    return score.toFixed(2);
  }

  function renderRetrievalList(items = []) {
    const wrap = el("div", "retrieval");
    wrap.appendChild(el("div", "section-title", "Retrieved evidence (top-k)"));

    if (!items.length) {
      wrap.appendChild(el("div", "muted", "No retrieved chunks."));
      return wrap;
    }

    const list = el("ol", "retrieval-list");
    for (const r of items) {
      const li = el("li", "retrieval-item");

      const head = el("div", "retrieval-head");

      const a = document.createElement("a");
      a.href = r.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = r.title || "Source";
      head.appendChild(a);

      const meta = el(
        "span",
        "retrieval-meta",
        r.score != null ? `score: ${formatScore(r.score)}` : ""
      );
      head.appendChild(meta);

      li.appendChild(head);

      if (r.snippet) {
        li.appendChild(el("div", "retrieval-snippet", r.snippet));
      }

      list.appendChild(li);
    }

    wrap.appendChild(list);
    return wrap;
  }

  function renderCitations(items = []) {
    const wrap = el("div", "citations");
    wrap.appendChild(el("div", "section-title", "Sources"));

    if (!items.length) {
      wrap.appendChild(el("div", "muted", "No citations returned."));
      return wrap;
    }

    const list = el("ol", "citation-list");
    for (const c of items) {
      const li = el("li", "citation-item");

      const label = el("span", "citation-id", `[${c.id ?? ""}] `);
      li.appendChild(label);

      const a = document.createElement("a");
      a.href = c.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = c.title || c.url || "Source";
      li.appendChild(a);

      if (c.snippet) {
        li.appendChild(el("div", "citation-snippet", c.snippet));
      }

      list.appendChild(li);
    }

    wrap.appendChild(list);
    return wrap;
  }

  /**
   * Adds either:
   * - plain string bubble
   * - structured bot response bubble: answer + retrieval + citations
   */
  function addMessage(content, who) {
    const bubble = document.createElement("div");
    bubble.className = `msg ${who}`;

    if (who === "bot" && content && typeof content === "object") {
      const { refused, answer, retrieval, citations } = content;

      bubble.appendChild(el("div", "bot-answer", answer || ""));
      bubble.appendChild(renderRetrievalList(retrieval || []));
      bubble.appendChild(renderCitations(citations || []));

      if (refused) bubble.classList.add("refused");

      live.textContent = refused
        ? "Refused: no supporting documents found."
        : (answer || "New message received.");
    } else {
      bubble.textContent = String(content ?? "");
      if (who === "bot") live.textContent = bubble.textContent;
    }

    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function setOpen(next) {
    isOpen = next;
    panel.classList.toggle("open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
    else fab.focus();
  }

  /**
   * ============================================================
   * Backend Request
   * ============================================================
   * This function performs the POST /chat request.
   *
   * If the API needs different fields,
   * update the JSON body below.
   * ============================================================
   */
  async function sendMessage(text) {
    isSending = true;
    sendBtn.disabled = true;
    input.disabled = true;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      /**
       * Change this if needed:
       * - Update body fields
       * - Add auth headers
       * - Change endpoint path (API_URL)
       */
      const requestBody = {
        sessionId,
        message: text,
        top_k: DEFAULT_TOP_K
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();

      /**
       * ============================================================
       * Response Normalization (CHANGE POINT)
       * ============================================================
       * The widget prefers:
       *   data.answer, data.citations, data.retrieval, data.refused
       *
       * For compatibility, it also accepts:
       *   data.reply  (fallback for answer)
       *   data.sources (fallback for citations)
       *
       * Easiest path is to return the "preferred shape".
       * If need to return different field names, map them here.
       * ============================================================
       */
      const normalized = {
        refused: Boolean(data.refused),
        answer: data.answer ?? data.reply ?? "",
        retrieval: Array.isArray(data.retrieval) ? data.retrieval : [],
        citations: Array.isArray(data.citations)
          ? data.citations
          : (Array.isArray(data.sources) ? data.sources : [])
      };

      addMessage(normalized, "bot");
    } catch (err) {
      addMessage(
        "Sorry — I couldn’t reach the chat service. Try again, or use the site navigation/contact page.",
        "bot"
      );
      console.error(err);
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  // --- Events ---
  fab.addEventListener("click", () => setOpen(!isOpen));
  closeBtn.addEventListener("click", () => setOpen(false));

  // ESC closes the dialog
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) setOpen(false);
  });

  inputWrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isSending) return;
    input.value = "";
    addMessage(text, "user");
    await sendMessage(text);
  });

  // Initial greeting
  addMessage(
    "Hi! Ask me about admissions, deadlines, tuition, or campus services.",
    "bot"
  );
})();