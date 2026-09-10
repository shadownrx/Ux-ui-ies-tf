(function () {
  "use strict";

  const DEFAULTS = { enabled: true, theme: "light", fontScale: 1 };
  const html = document.documentElement;

  // Se activa de entrada para evitar el "flash" del diseño original;
  // si el usuario lo tenía apagado, storage.get lo revierte enseguida.
  html.classList.add("uxui-enabled");
  html.setAttribute("data-uxui-theme", DEFAULTS.theme);

  function applySettings(settings) {
    html.classList.toggle("uxui-enabled", !!settings.enabled);
    const theme = settings.theme === "auto"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : settings.theme;
    html.setAttribute("data-uxui-theme", theme || "light");
    html.style.setProperty("--uxui-scale", String(settings.fontScale || 1));
    updateFab(settings.enabled);
  }

  function getSettings(cb) {
    chrome.storage.local.get(DEFAULTS, cb);
  }

  getSettings(applySettings);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    getSettings(applySettings);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    getSettings((s) => { if (s.theme === "auto") applySettings(s); });
  });

  // ---------- Mejoras de contenido (se aplican cuando el DOM existe) ----------

  function enhancePasswordFields(scope) {
    scope.querySelectorAll('input[type="password"]:not([data-uxui-pw])').forEach((input) => {
      const parent = input.parentElement;
      const hasExistingToggle = parent && parent.querySelector(
        'button, a, input[type="button"], input[type="image"]'
      );
      if (hasExistingToggle) return;

      input.dataset.uxuiPw = "1";
      const wrapper = document.createElement("span");
      wrapper.className = "uxui-password-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.width = "100%";
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "uxui-pw-toggle";
      toggle.textContent = "Ver";
      toggle.setAttribute("aria-label", "Mostrar u ocultar contraseña");
      toggle.addEventListener("click", () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        toggle.textContent = show ? "Ocultar" : "Ver";
      });
      wrapper.appendChild(toggle);
    });
  }

  function wrapMainForm() {
    const form = document.querySelector("form");
    if (!form || form.dataset.uxuiWrapped) return;
    form.dataset.uxuiWrapped = "1";

    if (!form.closest(".uxui-card")) {
      const card = document.createElement("div");
      card.className = "uxui-card";
      form.parentNode.insertBefore(card, form);
      card.appendChild(form);
    }
    enhancePasswordFields(form);
  }

  function addTopbar() {
    if (document.querySelector(".uxui-topbar")) return;
    const bar = document.createElement("div");
    bar.className = "uxui-topbar";
    bar.innerHTML = `
      <span class="uxui-topbar__title">${escapeHtml(document.title || "Aula Virtual")}</span>
      <span class="uxui-topbar__spacer"></span>
      <span class="uxui-topbar__pill">Interfaz renovada</span>
    `;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function addFab() {
    if (document.getElementById("uxui-fab")) return;
    const fab = document.createElement("button");
    fab.id = "uxui-fab";
    fab.type = "button";
    fab.textContent = "🎨 Diseño original";
    fab.addEventListener("click", () => {
      getSettings((s) => {
        chrome.storage.local.set({ enabled: !s.enabled });
      });
    });
    document.body.appendChild(fab);
  }

  function updateFab(enabled) {
    const fab = document.getElementById("uxui-fab");
    if (!fab) return;
    fab.textContent = enabled ? "🎨 Diseño original" : "✨ Rediseño UX/UI";
  }

  function runEnhancements() {
    if (!document.body) return;
    addTopbar();
    wrapMainForm();
    addFab();
    getSettings((s) => updateFab(s.enabled));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runEnhancements);
  } else {
    runEnhancements();
  }

  // El aula virtual carga fragmentos dinámicamente en algunas pantallas.
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runEnhancements, 150);
  });
  document.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
