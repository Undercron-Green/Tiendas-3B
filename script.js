(() => {
  'use strict';

  const products = [
    { id: 'arroz-3b', name: 'Arroz súper extra 3B', category: 'abarrotes', categoryLabel: 'Abarrotes', price: 24, unit: '1 kg', badge: 'PRECIO BAJO', own: true, image: 'assets/products/arroz-3b.jpg' },
    { id: 'leche-entera', name: 'Leche entera', category: 'lacteos', categoryLabel: 'Lácteos', price: 23, unit: '1 L', badge: '', own: false, image: 'assets/products/leche-entera.jpg' },
    { id: 'aceite-vegetal', name: 'Aceite vegetal', category: 'abarrotes', categoryLabel: 'Abarrotes', price: 38, unit: '1 L', badge: '', own: false, image: 'assets/products/aceite-vegetal.jpg' },
    { id: 'frijol-negro-3b', name: 'Frijol negro 3B', category: 'marcas-3b', categoryLabel: 'Marcas 3B', price: 29, unit: '900 g', badge: 'MARCA 3B', own: true, image: 'assets/products/frijol-negro-3b.jpg' },
    { id: 'detergente-3b', name: 'Detergente en polvo 3B', category: 'marcas-3b', categoryLabel: 'Marcas 3B', price: 32, unit: '1 kg', badge: 'MARCA 3B', own: true, image: 'assets/products/detergente-3b.jpg' },
    { id: 'pasta-corta', name: 'Pasta corta', category: 'abarrotes', categoryLabel: 'Abarrotes', price: 12, unit: '200 g', badge: '', own: false, image: 'assets/products/pasta-corta.jpg' },
    { id: 'yogur-natural', name: 'Yogur natural', category: 'lacteos', categoryLabel: 'Lácteos', price: 19, unit: '1 L', badge: '', own: false, image: 'assets/products/yogur-natural.jpg' },
    { id: 'cloro-3b', name: 'Cloro multiusos 3B', category: 'limpieza', categoryLabel: 'Limpieza', price: 18, unit: '1 L', badge: 'MARCA 3B', own: true, image: 'assets/products/cloro-3b.jpg' },
    { id: 'atun', name: 'Atún en agua', category: 'abarrotes', categoryLabel: 'Abarrotes', price: 17, unit: '140 g', badge: '', own: false, image: 'assets/products/atun.jpg' },
    { id: 'queso-panela', name: 'Queso tipo panela', category: 'lacteos', categoryLabel: 'Lácteos', price: 42, unit: '400 g', badge: '', own: false, image: 'assets/products/queso-panela.jpg' },
    { id: 'suavizante-3b', name: 'Suavizante 3B', category: 'marcas-3b', categoryLabel: 'Marcas 3B', price: 27, unit: '850 ml', badge: 'MARCA 3B', own: true, image: 'assets/products/suavizante-3b.jpg' },
    { id: 'jabon-trastes', name: 'Lavatrastes limón', category: 'limpieza', categoryLabel: 'Limpieza', price: 21, unit: '750 ml', badge: '', own: false, image: 'assets/products/jabon-trastes.jpg' }
  ];
  const savingsPrices = { arroz: [24, 32], leche: [23, 29], aceite: [38, 49], frijol: [29, 38], detergente: [32, 43] };
  const money = value => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const state = { page: 'inicio', category: 'todos', query: '', cart: loadCart(), lastFocus: null, toastTimer: null };

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem('tiendas3b-cart') || '{}');
      return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => products.some(product => product.id === id) && Number.isInteger(quantity) && quantity > 0));
    } catch {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem('tiendas3b-cart', JSON.stringify(state.cart));
  }

  function navigate(page) {
    const section = $(`#page-${page}`);
    if (!section) return;
    state.page = page;
    $$('.page-section').forEach(item => {
      const active = item === section;
      item.hidden = !active;
      item.classList.toggle('is-visible', active);
    });
    $$('[data-page-link]').forEach(link => {
      const active = link.dataset.pageLink === page;
      link.classList.toggle('is-active', active);
      if (active && link.matches('button')) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    $('#page-title').textContent = { inicio: 'Inicio', tienda: 'Tienda virtual', contacto: 'Contacto & equipo' }[page];
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#main-content').focus({ preventScroll: true });
  }

  function openSidebar() {
    if (!window.matchMedia('(max-width: 760px)').matches) {
      document.body.classList.remove('sidebar-collapsed');
      $('#sidebar').removeAttribute('inert');
      $('#sidebar').setAttribute('aria-hidden', 'false');
      $('#menu-toggle').setAttribute('aria-expanded', 'true');
      $('#menu-toggle').setAttribute('aria-label', 'Replegar menú');
      return;
    }
    $('#sidebar').classList.add('is-open');
    $('#sidebar').removeAttribute('inert');
    $('#sidebar').setAttribute('aria-hidden', 'false');
    $('#sidebar-scrim').classList.add('is-open');
    $('#menu-toggle').setAttribute('aria-expanded', 'true');
    $('#menu-toggle').setAttribute('aria-label', 'Cerrar menú');
    $$('.sidebar .nav-link').at(0)?.focus();
  }

  function closeSidebar() {
    if (!window.matchMedia('(max-width: 760px)').matches) {
      document.body.classList.remove('sidebar-collapsed');
      $('#sidebar').removeAttribute('inert');
      $('#sidebar').setAttribute('aria-hidden', 'false');
      $('#menu-toggle').setAttribute('aria-expanded', 'true');
      $('#menu-toggle').setAttribute('aria-label', 'Replegar menú');
      return;
    }
    $('#sidebar').classList.remove('is-open');
    $('#sidebar').setAttribute('inert', '');
    $('#sidebar').setAttribute('aria-hidden', 'true');
    $('#sidebar-scrim').classList.remove('is-open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Abrir menú');
  }

  function openCart() {
    state.lastFocus = document.activeElement;
    $('#cart-drawer').classList.add('is-open');
    $('#cart-drawer').removeAttribute('inert');
    $('#cart-drawer').setAttribute('aria-hidden', 'false');
    $('#drawer-scrim').classList.add('is-open');
    $('.close-drawer').focus();
  }

  function closeCart() {
    $('#cart-drawer').classList.remove('is-open');
    $('#cart-drawer').setAttribute('inert', '');
    $('#cart-drawer').setAttribute('aria-hidden', 'true');
    $('#drawer-scrim').classList.remove('is-open');
    state.lastFocus?.focus?.();
  }

  function showToast(message) {
    $('#toast-message').textContent = message;
    $('#toast').classList.add('is-visible');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 2600);
  }

  function renderProducts() {
    const filtered = products.filter(product => (state.category === 'todos' || product.category === state.category) && `${product.name} ${product.categoryLabel}`.toLocaleLowerCase('es-MX').includes(state.query.toLocaleLowerCase('es-MX')));
    $('#product-grid').innerHTML = filtered.map(product => `
      <article class="product-card">
        <div class="product-image-wrap"><img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-badge ${product.own ? 'product-own-badge' : ''}" ${product.badge ? '' : 'hidden'}>${product.badge}</span></div>
        <div class="product-info"><span class="product-category">${product.categoryLabel}</span><h3>${product.name}</h3><div class="product-price-row"><div><span class="product-price">${money(product.price)}</span><span class="product-unit">/${product.unit}</span></div><button class="add-product" type="button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">+</button></div></div>
      </article>`).join('');
    $('#catalog-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'producto' : 'productos'}`;
    $('#empty-state').hidden = filtered.length !== 0;
    $('#product-grid').hidden = filtered.length === 0;
  }

  function cartTotals() {
    const subtotal = products.reduce((sum, product) => sum + product.price * (state.cart[product.id] || 0), 0);
    const tax = subtotal * .16;
    return { subtotal, tax, total: subtotal + tax };
  }

  function renderCart() {
    const count = Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
    const countText = String(count);
    $('#header-cart-count').textContent = countText;
    $('#nav-cart-count').textContent = countText;
    $('#nav-cart-count').setAttribute('aria-label', `${count} artículos`);
    $('#open-cart').setAttribute('aria-label', `Abrir carrito, ${count} artículos`);
    $('#drawer-item-count').textContent = `(${count})`;
    const items = products.filter(product => state.cart[product.id]);
    $('#cart-items').innerHTML = items.map(product => `
      <article class="cart-row">
        <img class="cart-row-image" src="${product.image}" alt="" loading="lazy">
        <div class="cart-row-details"><strong>${product.name}</strong><span>${money(product.price)} / ${product.unit}</span><div class="quantity-control"><button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="Quitar una unidad de ${product.name}">−</button><span>${state.cart[product.id]}</span><button type="button" data-quantity="${product.id}" data-delta="1" aria-label="Agregar una unidad de ${product.name}">+</button></div></div>
        <div class="cart-row-end"><strong>${money(product.price * state.cart[product.id])}</strong><button class="remove-item" type="button" data-remove="${product.id}">Eliminar</button></div>
      </article>`).join('');
    const isEmpty = items.length === 0;
    $('#cart-empty').hidden = !isEmpty;
    $('#cart-summary').hidden = isEmpty;
    $('#cart-items').hidden = isEmpty;
    if (!isEmpty) {
      const totals = cartTotals();
      $('#cart-subtotal').textContent = money(totals.subtotal);
      $('#cart-tax').textContent = money(totals.tax);
      $('#cart-total').textContent = money(totals.total);
    }
    saveCart();
  }

  function addProduct(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    renderCart();
    showToast('Producto agregado correctamente');
  }

  function updateQuantity(id, delta) {
    const next = (state.cart[id] || 0) + delta;
    if (next <= 0) delete state.cart[id];
    else state.cart[id] = next;
    renderCart();
  }

  function renderTicket() {
    const items = products.filter(product => state.cart[product.id]);
    const totals = cartTotals();
    const sequence = Number(localStorage.getItem('tiendas3b-folio') || 0) + 1;
    localStorage.setItem('tiendas3b-folio', String(sequence));
    const random = Math.floor(100 + Math.random() * 900);
    const folio = `3B-${String(sequence).padStart(4, '0')}-${random}`;
    const now = new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
    $('#print-ticket').innerHTML = `
      <header class="receipt-head"><div class="receipt-logo">3B</div><strong>TIENDAS 3B</strong><p>BUENO · BONITO · BARATO<br>GRACIAS POR TU COMPRA</p></header>
      <div class="receipt-meta"><span>FOLIO: ${folio}</span><span>FECHA: ${now}</span><span>ATENDIÓ: CAJA DEMOSTRATIVA</span><span>*** TICKET DE PRUEBA ***</span></div>
      <div class="receipt-lines">${items.map(product => `<div class="receipt-line"><span class="receipt-line-name">${state.cart[product.id]} x ${product.name}</span><span>${money(product.price * state.cart[product.id])}</span></div>`).join('')}</div>
      <div class="receipt-totals"><div class="receipt-total-row"><span>SUBTOTAL</span><span>${money(totals.subtotal)}</span></div><div class="receipt-total-row"><span>IVA (16%)</span><span>${money(totals.tax)}</span></div><div class="receipt-total-row grand"><strong>TOTAL</strong><strong>${money(totals.total)}</strong></div></div>
      <div class="receipt-payment"><div class="receipt-total-row"><span>PAGO SIMULADO</span><span>${money(totals.total)}</span></div><div class="receipt-total-row"><span>CAMBIO</span><span>${money(0)}</span></div></div>
      <footer class="receipt-thanks">ESTA COMPRA NO GENERA UN COBRO REAL.<strong>¡Gracias por elegir 3B!</strong>Tu dinero rinde más.<br>Conserva este ticket para cualquier aclaración.</footer>`;
  }

  function openTicket() {
    if (!Object.keys(state.cart).length) return;
    closeCart();
    renderTicket();
    state.lastFocus = $('#open-cart');
    $('#ticket-modal').classList.add('is-open');
    $('#ticket-modal').removeAttribute('inert');
    $('#ticket-modal').setAttribute('aria-hidden', 'false');
    $('#close-ticket').focus();
    state.cart = {};
    renderCart();
  }

  function closeTicket() {
    $('#ticket-modal').classList.remove('is-open');
    $('#ticket-modal').setAttribute('inert', '');
    $('#ticket-modal').setAttribute('aria-hidden', 'true');
    state.lastFocus?.focus?.();
  }

  function updateSavings() {
    let current = 0;
    let traditional = 0;
    $$('[data-saving-item]:checked').forEach(input => {
      const prices = savingsPrices[input.dataset.savingItem];
      current += prices[0];
      traditional += prices[1];
    });
    $('#saving-3b').textContent = money(current);
    $('#saving-traditional').textContent = money(traditional);
    $('#saving-difference').textContent = money(traditional - current);
  }

  function validateField(input) {
    const field = input.closest('.form-field');
    let message = '';
    if (input.required && !input.value.trim()) message = 'Este campo es obligatorio.';
    else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) message = 'Escribe un correo válido.';
    else if (input.minLength > 0 && input.value.trim().length < input.minLength) message = `Escribe al menos ${input.minLength} caracteres.`;
    field.classList.toggle('has-error', Boolean(message));
    field.querySelector('.field-error').textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }

  $('#menu-toggle').addEventListener('click', () => {
    if (!window.matchMedia('(max-width: 760px)').matches) {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      if (collapsed) {
        $('#sidebar').setAttribute('inert', '');
        $('#sidebar').setAttribute('aria-hidden', 'true');
      } else {
        $('#sidebar').removeAttribute('inert');
        $('#sidebar').setAttribute('aria-hidden', 'false');
      }
      $('#menu-toggle').setAttribute('aria-expanded', String(!collapsed));
      $('#menu-toggle').setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Replegar menú');
      return;
    }
    $('#sidebar').classList.contains('is-open') ? closeSidebar() : openSidebar();
  });
  $('#sidebar-scrim').addEventListener('click', closeSidebar);
  $$('[data-page-link]').forEach(link => link.addEventListener('click', () => navigate(link.dataset.pageLink)));
  $$('[data-go-to]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.goTo)));
  $('#open-cart').addEventListener('click', openCart);
  $('.close-drawer').addEventListener('click', closeCart);
  $('#drawer-scrim').addEventListener('click', closeCart);
  $('#continue-shopping').addEventListener('click', closeCart);
  $('#go-shopping').addEventListener('click', () => { closeCart(); navigate('tienda'); });
  $('#product-search').addEventListener('input', event => { state.query = event.target.value.trim(); renderProducts(); });
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    state.category = button.dataset.category;
    $$('.filter-button').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('is-selected', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    renderProducts();
  }));
  $('#product-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (button) addProduct(button.dataset.add);
  });
  $('#clear-search').addEventListener('click', () => {
    state.query = '';
    state.category = 'todos';
    $('#product-search').value = '';
    $$('.filter-button').forEach(button => {
      const selected = button.dataset.category === 'todos';
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderProducts();
  });
  $('#cart-items').addEventListener('click', event => {
    const quantity = event.target.closest('[data-quantity]');
    const remove = event.target.closest('[data-remove]');
    if (quantity) updateQuantity(quantity.dataset.quantity, Number(quantity.dataset.delta));
    if (remove) { delete state.cart[remove.dataset.remove]; renderCart(); }
  });
  $('#checkout-button').addEventListener('click', openTicket);
  $('#close-ticket').addEventListener('click', closeTicket);
  $('#close-ticket-secondary').addEventListener('click', closeTicket);
  $('#ticket-modal').addEventListener('click', event => { if (event.target === $('#ticket-modal')) closeTicket(); });
  $('#print-ticket-button').addEventListener('click', () => window.print());
  $$('[data-saving-item]').forEach(input => input.addEventListener('change', updateSavings));
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const inputs = [...event.currentTarget.querySelectorAll('input,select,textarea')];
    const valid = inputs.map(validateField).every(Boolean);
    const status = $('#form-status');
    status.classList.toggle('is-error', !valid);
    if (!valid) {
      status.textContent = 'Revisa los campos marcados.';
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    status.textContent = '¡Gracias! Tu mensaje quedó registrado en esta demostración.';
    event.currentTarget.reset();
    inputs.forEach(input => { input.closest('.form-field').classList.remove('has-error'); input.removeAttribute('aria-invalid'); });
  });
  $('#contact-form').addEventListener('blur', event => {
    if (event.target.matches('input,select,textarea')) validateField(event.target);
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if ($('#ticket-modal').classList.contains('is-open')) closeTicket();
      else if ($('#cart-drawer').classList.contains('is-open')) closeCart();
      else closeSidebar();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && state.page === 'tienda') {
      event.preventDefault();
      $('#product-search').focus();
    }
    const modal = $('#ticket-modal');
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const focusable = [...modal.querySelectorAll('button:not([disabled])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  closeSidebar();
  renderProducts();
  renderCart();
  updateSavings();
})();