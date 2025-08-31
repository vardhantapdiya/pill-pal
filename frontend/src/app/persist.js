export const loadState = () => {
  try {
    const auth = localStorage.getItem("auth");
    const savedLocal = localStorage.getItem("savedLocal");
    const ui = localStorage.getItem("ui");

    return {
      auth: auth ? JSON.parse(auth) : undefined,
      saved: { local: savedLocal ? JSON.parse(savedLocal) : [] , items: [] },
      ui: ui ? JSON.parse(ui) : { darkMode: false },
    };
  } catch {
    return undefined;
  }
};

let throttleLock = false;
export const saveState = (state) => {
  if (throttleLock) return;
  throttleLock = true;
  setTimeout(() => (throttleLock = false), 500);

  try {
    const { auth, saved, ui } = state;
    localStorage.setItem("auth", JSON.stringify({ token: auth.token, email: auth.email }));
    localStorage.setItem("savedLocal", JSON.stringify(saved.local));
    localStorage.setItem("ui", JSON.stringify({ darkMode: ui.darkMode }));
  } catch {}
};