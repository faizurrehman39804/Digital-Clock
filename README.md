# ⏱️ Digital Clock & Luxury Chronometer

> A precision luxury watchface and digital clock web application built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with a deep black aesthetic, radial golden-yellow Roman serif numerals, 60-second calibrated ticks, mechanical sweeping hands, and live complications for battery percentage, weekday, date, and 12h/24h switchable digital time.

![Digital Clock Screenshot](https://raw.githubusercontent.com/faizurrehman39804/Digital-Clock/main/screenshot.png)

---

## 🌟 Key Features

- **Luxury Radial Watch Face**: 12 Roman serif numerals (`Playfair Display` / `Cinzel`) oriented radially along the dial circumference with custom golden-yellow styling (`#ffeb00`) and pitch black background.
- **Calibrated Tick Perimeter**: 60 dial ticks including 12 major hour ticks and 48 minute subdivisions, rendered crisply with high-DPI SVG vector precision.
- **Precision Sweeping Hands**:
  - **Hour Hand**: Elegant tapered ivory stem with a distinctive red sleeve near the center hub.
  - **Minute Hand**: Extended ivory stem reaching out to the minute perimeter.
  - **Second Hand**: Fiery red sweeping needle with a central hub cap and counter-balance rear tail.
- **Dual Second Hand Modes**: Toggle between **Smooth Sweep** (60 FPS mechanical sweep via `requestAnimationFrame`) and **Quartz Step** (1 Hz discrete ticking).
- **Live Watch Complications**:
  - **Top**: Live Battery percentage via `navigator.getBattery()` API (with graceful fallback).
  - **Left**: 3-letter weekday (`SAT`).
  - **Right**: Day of month and 3-letter month (`17 OCT`).
  - **Bottom**: Digital time readout with AM/PM (`10:43 AM`).
- **12-Hour & 24-Hour Switchable Formats**: Interactive toggle switch with accessible ARIA attributes (`role="switch"`, `aria-checked`), updating the digital complication instantly without restarting intervals.
- **Persistent Preferences**: Saves format and sweep preferences in `localStorage` so settings persist across page reloads.
- **Active State Re-alignment**: Uses the `visibilitychange` API to instantly resynchronize the hands and digital time whenever the browser tab is focused.
- **Fully Responsive & Accessible**: Scales fluidly on mobile, tablet, and desktop viewports, with full keyboard navigation support (`Enter` / `Space` toggle) and `@media (prefers-reduced-motion: reduce)` support.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure (`<main>`, `<header>`, `<svg>`, `<footer>`, `<button>`) |
| **CSS3** | Modern vanilla CSS styling, custom properties (CSS variables), keyframe animations, and flexbox |
| **Vanilla JavaScript** | Core chronometer math, vector SVG transforms, event handling, Battery API, and state management |
| **Google Fonts** | `Playfair Display`, `Cinzel`, and `Inter` |

---

## 📁 Project Structure

```text
Digital Clock/
├── .gitignore          # Version control ignore rules
├── index.html          # Semantic HTML5 document & SVG watch dial structure
├── style.css           # Vanilla CSS design system & responsive styling
├── script.js           # Core chronometer engine, vector math & complications
├── screenshot.png      # Application visual preview
└── README.md           # Comprehensive project documentation
```

---

## 🚀 How to Run Locally

Because this project is built entirely with client-side Vanilla HTML, CSS, and JavaScript, no build step or package installation is required.

### Option 1: Open Directly in Browser
Double-click `index.html` or drag it into any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).

### Option 2: Run via VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and click **Open with Live Server**.

### Option 3: Run via Node.js / npx
```bash
# Using npx serve
npx serve .

# Or using Python 3
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 🧠 Core JavaScript Concepts Explained

### 1. `new Date()`
Captures the client device's exact local time on every tick:
```javascript
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const ms = now.getMilliseconds();
```

### 2. Angular Hand Trigonometry & SVG Transforms
The hands rotate around the central coordinate origin `(0, 0)`:
```javascript
// Second hand: 360 deg / 60 sec = 6 deg/sec
const secondAngle = (seconds + ms / 1000) * 6;

// Minute hand: 6 deg/min + continuous progression
const minuteAngle = (minutes + seconds / 60) * 6;

// Hour hand: 360 deg / 12 hours = 30 deg/hour
const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;

// Apply clean SVG transform:
elements.secondHandGroup.setAttribute('transform', `rotate(${secondAngle})`);
```

### 3. `Intl.DateTimeFormat`
The native Internationalization API formats dates and calendar abbreviations accurately according to locale rules without third-party dependencies:
```javascript
const dayShort = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(now).toUpperCase();
const monthShort = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(now).toUpperCase();
```

### 4. `requestAnimationFrame()` & Battery Status API
- **`requestAnimationFrame(tick)`**: Synchronizes hand animation with the display's refresh rate (typically 60Hz or 120Hz) for silky smooth movement without battery drain.
- **`navigator.getBattery()`**: Detects real hardware battery percentage and listens to `levelchange` events.

---

## 🔗 Repository & Live Deployment

- **GitHub Repository**: [https://github.com/faizurrehman39804/Digital-Clock](https://github.com/faizurrehman39804/Digital-Clock)
- **Deployment to Vercel**:
  1. Go to [https://vercel.com/new](https://vercel.com/new).
  2. Select and import the `faizurrehman39804/Digital-Clock` repository.
  3. Keep the default settings (**Framework Preset: Other**, **Root Directory: `./`**).
  4. Click **Deploy**. Vercel will build and assign your live URL in seconds.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
