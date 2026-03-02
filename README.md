# POD Kelly Criterion Calculator (Chrome Extension)

A lightweight Chrome extension for **PinnacleOddsDropper Terminal** that:
- Reads odds by clicking **red odds** in the main table **or** **Price** values in the movement table
- Calculates implied win probability (`100 / odds`)
- Lets you input **Offered Odds** (from another site), **Bankroll**, and **Fractional Kelly**
- Outputs **Kelly %** and **Stake**, with a one-click **Copy Stake** button

---

## Features

- ✅ Click-to-capture odds (RED / PRICE)
- ✅ Implied probability auto-calculated
- ✅ Kelly sizing (raw + fractional)
- ✅ Copy recommended stake (fractional) to clipboard
- ✅ Clean, compact UI

---

## How it works

1. **Click odds** in the terminal (either):
   - Red odds in the main table, or
   - Price value inside the movement table
2. Open the extension popup → it will show the clicked odds + win chance
3. Enter:
   - **Offered Odds** (the odds you can actually bet)
   - **Bankroll**
   - **Fractional Kelly** (example: `0.10` = 10% Kelly)
4. Press **Calculate**
5. Use **Copy Stake (fractional)** to copy the recommended bet size

---

## Install (Developer Mode)

1. Download / clone this repo
2. Open Chrome and go to: `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder (the one containing `manifest.json`)
6. Pin the extension (optional) from the Extensions toolbar

---

## Usage

1. Go to: `https://www.pinnacleoddsdropper.com/terminal`
2. Click:
   - a **red odds** value in the main table, or
   - a **Price** value in the movement table
3. Open the extension popup
4. Fill **Offered Odds**, **Bankroll**, **Fractional Kelly**
5. Click **Calculate**
6. Click **Copy Stake (fractional)** to copy the recommended stake amount

---

## Kelly Formula (Decimal Odds)

- Implied probability from clicked odds:
  - `p = 1 / odds`
  - `p% = 100 / odds`

- Kelly fraction:
  - `b = offeredOdds - 1`
  - `q = 1 - p`
  - `f = (b*p - q) / b`
  - `f = max(0, f)`

- Fractional Kelly:
  - `f_fractional = f * kellyFactor`

- Stake:
  - `stake_fractional = bankroll * f_fractional`

---


Then uncomment / use:

### Click odds in terminal
<!-- ![Click odds](screenshots/01-click-odds.png) -->

### Calculator popup
<!-- ![Popup](screenshots/02-popup-calc.png) -->

Tip: On Windows use **Win + Shift + S** to capture.

---

## Notes

- This extension is intended for educational and personal bankroll management use.
- Always verify inputs (especially Offered Odds) before placing bets.

---

## License

MIT
