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


    // =============================================
    // CART & CHECKOUT
    // =============================================

    const SHIPPING_FREE_THRESHOLD = 500; // in rupees
    const SHIPPING_CHARGE = 50;
    const MAX_QTY = 100;

    // Cart state: { productId: qty }
    const cart = {};

    // DOM refs
    const cartBar = document.getElementById('cart-bar');
    const cartBarCount = document.getElementById('cart-bar-count');
    const cartBarTotal = document.getElementById('cart-bar-total');
    const cartBarShipping = document.getElementById('cart-bar-shipping');
    const cartBarCheckout = document.getElementById('cart-bar-checkout');

    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutBackdrop = document.getElementById('checkout-backdrop');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutSummary = document.getElementById('checkout-summary');
    const checkoutShippingInfo = document.getElementById('checkout-shipping-info');
    const checkoutPayAmount = document.getElementById('checkout-pay-amount');
    const checkoutPayBtn = document.getElementById('checkout-pay-btn');

    const stepForm = document.getElementById('checkout-step-form');
    const stepSuccess = document.getElementById('checkout-step-success');
    const stepFailure = document.getElementById('checkout-step-failure');
    const successMsg = document.getElementById('checkout-success-msg');
    const failureMsg = document.getElementById('checkout-failure-msg');
    const doneBtn = document.getElementById('checkout-done-btn');
    const retryBtn = document.getElementById('checkout-retry-btn');

    // Get product info from DOM
    function getProductCards() {
        return document.querySelectorAll('.product-card[data-product-id]');
    }

    // --- Qty Picker Logic ---
    getProductCards().forEach(card => {
        const id = card.dataset.productId;
        const qtyValue = card.querySelector('.qty-value');
        const qtyMinus = card.querySelector('.qty-minus');
        const qtyPlus = card.querySelector('.qty-plus');
        const qtyPicker = card.querySelector('.qty-picker');
        const addBtn = card.querySelector('.add-to-cart-btn');

        cart[id] = 0;

        function syncUI() {
            qtyValue.textContent = cart[id];
            if (cart[id] > 0) {
                addBtn.style.display = 'none';
                qtyPicker.style.display = '';
                qtyPicker.classList.add('has-items');
            } else {
                addBtn.style.display = '';
                qtyPicker.style.display = 'none';
                qtyPicker.classList.remove('has-items');
            }
            updateCartBar();
        }

        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cart[id] = 1;
            syncUI();
        });

        qtyPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            if (cart[id] < MAX_QTY) {
                cart[id]++;
                syncUI();
            }
        });

        qtyMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            if (cart[id] > 0) {
                cart[id]--;
                syncUI();
            }
        });
    });

    function getCartItems() {
        const items = [];
        getProductCards().forEach(card => {
            const id = card.dataset.productId;
            const qty = cart[id] || 0;
            if (qty > 0) {
                items.push({
                    id,
                    name: card.dataset.productName,
                    price: parseInt(card.dataset.productPrice, 10),
                    qty,
                });
            }
        });
        return items;
    }

    function getCartSubtotal(items) {
        return items.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getShipping(subtotal) {
        return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_CHARGE;
    }

    function updateCartBar() {
        const items = getCartItems();
        const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
        const subtotal = getCartSubtotal(items);
        const shipping = getShipping(subtotal);
        const total = subtotal + shipping;

        if (totalItems > 0) {
            cartBar.classList.add('visible');
            cartBarCount.textContent = totalItems === 1 ? '1 item' : `${totalItems} items`;
            cartBarTotal.textContent = `₹${subtotal}`;
            if (shipping > 0) {
                cartBarShipping.textContent = `(+₹${shipping} shipping)`;
            } else {
                cartBarShipping.textContent = 'Free shipping';
            }
        } else {
            cartBar.classList.remove('visible');
        }
    }

    // --- Checkout Modal ---
    cartBarCheckout.addEventListener('click', openCheckout);

    function openCheckout() {
        const items = getCartItems();
        if (items.length === 0) return;

        // Reset to form step
        stepForm.style.display = '';
        stepForm.classList.remove('checkout-step-hidden');
        stepSuccess.style.display = 'none';
        stepSuccess.classList.add('checkout-step-hidden');
        stepFailure.style.display = 'none';
        stepFailure.classList.add('checkout-step-hidden');

        // Render order summary
        const subtotal = getCartSubtotal(items);
        const shipping = getShipping(subtotal);
        const total = subtotal + shipping;

        let summaryHTML = items.map(item => `
            <div class="checkout-summary-item">
                <div>
                    <span class="checkout-summary-item-name">${item.name}</span>
                    <span class="checkout-summary-item-qty"> × ${item.qty}</span>
                </div>
                <span class="checkout-summary-item-price">₹${item.price * item.qty}</span>
            </div>
        `).join('');

        if (shipping > 0) {
            summaryHTML += `
                <div class="checkout-summary-divider"></div>
                <div class="checkout-summary-item">
                    <span class="checkout-summary-item-name">Shipping</span>
                    <span class="checkout-summary-item-price">₹${shipping}</span>
                </div>
            `;
        }

        summaryHTML += `
            <div class="checkout-summary-divider"></div>
            <div class="checkout-summary-total">
                <span class="checkout-summary-total-label">Total</span>
                <span class="checkout-summary-total-price">₹${total}</span>
            </div>
        `;

        checkoutSummary.innerHTML = summaryHTML;

        // Shipping info
        if (shipping === 0) {
            checkoutShippingInfo.innerHTML = '<span class="checkout-shipping-free">Free shipping applied</span>';
        } else {
            const remaining = SHIPPING_FREE_THRESHOLD - subtotal;
            checkoutShippingInfo.textContent = `Add ₹${remaining} more for free shipping`;
        }

        checkoutPayAmount.textContent = `₹${total}`;

        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    checkoutClose.addEventListener('click', closeCheckout);
    checkoutBackdrop.addEventListener('click', closeCheckout);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && checkoutModal.classList.contains('open')) {
            closeCheckout();
        }
    });

    doneBtn.addEventListener('click', () => {
        // Reset cart
        Object.keys(cart).forEach(id => { cart[id] = 0; });
        getProductCards().forEach(card => {
            card.querySelector('.qty-value').textContent = '0';
            card.querySelector('.qty-picker').style.display = 'none';
            card.querySelector('.qty-picker').classList.remove('has-items');
            card.querySelector('.add-to-cart-btn').style.display = '';
        });
        updateCartBar();
        closeCheckout();
    });

    retryBtn.addEventListener('click', () => {
        stepFailure.style.display = 'none';
        stepFailure.classList.add('checkout-step-hidden');
        stepForm.style.display = '';
        stepForm.classList.remove('checkout-step-hidden');
    });

    // --- Form Submit → Cashfree ---
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        checkoutPayBtn.disabled = true;
        checkoutPayBtn.textContent = 'Processing...';

        const customer = {
            name: document.getElementById('cust-name').value.trim(),
            phone: document.getElementById('cust-phone').value.trim(),
            address: document.getElementById('cust-address').value.trim(),
            city: document.getElementById('cust-city').value.trim(),
            state: document.getElementById('cust-state').value.trim(),
            pincode: document.getElementById('cust-pincode').value.trim(),
        };

        const items = getCartItems();

        try {
            // 1. Create order on server
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ id: i.id, qty: i.qty })),
                    customer,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to create order');
            }

            const orderData = await res.json();

            // Store order info for verification after redirect
            sessionStorage.setItem('zibbo_pending_order', JSON.stringify({
                orderId: orderData.orderId,
                amount: orderData.amount,
            }));

            // 2. Open Cashfree checkout
            const cashfree = Cashfree({ mode: orderData.cfMode || 'production' });

            cashfree.checkout({
                paymentSessionId: orderData.paymentSessionId,
                redirectTarget: '_self',
            });

            // Note: For redirect mode, the page will navigate away.
            // User returns to /api/verify-payment which redirects to /?payment=success/failed
            // The handlePaymentReturn() function below handles showing success/failure on return.

        } catch (err) {
            showFailure(err.message || 'Something went wrong. Please try again.');
        }
    });

    // --- Handle return from Cashfree redirect ---
    function handlePaymentReturn() {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');
        const orderId = params.get('order_id');
        const amount = params.get('amount');

        if (!paymentStatus) return;

        // Clean URL
        window.history.replaceState({}, '', '/');

        if (paymentStatus === 'success') {
            // Reset cart
            Object.keys(cart).forEach(id => { cart[id] = 0; });
            getProductCards().forEach(card => {
                card.querySelector('.qty-value').textContent = '0';
                card.querySelector('.qty-picker').style.display = 'none';
                card.querySelector('.qty-picker').classList.remove('has-items');
                card.querySelector('.add-to-cart-btn').style.display = '';
            });
            updateCartBar();

            // Show success modal
            checkoutModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            showSuccess(orderId, parseFloat(amount) * 100);
        } else {
            checkoutModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            showFailure('Payment was not completed. Please try again or contact us on WhatsApp.');
        }

        sessionStorage.removeItem('zibbo_pending_order');
    }

    handlePaymentReturn();

    function resetPayBtn() {
        const items = getCartItems();
        const subtotal = getCartSubtotal(items);
        const shipping = getShipping(subtotal);
        const total = subtotal + shipping;
        checkoutPayBtn.disabled = false;
        checkoutPayBtn.innerHTML = `Pay <span id="checkout-pay-amount">₹${total}</span>`;
    }

    function showSuccess(paymentId, amountPaise) {
        stepForm.style.display = 'none';
        stepForm.classList.add('checkout-step-hidden');
        stepFailure.style.display = 'none';
        stepFailure.classList.add('checkout-step-hidden');
        stepSuccess.style.display = '';
        stepSuccess.classList.remove('checkout-step-hidden');
        successMsg.textContent = `Payment of ₹${(amountPaise / 100).toFixed(0)} received. Payment ID: ${paymentId}`;
        resetPayBtn();
    }

    function showFailure(msg) {
        stepForm.style.display = 'none';
        stepForm.classList.add('checkout-step-hidden');
        stepSuccess.style.display = 'none';
        stepSuccess.classList.add('checkout-step-hidden');
        stepFailure.style.display = '';
        stepFailure.classList.remove('checkout-step-hidden');
        failureMsg.textContent = msg;
        resetPayBtn();
    }
});
