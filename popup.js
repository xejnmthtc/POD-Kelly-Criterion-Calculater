function kellyFraction(decimalOdds, p) {
  const O = Number(decimalOdds);
  const prob = Number(p);
  if (!(O > 1) || !(prob > 0 && prob < 1)) return 0;

  const b = O - 1;
  const q = 1 - prob;

  // Kelly: f = (b*p - q) / b
  const f = (b * prob - q) / b;
  return Math.max(0, f);
}

async function load() {
  const data = await chrome.storage.sync.get([
    "bankroll",
    "kellyFactor",
    "lastClickedOdds",
    "lastClickedWinPct"
  ]);

  document.getElementById("bankroll").value = data.bankroll ?? 1000;
  document.getElementById("kellyFactor").value = data.kellyFactor ?? 0.1;

  const cOdds = data.lastClickedOdds;
  const cPct = data.lastClickedWinPct;

  const clickedBox = document.getElementById("clickedBox");
  if (clickedBox) {
    clickedBox.textContent =
      (cOdds && cPct)
        ? `Clicked Odds (red): ${cOdds}\nWin chance: ${Number(cPct).toFixed(2)}%`
        : "Clicked Odds (red): - (click a red odds value first)";
  }
}

async function calculate() {
  const offeredOdds = Number(document.getElementById("offeredOdds").value);
  const bankroll = Number(document.getElementById("bankroll").value || 0);
  const kellyFactor = Number(document.getElementById("kellyFactor").value || 0);

  const { lastClickedWinPct } = await chrome.storage.sync.get(["lastClickedWinPct"]);

  if (!(offeredOdds > 1)) {
    document.getElementById("resultBox").innerHTML = "Result: Offered Odds is invalid.";
    return;
  }
  if (!(bankroll > 0)) {
    document.getElementById("resultBox").innerHTML = "Result: Bankroll is invalid.";
    return;
  }
  if (!(kellyFactor >= 0 && kellyFactor <= 1)) {
    document.getElementById("resultBox").innerHTML = "Result: Kelly factor must be between 0 and 1.";
    return;
  }
  if (!lastClickedWinPct) {
    document.getElementById("resultBox").innerHTML = "Result: No win chance saved. Click a red/price odds first.";
    return;
  }

  const p = Number(lastClickedWinPct) / 100;

  const fRaw = kellyFraction(offeredOdds, p);
  const fFrac = fRaw * kellyFactor;
  const stakeRaw = bankroll * fRaw;
  const stakeFrac = bankroll * fFrac;

  // ✅ save settings + last stake to copy
  await chrome.storage.sync.set({
    bankroll,
    kellyFactor,
    lastStakeFractional: stakeFrac
  });

  document.getElementById("resultBox").innerHTML =
    `Kelly raw: ${(fRaw * 100).toFixed(2)}%<br>` +
    `Fractional (${kellyFactor}): ${(fFrac * 100).toFixed(2)}%<br>` +
    `Stake raw: ${stakeRaw.toFixed(2)}<br>` +
    `<b>Stake fractional: ${stakeFrac.toFixed(2)} (bankroll ${bankroll})</b>`;
}

async function copyStake() {
  const { lastStakeFractional } = await chrome.storage.sync.get(["lastStakeFractional"]);
  if (lastStakeFractional == null) return;

  const txt = Number(lastStakeFractional).toFixed(2);
  await navigator.clipboard.writeText(txt);

  const btn = document.getElementById("copyStake");
  if (!btn) return;

  const old = btn.textContent;
  btn.textContent = `Copied: ${txt}`;
  setTimeout(() => (btn.textContent = old), 900);
}

document.getElementById("calc").addEventListener("click", calculate);
document.getElementById("copyStake")?.addEventListener("click", copyStake);
document.getElementById("openRepo")?.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://github.com/xejnmthtc/POD-Kelly-Criterion-Calculater" });
});

load();