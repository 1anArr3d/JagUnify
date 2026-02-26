/* 

This is just a mock-up of the UI for the bot to see how it would look and behave on the website
Everything within the "server" file is all some fake backend stuff just to see the chat function working

*/

(() => {
  const API_URL = "http://localhost:3001/chat";

  const root = document.getElementById("tamusa-chat-root");

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
  const sessionId = crypto?.randomUUID?.() || String(Date.now());
  let isOpen = false;
  let isSending = false;

  function addMessage(text, who, sources = []) {
    const bubble = document.createElement("div");
    bubble.className = `msg ${who}`;
    bubble.textContent = text;

    if (who === "bot" && sources.length) {
      const s = document.createElement("div");
      s.className = "sources";
      s.textContent = "Sources: ";

      sources.forEach((src) => {
        const a = document.createElement("a");
        a.href = src.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = src.title || "Link";
        s.appendChild(a);
      });

      bubble.appendChild(s);
    }

    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;

    if (who === "bot") {
      live.textContent = text; // announce to screen readers
    }
  }

  function setOpen(next) {
    isOpen = next;
    panel.classList.toggle("open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
    else fab.focus();
  }

async function sendMessage(text) {
  isSending = true;
  sendBtn.disabled = true;
  input.disabled = true;

  try {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const lower = text.toLowerCase();
    let response;

    if (lower.includes("apply") || lower.includes("admission")) {
      response = {
        reply: "You can start your application from the Admissions page.",
        sources: [{ title: "Admissions", url: "https://www.tamusa.edu/" }]
      };
    } 
    else if (lower.includes("tuition") || lower.includes("cost")) {
      response = {
        reply: "Tuition varies depending on program and credit hours.",
        sources: [{ title: "Tuition & Aid", url: "https://www.tamusa.edu/" }]
      };
    } 
    else {
      response = {
        reply: "I'm not sure yet. Try asking about admissions, tuition, or deadlines."
      };
    }

    addMessage(response.reply, "bot", response.sources ?? []);

  } catch (err) {
    addMessage("Something went wrong.", "bot");
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
  addMessage("Hello and welcome to Tecas A&M University - San Antonio! Ask me about admissions, deadlines, tuition, campus services, or anything else you may need.", "bot");
})();