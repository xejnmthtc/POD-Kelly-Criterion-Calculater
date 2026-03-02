console.log("Kelly extension loaded ✅");

function parseDecimal(text) {
  if (!text) return null;
  const m = String(text).match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return null;
  const val = Number(m[0].replace(",", "."));
  return Number.isFinite(val) ? val : null;
}

function showMiniToast(msg) {
  let toast = document.getElementById("__kelly_toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "__kelly_toast";
    toast.style.cssText = `
      position: fixed; bottom: 18px; right: 18px; z-index: 999999;
      background: rgba(15,23,42,0.95); color: white;
      padding: 10px 12px; border-radius: 10px;
      font: 13px/1.3 system-ui; box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      max-width: 340px; white-space: pre-line;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(window.__kellyToastTimer);
  window.__kellyToastTimer = setTimeout(() => (toast.style.display = "none"), 3500);
}

document.addEventListener(
  "click",
  async (e) => {
    const redEl = e.target?.closest?.(".text-rose-400");
    const priceEl = e.target?.closest?.("td.text-right.font-mono.px-2");

    const el = redEl || priceEl;
    if (!el) return;

    const odds = parseDecimal(el.textContent);
    if (!odds || odds <= 1) {
      showMiniToast(`Odds not valid: ${el.textContent}`);
      return;
    }

    const winPct = 100 / odds;
    const payload = { lastClickedOdds: odds, lastClickedWinPct: winPct };

    // ✅ never crash: optional chaining via globalThis
    const sync = globalThis?.chrome?.storage?.sync;

    try {
      if (sync?.set) {
        await sync.set(payload);
      } else {
        localStorage.setItem("__pod_kelly", JSON.stringify(payload));
      }
    } catch (_) {
      localStorage.setItem("__pod_kelly", JSON.stringify(payload));
    }

    const source = redEl ? "RED" : "PRICE";
    showMiniToast(
      `Source: ${source}\nClicked Odds: ${odds}\nWin chance: ${winPct.toFixed(2)}%`
    );
  },
  true
);