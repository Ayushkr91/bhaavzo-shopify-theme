/**
 * Bhaavzo Theme - Core Client JavaScript
 * Online Store 2.0 Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initCountdownTimer();
  initPincodeChecker();
  initProductGallery();
  initStickyMobileAtc();
  initCollectionFilters();
});

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-nav__close');

  if (!menuToggle || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items for clean single accordion behaviour
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Deal of the Day Real-time Countdown Timer
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const timerContainer = document.querySelector('.countdown-timer');
  if (!timerContainer) return;

  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set target to tonight midnight or 12 hours from now
  const now = new Date();
  const target = new Date();
  target.setHours(23, 59, 59, 999);

  function updateTimer() {
    const currentTime = new Date();
    const diff = target - currentTime;

    if (diff <= 0) {
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   Indian Pincode Checker (Delhivery / Bluedart simulation)
   -------------------------------------------------------------------------- */
function initPincodeChecker() {
  const pincodeForm = document.getElementById('pincode-form');
  const pincodeInput = document.getElementById('pincode-input');
  const pincodeResult = document.getElementById('pincode-result');

  if (!pincodeForm || !pincodeInput || !pincodeResult) return;

  pincodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = pincodeInput.value.trim();

    if (!/^\d{6}$/.test(pin)) {
      pincodeResult.innerHTML = '<span style="color: var(--color-danger);">⚠️ Please enter a valid 6-digit Indian PIN code.</span>';
      return;
    }

    pincodeResult.innerHTML = '<span style="color: var(--color-text-muted);">Checking courier availability...</span>';

    setTimeout(() => {
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3);

      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', options);

      pincodeResult.innerHTML = `
        <div style="color: var(--color-success); font-weight: 600; display: flex; align-items: center; gap: 6px;">
          <span>✅ COD & Express Delivery Available to <strong>${pin}</strong></span>
        </div>
        <div style="color: var(--color-text-muted); font-size: 0.8rem; margin-top: 2px;">
          Expected delivery by <strong>${formattedDate}</strong> via Delhivery / Bluedart.
        </div>
      `;
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   Product Gallery Image Switcher
   -------------------------------------------------------------------------- */
function initProductGallery() {
  const mainImage = document.getElementById('pdp-main-image');
  const thumbnails = document.querySelectorAll('.pdp-thumb');

  if (!mainImage || !thumbnails.length) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.getAttribute('data-full-img');
      if (newSrc) {
        mainImage.src = newSrc;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Sticky Mobile Add to Cart Bar
   -------------------------------------------------------------------------- */
function initStickyMobileAtc() {
  const stickyBar = document.querySelector('.sticky-mobile-atc');
  const mainAtcBtn = document.querySelector('.pdp-btn-add-to-cart');

  if (!stickyBar || !mainAtcBtn) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // When main CTA is NOT intersecting (scrolled past), show sticky bar
      if (!entry.isIntersecting) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(mainAtcBtn);
}

/* --------------------------------------------------------------------------
   Collection Filtering & Sorting
   -------------------------------------------------------------------------- */
function initCollectionFilters() {
  const sortSelect = document.getElementById('collection-sort');
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.collection-grid .product-card');

  if (!productCards.length) return;

  // Filter click handling
  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.toLowerCase().includes(category.toLowerCase())) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Sort change handling
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.querySelector('.collection-grid');
      const cardsArray = Array.from(productCards);
      const sortBy = sortSelect.value;

      cardsArray.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price') || '0');
        const priceB = parseFloat(b.getAttribute('data-price') || '0');

        if (sortBy === 'price-low-high') return priceA - priceB;
        if (sortBy === 'price-high-low') return priceB - priceA;
        if (sortBy === 'best-selling') {
          return parseFloat(b.getAttribute('data-rating') || '0') - parseFloat(a.getAttribute('data-rating') || '0');
        }
        return 0;
      });

      cardsArray.forEach(card => grid.appendChild(card));
    });
  }
}
