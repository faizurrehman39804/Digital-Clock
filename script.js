/**
 * ==============================================================================
 * DIGITAL CLOCK — CORE APPLICATION JAVASCRIPT
 * ==============================================================================
 * This script provides the real-time logic for the Digital Clock application.
 *
 * Core JavaScript Concepts Utilized:
 * 1. Date: Obtains the current instantaneous timestamp from the client device.
 * 2. toLocaleTimeString(): Formats the local time strings with locale options.
 * 3. Intl.DateTimeFormat: High-performance internationalization API for dates & timezones.
 * 4. setInterval(): Executes recurring callback functions at specified intervals (1000ms).
 * 5. clearInterval(): Cancels and cleans up active timers to prevent memory leaks or duplicate ticks.
 * 6. addEventListener(): Binds user events (clicks, keypresses) to interactive controls.
 * 7. DOM Selection & textContent: Securely updates element contents without innerHTML parsing overhead.
 * ==============================================================================
 */

'use strict';

// ------------------------------------------------------------------------------
// 1. DOM Element Cache
// ------------------------------------------------------------------------------
const elements = {
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  periodBadge: document.getElementById('periodBadge'),
  periodWrapper: document.getElementById('periodWrapper'),
  dayName: document.getElementById('dayName'),
  fullDate: document.getElementById('fullDate'),
  timezoneText: document.getElementById('timezoneText'),
  formatToggle: document.getElementById('formatToggle'),
  tag12: document.querySelector('.tag-12'),
  tag24: document.querySelector('.tag-24'),
};

// ------------------------------------------------------------------------------
// 2. State Management
// ------------------------------------------------------------------------------
/**
 * Application state object.
 * @property {boolean} is24Hour - Whether 24-hour mode is active.
 * @property {number|null} intervalId - Holds reference to the active setInterval ID.
 * @property {string|null} lastRenderedDate - Cache of the last formatted date to prevent redundant DOM updates.
 */
const state = {
  is24Hour: false,
  intervalId: null,
  lastRenderedDate: null,
};

// Storage key for user preference persistence
const STORAGE_KEY = 'digital_clock_is_24h';

// ------------------------------------------------------------------------------
// 3. Helper Functions & Formatting
// ------------------------------------------------------------------------------

/**
 * Pads single-digit numbers with a leading zero (e.g., 7 -> "07").
 * @param {number} num - The number to pad.
 * @returns {string} - Two-digit zero-padded string.
 */
function padZero(num) {
  return String(num).padStart(2, '0');
}

/**
 * Resolves the user's local timezone string and GMT offset.
 * Example: "Asia/Karachi (GMT+5)" or "America/New_York (GMT-4)"
 * @returns {string}
 */
function getLocalTimezoneDisplay() {
  try {
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const now = new Date();
    // Calculate offset in hours
    const offsetMinutes = -now.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const formattedOffset = `GMT${sign}${hours}${minutes > 0 ? `:${padZero(minutes)}` : ''}`;

    return `${tzName} (${formattedOffset})`;
  } catch (error) {
    console.warn('Unable to resolve timezone:', error);
    return 'Local Time';
  }
}

/**
 * Formats date using Intl.DateTimeFormat for localization accuracy.
 * @param {Date} date - The current Date instance.
 * @returns {{ weekday: string, fullDate: string }}
 */
function formatDate(date) {
  // Extract weekday name (e.g. "Saturday")
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
  const weekday = weekdayFormatter.format(date);

  // Extract month, day, and year (e.g. "October 17, 2026")
  const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const fullDate = fullDateFormatter.format(date);

  return { weekday, fullDate };
}

// ------------------------------------------------------------------------------
// 4. Clock Render Engine
// ------------------------------------------------------------------------------

/**
 * Core update function that reads current local time and paints the DOM.
 * Demonstrates:
 * - new Date() to get current device time
 * - toLocaleTimeString() & Intl.DateTimeFormat for formatting
 * - DOM textContent updates
 */
