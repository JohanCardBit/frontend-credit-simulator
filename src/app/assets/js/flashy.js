
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
      ? define(factory)
      : ((global = typeof globalThis !== "undefined" ? globalThis : global || self),
        (global.flashy = factory()));
})(this, function () {
  "use strict";

  const defaults = {
    type: "default",
    position: "top-right",
    duration: 4000,
    closable: true,
    animation: "slide",
    theme: "light",
    icon: null,
    onClick: null,
    onClose: null,
    onConfirm: null,
    onCancel: null,
  };

  const defaultIcons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    default: "💬",
  };

  let stylesInjected = false;
  const containers = {};

  const styles = `
    .flashy-container { position: fixed; z-index: 10000; pointer-events: none; }
    .flashy-container.top-left { top: 20px; left: 20px; }
    .flashy-container.top-center { top: 20px; left: 50%; transform: translateX(-50%); }
    .flashy-container.top-right { top: 20px; right: 20px; }
    .flashy-container.bottom-left { bottom: 20px; left: 20px; }
    .flashy-container.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
    .flashy-container.bottom-right { bottom: 20px; right: 20px; }

    .flashy-notification {
      display: flex; align-items: center; min-width: 300px; max-width: 500px;
      margin: 8px 0; padding: 16px 20px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      font-size: 14px; line-height: 1.4; pointer-events: auto; cursor: pointer;
      border-left: 4px solid; position: relative; overflow: hidden; opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .flashy-notification:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
    .flashy-notification.light { background: #ffffffff; color: #333; }
    .flashy-notification.dark { background: #2d3748; color: #e2e8f0; }
    .flashy-notification.success { border-left-color: #4CAF50; }
    .flashy-notification.error { border-left-color: #f44336; }
    .flashy-notification.warning { border-left-color: #ff9800; }
    .flashy-notification.info { border-left-color: #2196F3; }
    .flashy-notification.default { border-left-color: #607d8b; }
    .flashy-notification.confirm { border-left-color: #f97316; }


    .flashy-icon { font-size: 18px; margin-right: 12px; flex-shrink: 0; }
    .flashy-content { flex: 1; word-wrap: break-word; }
    .flashy-close {
      background: none; border: none; font-size: 18px; cursor: pointer;
      margin-left: 12px; opacity: 0.7; transition: opacity 0.2s; padding: 0;
      width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
      color: inherit;
    }
    .flashy-close:hover { opacity: 1; }

    .flashy-buttons button {
      cursor: pointer; border: none; padding: 6px 12px; border-radius: 4px;
      font-size: 13px; transition: background 0.2s;
    }
.flashy-confirm {
  background: linear-gradient(135deg, #2c1a0c, #f97316);
  color: #ffffff;
}
.flashy-confirm:hover {
  background: linear-gradient(135deg, #1a0f07, #d97706);
}

/* Botón Cancelar */
.flashy-cancel {
  background: linear-gradient(135deg, #220000, #b91c1c);
  color: #ffffff;
}
.flashy-cancel:hover {
  background: linear-gradient(135deg, #110000, #991b1b);
}


    .flashy-progress {
      position: absolute; bottom: 0; left: 0; height: 3px; background: rgba(0,0,0,0.2);
      transition: width linear;
    }

    @keyframes flashy-slide-in-right { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
    @keyframes flashy-slide-in-left { from { transform: translateX(-100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
    @keyframes flashy-slide-in-top { from { transform: translateY(-100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
    @keyframes flashy-slide-in-bottom { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
    @keyframes flashy-fade-in { from { opacity:0; } to { opacity:1; } }
    @keyframes flashy-bounce-in { 0% { transform: scale(0.3); opacity:0; } 50% { transform: scale(1.05); opacity:0.8; } 70% { transform: scale(0.9); opacity:0.9; } 100% { transform: scale(1); opacity:1; } }
    @keyframes flashy-zoom-in { 0% { transform: scale(0); opacity:0; } 50% { transform: scale(1.1); opacity:0.8; } 100% { transform: scale(1); opacity:1; } }
    @keyframes flashy-exit { from { opacity:1; } to { opacity:0; } }

    .flashy-notification.animate-slide.top-left { animation: flashy-slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-slide.top-center { animation: flashy-slide-in-top 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-slide.top-right { animation: flashy-slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-slide.bottom-left { animation: flashy-slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-slide.bottom-center { animation: flashy-slide-in-bottom 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-slide.bottom-right { animation: flashy-slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
    .flashy-notification.animate-fade { animation: flashy-fade-in 0.3s forwards; }
    .flashy-notification.animate-bounce { animation: flashy-bounce-in 0.5s forwards; }
    .flashy-notification.animate-zoom { animation: flashy-zoom-in 0.3s forwards; }
    .flashy-notification.removing { animation: flashy-exit 0.3s forwards; }
  `;

  function injectStyles() {
    if (stylesInjected || typeof document === "undefined") return;
    const styleEl = document.createElement("style");
    styleEl.id = "flashy-styles";
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    stylesInjected = true;
  }

  function getContainer(position) {
    if (typeof document === "undefined") return null;
    if (!containers[position]) {
      const c = document.createElement("div");
      c.className = `flashy-container ${position}`;
      document.body.appendChild(c);
      containers[position] = c;
    }
    return containers[position];
  }

  function closeNotification(el, options = {}) {
    if (!el || el.classList.contains("removing")) return;
    el.classList.add("removing");
    if (typeof options.onClose === "function") {
      try { options.onClose(); } catch (e) { console.warn("Flashy onClose error:", e); }
    }
    setTimeout(() => el.remove(), 300);
  }

  function flashy(message, options = {}) {
    if (typeof document === "undefined") return () => { };
    injectStyles();
    if (!message || typeof message !== "string") return () => { };
    if (typeof options === "string") options = { type: options };
    const config = { ...defaults, ...options };

    const validTypes = ["success", "error", "warning", "info", "default", "confirm"];
    const validPositions = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];
    const validAnimations = ["slide", "fade", "bounce", "zoom"];
    const validThemes = ["light", "dark"];

    config.type = validTypes.includes(config.type) ? config.type : "default";
    config.position = validPositions.includes(config.position) ? config.position : "top-right";
    config.animation = validAnimations.includes(config.animation) ? config.animation : "slide";
    config.theme = validThemes.includes(config.theme) ? config.theme : "light";
    config.duration = Math.max(0, config.duration);

    const container = getContainer(config.position);
    if (!container) return () => { };

    const notification = document.createElement("div");
    notification.className = `flashy-notification ${config.type} ${config.theme} animate-${config.animation} ${config.position}`;

    const icon = config.icon || defaultIcons[config.type] || defaultIcons.default;
    const escapedMessage = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    let content = icon ? `<span class="flashy-icon">${icon}</span>` : "";
    content += `<div class="flashy-content">${escapedMessage}</div>`;

    if (config.type === "confirm") {
      content += `
        <div class="flashy-buttons" style="display:flex; gap:8px; margin-left:12px;">
          <button class="flashy-confirm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" stroke="#ffffffff"/>
  <path d="M9 12l2 2 4-4" stroke="#ffffff"/>
</svg>
</button>
          <button class="flashy-cancel"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" stroke="#ffffff"/>
  <line x1="9" y1="9" x2="15" y2="15" stroke="#ffffff"/>
  <line x1="15" y1="9" x2="9" y2="15" stroke="#ffffff"/>
</svg>
</button>
        </div>
      `;
    } else if (config.closable) {
      content += `<button class="flashy-close" type="button" aria-label="Cerrar">×</button>`;
    }

    if (config.duration > 0 && config.type !== "confirm") content += `<div class="flashy-progress"></div>`;
    notification.innerHTML = content;
    container.appendChild(notification);
    notification.offsetHeight;

    const progressBar = notification.querySelector(".flashy-progress");
    let timeoutId, remainingTime = config.duration, startTime = Date.now(), isPaused = false;

    const startTimer = () => {
      if (remainingTime <= 0) return;
      startTime = Date.now();
      timeoutId = setTimeout(() => closeNotification(notification, config), remainingTime);
      if (progressBar) { progressBar.style.transition = `width ${remainingTime}ms linear`; setTimeout(() => progressBar.style.width = "0%", 10); }
    };
    const pauseTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId); timeoutId = null;
        remainingTime = Math.max(0, remainingTime - (Date.now() - startTime)); isPaused = true;
        if (progressBar) {
          const w = parseFloat(getComputedStyle(progressBar).width);
          const pw = parseFloat(getComputedStyle(progressBar.parentElement).width);
          progressBar.style.transition = "none"; progressBar.style.width = (w / pw * 100) + "%";
        }
      }
    };
    const resumeTimer = () => { if (isPaused && remainingTime > 0) { isPaused = false; startTimer(); } };
    if (config.duration > 0 && config.type !== "confirm") { startTimer(); notification.addEventListener("mouseenter", pauseTimer); notification.addEventListener("mouseleave", resumeTimer); }

    if (config.closable && config.type !== "confirm") {
      const closeBtn = notification.querySelector(".flashy-close");
      if (closeBtn) closeBtn.addEventListener("click", e => { e.stopPropagation(); closeNotification(notification, config); });
    }

    if (config.type === "confirm") {
      const confirmBtn = notification.querySelector(".flashy-confirm");
      const cancelBtn = notification.querySelector(".flashy-cancel");
      if (confirmBtn) confirmBtn.addEventListener("click", () => { if (typeof config.onConfirm === "function") config.onConfirm(); closeNotification(notification, config); });
      if (cancelBtn) cancelBtn.addEventListener("click", () => { if (typeof config.onCancel === "function") config.onCancel(); closeNotification(notification, config); });
    }

    if (typeof config.onClick === "function") {
      notification.addEventListener("click", e => {
        if (!e.target.classList.contains("flashy-close") && !e.target.classList.contains("flashy-confirm") && !e.target.classList.contains("flashy-cancel")) {
          try { config.onClick(); } catch (e) { console.warn("Flashy onClick error:", e); }
        }
      });
    }

    return () => { if (timeoutId) clearTimeout(timeoutId); closeNotification(notification, config); };
  }

  flashy.closeAll = () => { document.querySelectorAll(".flashy-notification").forEach(n => closeNotification(n, {})); };
  flashy.destroy = () => {
    flashy.closeAll();
    Object.values(containers).forEach(c => c.remove());
    Object.keys(containers).forEach(k => delete containers[k]);
    const styleEl = document.getElementById("flashy-styles");
    if (styleEl) styleEl.remove();
    stylesInjected = false;
  };
  flashy.setDefaults = (newDefaults) => { if (newDefaults && typeof newDefaults === "object") Object.assign(defaults, newDefaults); };
  flashy.getOptions = () => ({ ...defaults });

  flashy.success = (msg, opt = {}) => flashy(msg, { ...opt, type: "success" });
  flashy.error = (msg, opt = {}) => flashy(msg, { ...opt, type: "error" });
  flashy.warning = (msg, opt = {}) => flashy(msg, { ...opt, type: "warning" });
  flashy.info = (msg, opt = {}) => flashy(msg, { ...opt, type: "info" });

  flashy.version = "1.1.1";
  return flashy;
});
