/**
 * Bhaavzo Theme - Native Shopify AJAX Cart & Drawer Manager
 * Fully integrated with Shopify Online Store 2.0 native endpoints:
 * - GET /cart.js
 * - POST /cart/add.js
 * - POST /cart/change.js
 * - POST /cart/clear.js
 */

window.BhaavzoCart = (function() {
  const FREE_SHIPPING_THRESHOLD = 999; // ₹999 for free delivery in India

  let cartData = {
    items: [],
    total_price: 0,
    item_count: 0
  };

  let isLoading = false;

  function init() {
    bindEvents();
    fetchCart();
  }

  /**
   * Fetch current cart state from Shopify native /cart.js
   */
  async function fetchCart() {
    try {
      const response = await fetch('/cart.js', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (response.ok) {
        cartData = await response.json();
        renderCart();
      } else {
        // Fallback for non-Shopify local static server
        console.info('Shopify /cart.js returned status', response.status);
      }
    } catch (err) {
      console.warn('Could not connect to /cart.js:', err);
    }
  }

  /**
   * Add item to Shopify native cart via POST /cart/add.js
   * @param {Object} payload - { id: variantId, quantity: qty }
   */
  async function addItem(payload) {
    if (isLoading) return;
    isLoading = true;

    try {
      // Ensure numerical variant ID is passed to Shopify
      const variantId = parseInt(payload.id, 10) || payload.id;
      const quantity = parseInt(payload.quantity, 10) || 1;

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.description || data.message || 'Unable to add item to cart.';
        showToast(`⚠️ ${errorMsg}`);
        return false;
      }

      // Success: Re-fetch latest authoritative server cart
      await fetchCart();
      showToast(`✓ Added to cart: ${data.title || 'Item'}`);
      openDrawer();
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('⚠️ Could not connect to cart service.');
      return false;
    } finally {
      isLoading = false;
    }
  }

  /**
   * Update item quantity via POST /cart/change.js
   * @param {string|number} itemKeyOrId
   * @param {number} newQuantity
   */
  async function changeQuantity(itemKeyOrId, newQuantity) {
    if (isLoading) return;
    isLoading = true;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: itemKeyOrId,
          quantity: Math.max(0, newQuantity)
        })
      });

      const updatedCart = await response.json();

      if (response.ok) {
        cartData = updatedCart;
        renderCart();
      } else {
        const errorMsg = updatedCart.description || 'Could not update quantity.';
        showToast(`⚠️ ${errorMsg}`);
        await fetchCart();
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      showToast('⚠️ Network error updating cart.');
    } finally {
      isLoading = false;
    }
  }

  /**
   * Remove item completely from cart
   */
  function removeItem(itemKeyOrId) {
    return changeQuantity(itemKeyOrId, 0);
  }

  /**
   * Format prices properly (Shopify prices in paise / cents)
   */
  function formatMoney(cents) {
    if (typeof cents !== 'number') cents = parseFloat(cents) || 0;
    // In Shopify, prices are integers representing paise (₹1 = 100 paise)
    const rupees = cents > 9999 ? Math.round(cents / 100) : cents;
    return '₹' + rupees.toLocaleString('en-IN');
  }

  function updateHeaderBadge() {
    const badges = document.querySelectorAll('.cart-count-badge, .chic-cart-badge, .cart-icon-badge');
    const count = cartData.item_count || 0;
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
      b.classList.remove('bounce');
      void b.offsetWidth;
      b.classList.add('bounce');
    });
  }

  function bindEvents() {
    // Open drawer triggers
    document.querySelectorAll('.cart-trigger-btn, .cart-btn-trigger').forEach(btn => {
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

    // Global Add-to-cart clicks
    document.addEventListener('click', (e) => {
      const atcBtn = e.target.closest('.js-add-to-cart');
      if (atcBtn) {
        e.preventDefault();
        const variantId = atcBtn.getAttribute('data-variant-id') || atcBtn.getAttribute('data-id');
        const quantity = parseInt(atcBtn.getAttribute('data-quantity') || '1', 10);

        if (!variantId) {
          console.warn('Add to cart button missing variant ID');
          return;
        }

        addItem({ id: variantId, quantity: quantity });
      }

      // Quantity adjustments inside drawer
      const qtyBtn = e.target.closest('.js-cart-qty-btn');
      if (qtyBtn) {
        e.preventDefault();
        const key = qtyBtn.getAttribute('data-key') || qtyBtn.getAttribute('data-id');
        const currentQty = parseInt(qtyBtn.getAttribute('data-current-qty') || '1', 10);
        const delta = parseInt(qtyBtn.getAttribute('data-delta'), 10);
        changeQuantity(key, currentQty + delta);
      }

      // Remove item inside drawer
      const removeBtn = e.target.closest('.js-cart-remove');
      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.getAttribute('data-key') || removeBtn.getAttribute('data-id');
        removeItem(key);
      }
    });

    // Keyboard ESC to close drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    });
  }

  function openDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    if (drawer && backdrop) {
      fetchCart();
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

  function renderCart() {
    const itemsContainer = document.querySelector('.cart-drawer__items');
    const subtotalEl = document.querySelector('.cart-subtotal-amount');
    const freeShippingText = document.querySelector('.free-shipping-text');
    const freeShippingProgress = document.querySelector('.free-shipping-progress');
    const cartTitle = document.querySelector('.cart-drawer__title');

    updateHeaderBadge();

    const items = cartData.items || [];
    const itemCount = cartData.item_count || 0;
    const subtotalRupees = cartData.total_price > 9999 ? Math.round(cartData.total_price / 100) : cartData.total_price;

    if (cartTitle) {
      cartTitle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        Your Shopping Cart (${itemCount})
      `;
    }

    if (!itemsContainer) return;

    if (items.length === 0) {
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
        freeShippingText.innerHTML = `<span>🚚 Add <strong>₹${FREE_SHIPPING_THRESHOLD}</strong> more for <strong>FREE Delivery</strong>!</span>`;
        freeShippingText.classList.remove('achieved');
      }
      return;
    }

    // Render items list from Shopify Cart items
    itemsContainer.innerHTML = items.map(item => {
      const itemPrice = item.price > 9999 ? Math.round(item.price / 100) : item.price;
      const imageUrl = item.featured_image ? (item.featured_image.url || item.featured_image) : (item.image || '');
      const variantTitle = (item.variant_title && item.variant_title !== 'Default Title') ? item.variant_title : '';
      const itemKey = item.key || item.id;

      return `
        <div class="cart-item">
          <img src="${imageUrl}" alt="${item.title || 'Product'}" class="cart-item__img" width="70" height="70" loading="lazy" />
          <div>
            <h4 class="cart-item__title">
              <a href="${item.url || '#'}" style="color: inherit; text-decoration: none;">${item.product_title || item.title}</a>
            </h4>
            ${variantTitle ? `<div class="cart-item__variant">${variantTitle}</div>` : ''}
            <div class="cart-item__price">₹${itemPrice.toLocaleString('en-IN')}</div>
            <div class="quantity-stepper" style="margin-top: 8px;">
              <button class="stepper-btn js-cart-qty-btn" data-key="${itemKey}" data-current-qty="${item.quantity}" data-delta="-1" aria-label="Decrease quantity">-</button>
              <span class="stepper-input">${item.quantity}</span>
              <button class="stepper-btn js-cart-qty-btn" data-key="${itemKey}" data-current-qty="${item.quantity}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item__remove js-cart-remove" data-key="${itemKey}" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    // Update Subtotal
    if (subtotalEl) {
      subtotalEl.textContent = `₹${subtotalRupees.toLocaleString('en-IN')}`;
    }

    // Update Free Shipping Progress
    if (freeShippingProgress && freeShippingText) {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotalRupees;
      const progressPercent = Math.min(100, Math.round((subtotalRupees / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingProgress.style.width = `${progressPercent}%`;

      if (remaining <= 0) {
        freeShippingText.innerHTML = `<span>🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE Delivery</strong>!</span>`;
        freeShippingText.classList.add('achieved');
      } else {
        freeShippingText.innerHTML = `<span>🚚 Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>!</span>`;
        freeShippingText.classList.remove('achieved');
      }
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('bhaavzo-toast');
    let toastMsg = document.getElementById('bhaavzo-toast-msg');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bhaavzo-toast';
      toast.className = 'bhaavzo-toast';
      toast.innerHTML = `<div class="bhaavzo-toast-icon">✓</div><div id="bhaavzo-toast-msg">${msg}</div>`;
      document.body.appendChild(toast);
      toastMsg = document.getElementById('bhaavzo-toast-msg');
    }

    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('active');
    clearTimeout(window.__bhaavzoToastTimer);
    window.__bhaavzoToastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    addItem,
    changeQuantity,
    removeItem,
    fetchCart,
    getCart: () => cartData
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.BhaavzoCart.init();
});