function updateClock() {
  const now = new Date();

  // --- TIME CALCULATION ---
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let period = '';

  if (state.is24Hour) {
    // 24-Hour Format: 00 to 23
    elements.hours.textContent = padZero(hours);
    elements.minutes.textContent = padZero(minutes);
    elements.seconds.textContent = padZero(seconds);

    // Hide period indicator in 24-hour mode
    if (!elements.periodWrapper.classList.contains('hidden')) {
      elements.periodWrapper.classList.add('hidden');
    }
  } else {
    // 12-Hour Format: 01 to 12 with AM/PM indicator
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12 AM

    elements.hours.textContent = padZero(hours);
    elements.minutes.textContent = padZero(minutes);
    elements.seconds.textContent = padZero(seconds);
    elements.periodBadge.textContent = period;

    // Show period indicator in 12-hour mode
    if (elements.periodWrapper.classList.contains('hidden')) {
      elements.periodWrapper.classList.remove('hidden');
    }
  }

  // --- DATE UPDATE ---
  // Only update DOM when date string actually changes (avoids redundant paint ops)
  const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  if (state.lastRenderedDate !== dateKey) {
    const { weekday, fullDate } = formatDate(now);
    elements.dayName.textContent = weekday;
    elements.fullDate.textContent = fullDate;
    state.lastRenderedDate = dateKey;
  }
}

// ------------------------------------------------------------------------------
// 5. Interval & Timer Management
// ------------------------------------------------------------------------------

/**
 * Starts the master clock interval.
 * Uses clearInterval() beforehand to prevent duplicate intervals from ever stacking.
 */
function startClock() {
  // Clear any existing active interval to guarantee a single source of truth
  if (state.intervalId !== null) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  // Execute immediately so there is zero delay on initial render or toggle
  updateClock();

  // Schedule continuous updates every 1,000 milliseconds (1 second)
  state.intervalId = setInterval(updateClock, 1000);
}

/**
 * Stops the master clock interval safely.
 */
function stopClock() {
  if (state.intervalId !== null) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
}

// ------------------------------------------------------------------------------
// 6. User Interaction & Format Toggle
// ------------------------------------------------------------------------------

/**
 * Synchronizes UI controls (switch button & tags) with current format state.
 */
function syncToggleUI() {
  const is24 = state.is24Hour;
  elements.formatToggle.setAttribute('aria-checked', String(is24));

  if (is24) {
    elements.tag24.classList.add('active');
    elements.tag12.classList.remove('active');
  } else {
    elements.tag12.classList.add('active');
    elements.tag24.classList.remove('active');
  }
}

/**
 * Handles format toggle switch click or keyboard activation.
 */
function handleFormatToggle() {
  state.is24Hour = !state.is24Hour;

  // Persist preference to localStorage if supported
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.is24Hour));
  } catch (err) {
    console.warn('localStorage is not available:', err);
  }

  syncToggleUI();

  // Re-render immediately to reflect the change smoothly without restarting interval
  updateClock();
}

/**
 * Restores persisted user settings from localStorage.
 */
function loadPersistedSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      state.is24Hour = JSON.parse(saved) === true;
    }
  } catch (err) {
    console.warn('Error reading saved format preference:', err);
  }
}

// ------------------------------------------------------------------------------
// 7. Initialization Lifecycle
// ------------------------------------------------------------------------------

/**
 * Main application bootstrap function.
 */
function initClockApp() {
  // 1. Load preferences
  loadPersistedSettings();

  // 2. Sync toggle UI to loaded preference
  syncToggleUI();

  // 3. Display user timezone
  elements.timezoneText.textContent = getLocalTimezoneDisplay();

  // 4. Bind event listeners
  elements.formatToggle.addEventListener('click', handleFormatToggle);

  // Keyboard accessibility: Allow Space & Enter to toggle
  elements.formatToggle.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleFormatToggle();
    }
  });

  // Handle document visibility change to resynchronize clock instantly when tab is focused
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Re-align clock immediately when user returns to tab
      updateClock();
    }
  });

  // 5. Start clock cycle
  startClock();
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClockApp);
} else {
  initClockApp();
}
