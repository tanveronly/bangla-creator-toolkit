const editor = document.querySelector("#editor");
const charCount = document.querySelector("#charCount");
const wordCount = document.querySelector("#wordCount");
const lineCount = document.querySelector("#lineCount");
const message = document.querySelector("#message");

function updateStats() {
  const value = editor.value;
  charCount.textContent = [...value].length;
  const trimmed = value.trim();
  wordCount.textContent = trimmed ? trimmed.split(/\s+/u).length : 0;
  lineCount.textContent = value ? value.split(/\r\n|\r|\n/).length : 0;
}
function notify(text) {
  message.textContent = text;
}
editor.addEventListener("input", updateStats);

document.querySelector("#clearBtn").addEventListener("click", () => {
  editor.value = "";
  updateStats();
  notify("Text cleared.");
});
document.querySelector("#cleanBtn").addEventListener("click", () => {
  editor.value = editor.value
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  updateStats();
  notify("Extra spaces removed.");
});
document.querySelector("#formatBtn").addEventListener("click", () => {
  const words = editor.value.trim().split(/\s+/u).filter(Boolean);
  if (!words.length) return notify("Write or paste some text first.");
  const paragraphs = [];
  for (let i = 0; i < words.length; i += 35) {
    paragraphs.push(words.slice(i, i + 35).join(" "));
  }
  editor.value = paragraphs.join("\n\n");
  updateStats();
  notify("Caption formatted into short paragraphs.");
});
document.querySelector("#hashtagBtn").addEventListener("click", () => {
  const terms = document.querySelector("#keywords").value
    .split(/[,\s]+/u).map(x => x.trim().replace(/^#+/, ""))
    .filter(Boolean).map(x => "#" + x.replace(/[^\p{L}\p{N}_]/gu, ""));
  const unique = [...new Set(terms)].filter(x => x.length > 1);
  if (!unique.length) return notify("Enter one or more keywords first.");
  editor.value = [editor.value.trim(), unique.join(" ")].filter(Boolean).join("\n\n");
  updateStats();
  notify("Hashtags added from your keywords.");
});
document.querySelector("#copyBtn").addEventListener("click", async () => {
  if (!editor.value) return notify("There is no text to copy.");
  try {
    await navigator.clipboard.writeText(editor.value);
    notify("Copied to clipboard.");
  } catch {
    editor.select();
    notify("Text selected. Use your device's Copy command.");
  }
});
updateStats();
