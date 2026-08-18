(() => {
  "use strict";

  const SETTINGS_KEY = "whatsappPrivacySettings";
  const root = document.documentElement;

  let privacyEnabled = true;
  let sidebarCollapsed = false;
  let controls = null;
  let controlsSyncScheduled = false;

  function getStorage() {
    return globalThis.chrome?.storage?.local;
  }

  function saveSettings() {
    try {
      const request = getStorage()?.set({
        [SETTINGS_KEY]: { privacyEnabled, sidebarCollapsed },
      });

      request?.catch?.(() => {});
    } catch {}
  }

  function applyState() {
    root.classList.toggle("privacy-enabled", privacyEnabled);
    root.classList.toggle("privacy-sidebar-collapsed", sidebarCollapsed);
    updateControls();
  }

  function setPrivacyEnabled(enabled, shouldSave = true) {
    privacyEnabled = Boolean(enabled);
    applyState();

    if (shouldSave) {
      saveSettings();
    }
  }

  function togglePrivacy() {
    setPrivacyEnabled(!privacyEnabled);
  }

  function setSidebarCollapsed(collapsed, shouldSave = true) {
    sidebarCollapsed = Boolean(collapsed);
    applyState();

    if (shouldSave) {
      saveSettings();
    }
  }

  function toggleSidebar() {
    setSidebarCollapsed(!sidebarCollapsed);
  }

  function createButton(className, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.title = label;
    return button;
  }

  function createSidebarControl() {
    const sidebarButton = createButton(
      "privacy-sidebar-toggle",
      "Recolher conversas",
    );
    sidebarButton.id = "privacy-sidebar-toggle";
    sidebarButton.addEventListener("click", toggleSidebar);
    return sidebarButton;
  }

  function createControls() {
    if (!document.body) {
      return;
    }

    const existing = document.getElementById("privacy-extension-controls");

    if (existing) {
      let sidebarButton = document.getElementById("privacy-sidebar-toggle");

      if (!sidebarButton) {
        sidebarButton = createSidebarControl();
        document.body.append(sidebarButton);
      }

      controls = {
        container: existing,
        menuButton: existing.querySelector(".privacy-menu-button"),
        sidebarButton,
      };
      updateControls();
      return;
    }

    const container = document.createElement("section");
    container.id = "privacy-extension-controls";
    container.className = "privacy-extension-controls";
    container.setAttribute("aria-label", "Controles do WhatsApp Privacy");

    const menuButton = createButton(
      "privacy-menu-button",
      "Desativar privacidade",
    );
    menuButton.textContent = "P";
    menuButton.addEventListener("click", togglePrivacy);

    container.append(menuButton);

    const sidebarButton = createSidebarControl();

    document.body.append(container, sidebarButton);

    controls = {
      container,
      menuButton,
      sidebarButton,
    };

    updateControls();
  }

  function updateControls() {
    if (!controls?.container) {
      return;
    }

    const sidebarLabel = sidebarCollapsed
      ? "Mostrar conversas"
      : "Recolher conversas";

    controls.menuButton?.classList.toggle("privacy-is-enabled", privacyEnabled);
    controls.menuButton?.setAttribute(
      "aria-label",
      privacyEnabled ? "Desativar privacidade" : "Ativar privacidade",
    );
    controls.menuButton?.setAttribute("aria-pressed", String(privacyEnabled));
    controls.menuButton.title = privacyEnabled
      ? "Privacidade ativada"
      : "Privacidade desativada";

    if (controls.sidebarButton) {
      controls.sidebarButton.textContent = sidebarCollapsed ? ">" : "<";
      controls.sidebarButton.title = sidebarLabel;
      controls.sidebarButton.setAttribute("aria-label", sidebarLabel);
      controls.sidebarButton.setAttribute(
        "aria-pressed",
        String(sidebarCollapsed),
      );
    }
  }

  function restoreSettings() {
    try {
      const request = getStorage()?.get(SETTINGS_KEY);

      request
        ?.then?.((stored) => {
          const settings = stored?.[SETTINGS_KEY];

          if (!settings || typeof settings !== "object") {
            return;
          }

          if (typeof settings.privacyEnabled === "boolean") {
            privacyEnabled = settings.privacyEnabled;
          }

          if (typeof settings.sidebarCollapsed === "boolean") {
            sidebarCollapsed = settings.sidebarCollapsed;
          }

          applyState();
        })
        .catch?.(() => {});
    } catch {}
  }

  function scheduleControlsSync() {
    if (
      document.getElementById("privacy-extension-controls") &&
      document.getElementById("privacy-sidebar-toggle")
    ) {
      return;
    }

    if (controlsSyncScheduled) {
      return;
    }

    controlsSyncScheduled = true;

    requestAnimationFrame(() => {
      controlsSyncScheduled = false;
      createControls();
    });
  }

  function isTypingTarget(target) {
    return (
      target instanceof HTMLElement &&
      (target.isContentEditable || target.matches("input, textarea, select"))
    );
  }

  document.addEventListener("keydown", (event) => {
    if (isTypingTarget(event.target) || !event.altKey || !event.shiftKey) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "p") {
      event.preventDefault();
      togglePrivacy();
    }

    if (key === "s") {
      event.preventDefault();
      toggleSidebar();
    }
  });

  applyState();
  createControls();
  restoreSettings();

  const observer = new MutationObserver(scheduleControlsSync);
  observer.observe(root, { childList: true, subtree: true });
})();
