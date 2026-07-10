// ============================================
// Zibbo Foods — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- Navbar scroll effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(27, 94, 32, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll animations ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to sections
    const animatedElements = document.querySelectorAll(
        '.about-card, .product-showcase, .pillar-card, .contact-card, .notify-content'
    );
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stagger animation for grid items
    document.querySelectorAll('.about-grid, .pillars-grid, .contact-grid').forEach(grid => {
        const cards = grid.children;
        Array.from(cards).forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // --- Notify tabs (Email / Mobile toggle) ---
    const notifyTabs = document.querySelectorAll('.notify-tab');
    const emailInput = document.getElementById('notify-email');
    const mobileInput = document.getElementById('notify-mobile');
    let activeTab = 'email';

    notifyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            notifyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;

            if (activeTab === 'email') {
                emailInput.style.display = '';
                emailInput.required = true;
                mobileInput.style.display = 'none';
                mobileInput.required = false;
                mobileInput.value = '';
            } else {
                emailInput.style.display = 'none';
                emailInput.required = false;
                emailInput.value = '';
                mobileInput.style.display = '';
                mobileInput.required = true;
            }
        });
    });

    // --- Notify form submit (sends to Google Sheets via Apps Script) ---
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwV23tvoc1Il6mKQsts5e9XgQg-g7vpGfn77Nk-nzrR-ojjbnCYkTH7yHnE2duwJ0z6Tw/exec';

    const notifyForm = document.getElementById('notify-form');
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = notifyForm.querySelector('button[type="submit"]');
            const value = activeTab === 'email' ? emailInput.value.trim() : mobileInput.value.trim();
            const type = activeTab;

            if (!value) return;

            // Disable form while submitting
            emailInput.disabled = true;
            mobileInput.disabled = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: type === 'email' ? value : '', mobile: type === 'mobile' ? value : '', type: type })
            })
            .then(() => {
                const label = type === 'email' ? value : value;
                const notifySection = document.querySelector('.notify-content');
                const tabsEl = document.querySelector('.notify-tabs');
                if (tabsEl) tabsEl.style.display = 'none';
                notifyForm.innerHTML = `
                    <div class="notify-success show">
                        <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">You're on the list!</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">We'll notify you at <strong>${label}</strong> when Zibbo launches.</p>
                    </div>
                `;
            })
            .catch(() => {
                emailInput.disabled = false;
                mobileInput.disabled = false;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Notify Me';
                alert('Something went wrong. Please try again.');
            });
        });
    }

    // --- Active nav link highlight on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#2E7D32';
            }
        });
    });
});
