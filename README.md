# ⏱️ Digital Clock

> A modern, minimalist, high-precision Digital Clock web application built with semantic **HTML5**, responsive **CSS3 (Glassmorphism)**, and **Vanilla JavaScript**.

![Digital Clock Screenshot](https://raw.githubusercontent.com/faizurrehman39804/Digital-Clock/main/screenshot.png)

---

## 🌟 Key Features

- **Real-Time Precision Clock**: Reads the client's local system time using the native JavaScript `Date` object and updates automatically every second.
- **12-Hour & 24-Hour Switchable Formats**: Smooth interactive toggle switch with accessible ARIA attributes (`role="switch"`, `aria-checked`), updating the UI immediately without restarting timer intervals.
- **AM/PM Period Badge**: Dynamically shown in 12-hour mode and cleanly hidden in 24-hour mode.
- **Full Calendar Date**: Displays formatted current weekday, month, day, and year using the browser's high-performance `Intl.DateTimeFormat` API.
- **Client Timezone & Offset**: Automatically detects and displays the user's localized timezone (e.g. `Asia/Karachi (GMT+5)`).
- **Persistent Preferences**: Saves the user's selected 12h/24h mode in `localStorage` so settings persist across sessions and page refreshes.
- **Active State Re-alignment**: Uses the `visibilitychange` API to instantly resynchronize the clock whenever the user switches back to the browser tab.
- **Premium Glassmorphism Aesthetic**: Dark futuristic canvas featuring multi-layer ambient radial gradients, frosted glass backdrop filters, and luminescent cyan text glows.
- **Tabular Monospace Digits**: Built with Google Font `JetBrains Mono` and `font-variant-numeric: tabular-nums` to eliminate number jittering or horizontal layout shifts as seconds tick.
- **Fully Responsive & Accessible**: Fluid typography using CSS `clamp()`, WCAG compliant contrast, keyboard navigation (`Enter` / `Space` toggle), and `@media (prefers-reduced-motion: reduce)` support.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure (`<main>`, `<header>`, `<time>`, `<section>`, `<footer>`, `<button>`) |
| **CSS3** | Vanilla CSS with custom properties (CSS variables), glassmorphism (`backdrop-filter`), flexbox, and keyframe animations |
| **Vanilla JavaScript** | Modern ES6+ logic, event handling, interval timing, and DOM manipulation without any heavy frameworks |
| **Google Fonts** | `Outfit` (clean UI headers and badges) & `JetBrains Mono` (crisp monospace tabular digits) |

---

## 📁 Project Structure

```text
Digital Clock/
├── .gitignore          # Version control ignore list
├── index.html          # Semantic HTML5 document markup
├── style.css           # Vanilla CSS design system & responsive styling
├── script.js           # Core Vanilla JS time engine & state management
└── README.md           # Project documentation and guide
```

---

## 🚀 How to Run Locally

Because this project is built entirely with client-side Vanilla HTML, CSS, and JavaScript, no build step or package installation is required.

### Option 1: Open Directly in Browser
Double-click `index.html` or drag it into any modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari).

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
Creates a new JavaScript Date instance representing the exact current moment on the user's local machine:
```javascript
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
```

### 2. `Intl.DateTimeFormat`
The native Internationalization API formats dates and times accurately according to locale rules without relying on bulky external libraries like Moment.js:
```javascript
const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(now);
const fullDate = new Intl.DateTimeFormat(undefined, { 
  month: 'long', 
  day: 'numeric', 
  year: 'numeric' 
}).format(now);
```

### 3. `setInterval()` and `clearInterval()`
- **`setInterval(callback, 1000)`**: Schedules the `updateClock` function to run repeatedly every 1,000 milliseconds (1 second).
- **`clearInterval(timerId)`**: Cleans up and destroys an existing timer. This is critical before starting any new timer to prevent interval stacking, duplicate executions, and browser memory leaks.
```javascript
function startClock() {
  if (state.intervalId !== null) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  updateClock(); // Execute immediately so user doesn't wait 1s for initial render
  state.intervalId = setInterval(updateClock, 1000);
}
```

### 4. DOM Selection & Safe Content Injection
Elements are cached during initialization using `document.getElementById()`. Text is updated via `textContent` rather than `innerHTML` to ensure peak performance and eliminate cross-site scripting (XSS) risks.

---

## 🔗 Repository & Live Deployment

- **GitHub Repository**: [https://github.com/faizurrehman39804/Digital-Clock](https://github.com/faizurrehman39804/Digital-Clock)
- **Live Vercel URL**: Deployed to Vercel (see deployment section below)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
