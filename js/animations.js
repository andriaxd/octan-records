// Scroll Animations and Effects
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollProgress();
        this.setupIntersectionObserver();
        this.setupParallax();
    }

    createScrollProgress() {
        const progressHTML = `
            <div class="scroll-progress" id="scroll-progress"></div>
        `;
        document.body.insertAdjacentHTML('afterbegin', progressHTML);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            document.getElementById('scroll-progress').style.width = `${scrolled}%`;
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section, .card, .release-card, .grid').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize scroll animations
    window.scrollAnimations = new ScrollAnimations();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
