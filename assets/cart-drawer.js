/**
 * Bhaavzo Theme - Cart Drawer & Free Shipping Bar Manager
 * Preserves Shopify's native checkout route (/checkout)
 */

window.BhaavzoCart = (function() {
  const FREE_SHIPPING_THRESHOLD = 999; // ₹999 for free delivery in India

  // Initial cart state stored in localStorage or mock session
  let cartState = {
    items: [],
    subtotal: 0,
    itemCount: 0
  };

  function init() {
    loadCart();
    bindEvents();
    renderCart();
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem('bhaavzo_cart');
      if (saved) {
        cartState = JSON.parse(saved);
      } else {
        // Pre-populate with 1 sample item so user immediately sees a working cart drawer experience
        cartState = {
          items: [
            {
              id: 'mini-rechargeable-vacuum-cleaner-black',
              handle: 'mini-rechargeable-vacuum-cleaner',
              title: 'Mini Rechargeable Vacuum Cleaner',
              variant: 'Matte Black',
              price: 1299,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80'
            }
          ],
          subtotal: 1299,
          itemCount: 1
        };
        saveCart();
      }
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }
  }

  function saveCart() {
    recalculateSubtotal();
    try {
      localStorage.setItem('bhaavzo_cart', JSON.stringify(cartState));
    } catch (e) {}
    updateHeaderBadge();
  }

  function recalculateSubtotal() {
    let subtotal = 0;
    let count = 0;
    cartState.items.forEach(item => {
      subtotal += item.price * item.quantity;
      count += item.quantity;
    });
    cartState.subtotal = subtotal;
    cartState.itemCount = count;
  }

  function updateHeaderBadge() {
    const badges = document.querySelectorAll('.cart-count-badge, .chic-cart-badge');
    badges.forEach(b => {
      b.textContent = cartState.itemCount;
      b.style.display = cartState.itemCount > 0 ? 'flex' : 'none';
      b.classList.remove('bounce');
      void b.offsetWidth;
      b.classList.add('bounce');
    });
  }

  function bindEvents() {
    // Open cart drawer triggers
    document.querySelectorAll('.cart-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    // Close drawer buttons
    const closeBtn = document.querySelector('.cart-drawer__close');
    const backdrop = document.querySelector('.drawer-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Add to cart buttons across the theme
    document.addEventListener('click', (e) => {
      const atcBtn = e.target.closest('.js-add-to-cart');
      if (atcBtn) {
        e.preventDefault();
        const id = atcBtn.getAttribute('data-id') || 'item-' + Date.now();
        const handle = atcBtn.getAttribute('data-handle') || '';
        const title = atcBtn.getAttribute('data-title') || 'Smart Product';
        const variant = atcBtn.getAttribute('data-variant') || 'Default';
        const price = parseFloat(atcBtn.getAttribute('data-price') || '599');
        const image = atcBtn.getAttribute('data-image') || '';
        const qty = parseInt(atcBtn.getAttribute('data-quantity') || '1', 10);

        addItem({ id, handle, title, variant, price, image, quantity: qty });
        openDrawer();
      }

      // Quantity adjustments inside drawer
      const qtyBtn = e.target.closest('.js-cart-qty-btn');
      if (qtyBtn) {
        const id = qtyBtn.getAttribute('data-id');
        const delta = parseInt(qtyBtn.getAttribute('data-delta'), 10);
        updateQuantity(id, delta);
      }

      // Remove item inside drawer
      const removeBtn = e.target.closest('.js-cart-remove');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeItem(id);
      }
    });
  }

  function openDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    if (drawer && backdrop) {
      renderCart();
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function addItem(item) {
    const existing = cartState.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cartState.items.push(item);
    }
    saveCart();
    renderCart();
  }

  function updateQuantity(id, delta) {
    const item = cartState.items.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(id);
    } else {
      saveCart();
      renderCart();
    }
  }

  function removeItem(id) {
    cartState.items = cartState.items.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const itemsContainer = document.querySelector('.cart-drawer__items');
    const subtotalEl = document.querySelector('.cart-subtotal-amount');
    const freeShippingText = document.querySelector('.free-shipping-text');
    const freeShippingProgress = document.querySelector('.free-shipping-progress');

    updateHeaderBadge();

    if (!itemsContainer) return;

    if (cartState.items.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--color-text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🛒</div>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">Your cart is empty</h4>
          <p style="font-size: 0.9rem; margin-bottom: 20px;">Explore Bhaavzo's smart finds to add utility to your home.</p>
          <a href="/collections/all" class="btn btn--primary btn--sm" style="display: inline-flex;">Start Shopping</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (freeShippingProgress) freeShippingProgress.style.width = '0%';
      if (freeShippingText) {
        freeShippingText.innerHTML = `🚚 Add <strong>₹${FREE_SHIPPING_THRESHOLD}</strong> more for <strong>FREE Delivery</strong>!`;
        freeShippingText.classList.remove('achieved');
      }
      return;
    }

    // Render items list
    itemsContainer.innerHTML = cartState.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item__img" />
        <div>
          <h4 class="cart-item__title">${item.title}</h4>
          <div class="cart-item__variant">${item.variant}</div>
          <div class="cart-item__price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="quantity-stepper" style="margin-top: 8px;">
            <button class="stepper-btn js-cart-qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">-</button>
            <span class="stepper-input">${item.quantity}</span>
            <button class="stepper-btn js-cart-qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item__remove js-cart-remove" data-id="${item.id}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

    // Update Subtotal
    if (subtotalEl) {
      subtotalEl.textContent = `₹${cartState.subtotal.toLocaleString('en-IN')}`;
    }

    // Update Free Shipping Progress
    if (freeShippingProgress && freeShippingText) {
      const remaining = FREE_SHIPPING_THRESHOLD - cartState.subtotal;
      const progressPercent = Math.min(100, Math.round((cartState.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingProgress.style.width = `${progressPercent}%`;

      if (remaining <= 0) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE Delivery</strong>!`;
        freeShippingText.classList.add('achieved');
      } else {
        freeShippingText.innerHTML = `🚚 Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>!`;
        freeShippingText.classList.remove('achieved');
      }
    }
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    addItem,
    getState: () => cartState
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.BhaavzoCart.init();
});
