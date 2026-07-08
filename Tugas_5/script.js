(() => {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Data                                                                */
  /* ------------------------------------------------------------------ */
  const PRODUCTS = [
    {
      id: 1,
      name: "Kemeja Katun Celup Indigo",
      category: "kemeja",
      price: 285000,
      lot: "LOT.07",
      dye: "indigo",
      icon: "icon-shirt",
    },
    {
      id: 2,
      name: "Kemeja Linen Indigo Muda",
      category: "kemeja",
      price: 310000,
      lot: "LOT.09",
      dye: "indigo-dark",
      icon: "icon-shirt",
    },
    {
      id: 3,
      name: "Kaos Combed Overdye Secang",
      category: "kaos",
      price: 165000,
      lot: "LOT.12",
      dye: "secang",
      icon: "icon-tee",
    },
    {
      id: 4,
      name: "Kaos Raglan Ecru x Secang",
      category: "kaos",
      price: 175000,
      lot: "LOT.15",
      dye: "secang-light",
      icon: "icon-tee",
    },
    {
      id: 5,
      name: "Outer Canvas Jolawe",
      category: "outer",
      price: 420000,
      lot: "LOT.03",
      dye: "jolawe",
      icon: "icon-jacket",
    },
    {
      id: 6,
      name: "Outer Vest Indigo Tua",
      category: "outer",
      price: 380000,
      lot: "LOT.05",
      dye: "indigo-dark",
      icon: "icon-jacket",
    },
    {
      id: 7,
      name: "Tote Bag Kanvas Jolawe",
      category: "aksesoris",
      price: 120000,
      lot: "LOT.01",
      dye: "jolawe-light",
      icon: "icon-bag",
    },
    {
      id: 8,
      name: "Bandana Katun Secang",
      category: "aksesoris",
      price: 65000,
      lot: "LOT.18",
      dye: "secang",
      icon: "icon-bag",
    },
  ];

  const DYE_VARS = {
    indigo: "var(--color-indigo)",
    "indigo-dark": "var(--color-indigo-dark)",
    secang: "var(--color-secang)",
    "secang-light": "var(--color-secang-light)",
    jolawe: "var(--color-jolawe)",
    "jolawe-light": "var(--color-jolawe-light)",
  };

  const CATEGORY_LABEL = {
    kemeja: "Kemeja",
    kaos: "Kaos",
    outer: "Outer",
    aksesoris: "Aksesoris",
  };

  let cart = []; // { id, qty }
  let currentFilter = "semua";
  let newsletterShown = false;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function formatRupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("visible"), 2400);
  }

  /* ------------------------------------------------------------------ */
  /* Product grid + filtering                                            */
  /* ------------------------------------------------------------------ */
  function renderProducts() {
    const grid = $("#productGrid");
    grid.innerHTML = PRODUCTS.map(
      (p) => `
      <article class="product-card" data-category="${p.category}">
        <div class="card-visual" style="--card-dye:${DYE_VARS[p.dye]}">
          <span class="card-lot">${p.lot}</span>
          <svg><use href="#${p.icon}"/></svg>
        </div>
        <div class="card-body">
          <span class="card-cat">${CATEGORY_LABEL[p.category]}</span>
          <p class="card-name">${p.name}</p>
          <div class="card-row">
            <span class="card-price">${formatRupiah(p.price)}</span>
            <button class="card-add" data-id="${p.id}">+ Keranjang</button>
          </div>
        </div>
      </article>
    `,
    ).join("");
    applyFilter();
  }

  function applyFilter() {
    $$(".product-card").forEach((card) => {
      const match =
        currentFilter === "semua" || card.dataset.category === currentFilter;
      card.classList.toggle("is-hidden", !match);
    });
  }

  function setupFilterTabs() {
    $$(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".filter-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        currentFilter = tab.dataset.filter;
        applyFilter();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cart                                                                 */
  /* ------------------------------------------------------------------ */
  function addToCart(id) {
    const line = cart.find((l) => l.id === id);
    if (line) {
      line.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    renderCart();
    updateCartCount();
    const product = findProduct(id);
    showToast(`${product.name} ditambahkan ke keranjang`);
  }

  function changeQty(id, delta) {
    const line = cart.find((l) => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      cart = cart.filter((l) => l.id !== id);
    }
    renderCart();
    updateCartCount();
  }

  function removeFromCart(id) {
    cart = cart.filter((l) => l.id !== id);
    renderCart();
    updateCartCount();
  }

  function updateCartCount() {
    const total = cart.reduce((sum, l) => sum + l.qty, 0);
    $("#cartCount").textContent = total;
  }

  function renderCart() {
    const container = $("#cartItems");
    const emptyMsg = $("#cartEmpty");

    if (cart.length === 0) {
      container.innerHTML = "";
      container.appendChild(emptyMsg);
      emptyMsg.hidden = false;
    } else {
      emptyMsg.hidden = true;
      container.innerHTML = cart
        .map((line) => {
          const p = findProduct(line.id);
          return `
          <div class="cart-item">
            <div class="cart-item-swatch" style="--item-dye:${DYE_VARS[p.dye]}"></div>
            <div>
              <p class="cart-item-name">${p.name}</p>
              <p class="cart-item-lot">${p.lot}</p>
              <div class="cart-item-qty">
                <button class="qty-btn" data-action="minus" data-id="${p.id}" aria-label="Kurangi jumlah"><svg width="10" height="10"><use href="#icon-minus"/></svg></button>
                <span>${line.qty}</span>
                <button class="qty-btn" data-action="plus" data-id="${p.id}" aria-label="Tambah jumlah"><svg width="10" height="10"><use href="#icon-plus"/></svg></button>
              </div>
            </div>
            <div>
              <p class="cart-item-price">${formatRupiah(p.price * line.qty)}</p>
              <button class="cart-item-remove" data-action="remove" data-id="${p.id}">Hapus</button>
            </div>
          </div>
        `;
        })
        .join("");
    }

    const subtotal = cart.reduce(
      (sum, l) => sum + findProduct(l.id).price * l.qty,
      0,
    );
    $("#cartSubtotal").textContent = formatRupiah(subtotal);
  }

  function setupCartEvents() {
    $("#productGrid").addEventListener("click", (e) => {
      const btn = e.target.closest(".card-add");
      if (!btn) return;
      addToCart(Number(btn.dataset.id));
    });

    $("#cartItems").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === "plus") changeQty(id, 1);
      if (btn.dataset.action === "minus") changeQty(id, -1);
      if (btn.dataset.action === "remove") removeFromCart(id);
    });

    $("#cartBtn").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    $("#drawerOverlay").addEventListener("click", closeCart);

    $("#checkoutBtn").addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Keranjang masih kosong");
        return;
      }
      showToast("Ini demo tugas — checkout belum tersambung ke pembayaran");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCart();
    });
  }

  function openCart() {
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    $("#drawerOverlay").classList.add("visible");
  }

  function closeCart() {
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    $("#drawerOverlay").classList.remove("visible");
  }

  /* ------------------------------------------------------------------ */
  /* Hero swatch picker                                                   */
  /* ------------------------------------------------------------------ */
  function setupSwatchPicker() {
    const tag = $("#heroSwatch");
    const lotLabel = $("#heroLot");
    const nameLabel = $("#heroName");

    $$(".swatch-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        $$(".swatch-dot").forEach((d) => {
          d.classList.remove("active");
          d.setAttribute("aria-pressed", "false");
        });
        dot.classList.add("active");
        dot.setAttribute("aria-pressed", "true");
        tag.style.setProperty(
          "--current-dye",
          `var(--color-${dot.dataset.dye})`,
        );
        lotLabel.textContent = dot.dataset.lot;
        nameLabel.innerHTML = dot.dataset.name;
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Newsletter modal                                                     */
  /* ------------------------------------------------------------------ */
  function openNewsletter() {
    if (newsletterShown) return;
    newsletterShown = true;
    $("#newsletterModal").classList.add("visible");
    $("#newsletterModal").setAttribute("aria-hidden", "false");
    $("#newsletterOverlay").classList.add("visible");
  }

  function closeNewsletter() {
    $("#newsletterModal").classList.remove("visible");
    $("#newsletterModal").setAttribute("aria-hidden", "true");
    $("#newsletterOverlay").classList.remove("visible");
  }

  function setupNewsletter() {
    setTimeout(openNewsletter, 9000);

    const footer = document.querySelector(".site-footer");
    if ("IntersectionObserver" in window && footer) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              openNewsletter();
              io.disconnect();
            }
          });
        },
        { threshold: 0.2 },
      );
      io.observe(footer);
    }

    $("#closeNewsletter").addEventListener("click", closeNewsletter);
    $("#newsletterOverlay").addEventListener("click", closeNewsletter);

    $("#newsletterForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#newsletterEmail").value.trim();
      if (!email) return;
      $("#newsletterForm").hidden = true;
      $("#newsletterSuccess").hidden = false;
      setTimeout(closeNewsletter, 2200);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Header scroll state + mobile nav                                     */
  /* ------------------------------------------------------------------ */
  function setupHeader() {
    const header = $("#siteHeader");
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.scrollY > 12);
      },
      { passive: true },
    );

    const toggle = $("#navToggle");
    const nav = $("#mainNav");
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                        */
  /* ------------------------------------------------------------------ */
  function setupReveal() {
    const targets = $$(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    setupFilterTabs();
    setupCartEvents();
    setupSwatchPicker();
    setupNewsletter();
    setupHeader();
    setupReveal();
  });
})();
