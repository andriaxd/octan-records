// Theme Toggle - Dark/Light Mode
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.attachEventListeners();
    }

    createToggleButton() {
        const toggleHTML = `
            <button class="theme-toggle" id="theme-toggle" title="Toggle Theme" aria-label="Toggle dark/light mode">
                <svg class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </button>
        `;

        // Insert after header or at top of body
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('beforeend', toggleHTML);
        }
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('theme-toggle');
        toggleBtn?.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update icon visibility
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (theme === 'light') {
            sunIcon?.style.setProperty('display', 'none');
            moonIcon?.style.setProperty('display', 'block');
        } else {
            sunIcon?.style.setProperty('display', 'block');
            moonIcon?.style.setProperty('display', 'none');
        }
    }
}

// Initialize theme toggle
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeToggle = new ThemeToggle();
    });
} else {
    window.themeToggle = new ThemeToggle();
}
