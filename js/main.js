// ============================================
// Zibbo Foods — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Auto-scroll to Products after hero ---
    let userHasScrolled = false;
    const onUserScroll = () => { userHasScrolled = true; };
    window.addEventListener('scroll', onUserScroll, { once: true });
    window.addEventListener('touchstart', onUserScroll, { once: true });
    window.addEventListener('wheel', onUserScroll, { once: true });

    setTimeout(() => {
        if (!userHasScrolled) {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: productsSection.getBoundingClientRect().top + window.pageYOffset - navHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, 2500);

    // --- Hero Image Carousel ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 3000);
    }

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
        threshold: 0.1,
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

    // Add fade-in class to animated elements
    const animatedElements = document.querySelectorAll(
        '.about-card, .product-card, .pillar-card, .contact-card, .whatsapp-cta-banner'
    );
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stagger animation for grid items
    document.querySelectorAll('.about-grid, .products-grid, .pillars-grid, .contact-grid').forEach(grid => {
        const cards = grid.children;
        Array.from(cards).forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // --- Product card gallery (dot switching + lightbox) ---
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbDots = document.getElementById('lightbox-dots');
    const lbClose = document.getElementById('lightbox-close');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    let lbImages = [];
    let lbIndex = 0;

    function openLightbox(images, startIndex) {
        lbImages = images;
        lbIndex = startIndex;
        renderLightbox();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function renderLightbox() {
        lbImg.src = lbImages[lbIndex];
        lbDots.innerHTML = lbImages.map((_, i) =>
            `<span class="ldot${i === lbIndex ? ' active' : ''}" data-i="${i}"></span>`
        ).join('');
        lbDots.querySelectorAll('.ldot').forEach(d => {
            d.addEventListener('click', () => { lbIndex = +d.dataset.i; renderLightbox(); });
        });
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; renderLightbox(); });
    lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbImages.length; renderLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; renderLightbox(); }
        if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; renderLightbox(); }
    });

    // Touch swipe for lightbox
    let lbTouchStartX = 0;
    lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - lbTouchStartX;
        if (Math.abs(dx) > 40) {
            lbIndex = dx < 0
                ? (lbIndex + 1) % lbImages.length
                : (lbIndex - 1 + lbImages.length) % lbImages.length;
            renderLightbox();
        }
    });

    // Wire up each product card image area
    document.querySelectorAll('.product-card-img[data-gallery]').forEach(imgArea => {
        const images = JSON.parse(imgArea.dataset.gallery);
        const dots = imgArea.querySelectorAll('.gdot');

        // Dot clicks open lightbox at that index
        dots.forEach((dot, i) => {
            dot.addEventListener('click', e => {
                e.stopPropagation();
                openLightbox(images, i);
            });
        });

        // Click anywhere on image area → open lightbox at index 0
        imgArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('gdot')) return;
            openLightbox(images, 0);
        });
    });

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
