import { joinRoom } from "https://esm.sh/trystero@0.20.1";

const APP_ID = "chattingu-global-room-v1";
const MAX_MESSAGES = 250;

const els = {
  chatForm: document.querySelector("#chatForm"),
  messageInput: document.querySelector("#messageInput"),
  messages: document.querySelector("#messages"),
  nameInput: document.querySelector("#nameInput"),
  saveNameBtn: document.querySelector("#saveNameBtn"),
  statusText: document.querySelector("#statusText"),
};

const state = {
  name: localStorage.getItem("chattingu:name") || `Guest-${Math.floor(Math.random() * 900 + 100)}`,
  seenIds: new Set(),
};

els.nameInput.value = state.name;

const room = joinRoom({ appId: APP_ID }, "everyone");
const [sendMessage, getMessage] = room.makeAction("message");

setStatus("Connected. Waiting for people...");
addSystemMessage("You joined the global chat room.");

room.onPeerJoin(() => {
  setStatus("Connected to peers.");
});

room.onPeerLeave(() => {
  setStatus("A peer disconnected.");
});

getMessage((payload) => {
  if (!isValidPayload(payload)) return;
  if (state.seenIds.has(payload.id)) return;
  state.seenIds.add(payload.id);

  addMessage(payload, false);
});

els.chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = els.messageInput.value.trim();
  if (!text) return;

  const payload = {
    id: crypto.randomUUID(),
    name: state.name,
    text,
    ts: Date.now(),
  };

  state.seenIds.add(payload.id);
  addMessage(payload, true);
  els.messageInput.value = "";

  try {
    await sendMessage(payload);
  } catch {
    setStatus("Failed to deliver message to peers.");
  }
});

els.saveNameBtn.addEventListener("click", saveName);
els.nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveName();
  }
});

function saveName() {
  const nextName = els.nameInput.value.trim().slice(0, 24);
  if (!nextName) return;

  state.name = nextName;
  localStorage.setItem("chattingu:name", state.name);
  addSystemMessage(`You are now known as ${state.name}.`);
}

function addMessage(payload, isMine) {
  const item = document.createElement("li");
  item.className = "message";

  const date = new Date(payload.ts || Date.now());
  item.innerHTML = `
    <div class="message__meta">
      <span class="message__name">${escapeHtml(payload.name)}</span>
      <time datetime="${date.toISOString()}">${date.toLocaleTimeString()}</time>
      ${isMine ? "<span>(you)</span>" : ""}
    </div>
    <p class="message__text">${escapeHtml(payload.text)}</p>
  `;

  els.messages.append(item);
  trimMessages();
  item.scrollIntoView({ block: "end" });
}

function addSystemMessage(text) {
  const item = document.createElement("li");
  item.className = "system";
  item.textContent = text;
  els.messages.append(item);
  trimMessages();
}

function trimMessages() {
  while (els.messages.childElementCount > MAX_MESSAGES) {
    els.messages.firstElementChild?.remove();
  }
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function isValidPayload(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.text === "string"
  );
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
