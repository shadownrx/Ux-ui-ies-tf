const DEFAULTS = { enabled: true, theme: "light", fontScale: 1 };

const enabledInput = document.getElementById("enabled");
const themeButtons = document.querySelectorAll("#theme button");
const fontScaleInput = document.getElementById("fontScale");
const resetBtn = document.getElementById("reset");

function render(settings) {
  enabledInput.checked = !!settings.enabled;
  themeButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.value === settings.theme);
  });
  fontScaleInput.value = settings.fontScale;
}

chrome.storage.local.get(DEFAULTS, render);

enabledInput.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
});

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    chrome.storage.local.set({ theme: btn.dataset.value });
  });
});

fontScaleInput.addEventListener("input", () => {
  chrome.storage.local.set({ fontScale: Number(fontScaleInput.value) });
});

resetBtn.addEventListener("click", () => {
  chrome.storage.local.set(DEFAULTS);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  chrome.storage.local.get(DEFAULTS, render);
});
