/* =========================================================
   IZZERZ STORE MY — MAIN SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- ELEMENTS ---------- */

  const intro = document.getElementById("intro");
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const hamb = document.getElementById("hamb");

  const themeToggle = document.getElementById("themeToggle");

  const search = document.getElementById("search");
  const productsGrid = document.getElementById("products-grid");
  const empty = document.getElementById("empty");
  const chips = document.getElementById("chips");
  const catGrid = document.getElementById("catGrid");

  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const drawer = document.getElementById("drawer");
  const drawerScrim = document.getElementById("drawerScrim");

  const cartItems = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartBadge");
  const cartTotal = document.getElementById("cartTotal");

  const checkoutBtn = document.getElementById("checkoutBtn");

  const checkout = document.getElementById("checkout");
  const closeCheckout = document.getElementById("closeCheckout");
  const checkoutScrim = document.getElementById("checkoutScrim");

  const checkoutForm = document.getElementById("checkoutForm");
  const summary = document.getElementById("summary");
  const modalTotal = document.getElementById("modalTotal");

  const fabTop = document.getElementById("fabTop");


  /* =========================================================
     INTRO
     ========================================================= */

  setTimeout(() => {
    if (intro) {
      intro.classList.add("hide");

      setTimeout(() => {
        intro.style.display = "none";
      }, 900);
    }
  }, 3000);


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  if (hamb) {
    hamb.addEventListener("click", () => {
      navLinks?.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("open");
    });
  });


  /* =========================================================
     NAV SCROLL
     ========================================================= */

  function updateScrollUI() {
    if (window.scrollY > 30) {
      nav?.classList.add("scrolled");
    } else {
      nav?.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
      fabTop?.classList.add("show");
    } else {
      fabTop?.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateScrollUI);
  updateScrollUI();


  /* =========================================================
     BACK TO TOP
     ========================================================= */

  fabTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });


  /* =========================================================
     THEME
     ========================================================= */

  const savedTheme = localStorage.getItem("izzerz-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    if (themeToggle) themeToggle.textContent = "☀";
  }

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const light = document.body.classList.contains("light");

    localStorage.setItem(
      "izzerz-theme",
      light ? "light" : "dark"
    );

    themeToggle.textContent = light ? "☀" : "☾";
  });


  /* =========================================================
     RIPPLE EFFECT
     ========================================================= */

  document.addEventListener("click", e => {

    const btn = e.target.closest(".ripple");

    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    btn.style.setProperty(
      "--rx",
      `${e.clientX - rect.left}px`
    );

    btn.style.setProperty(
      "--ry",
      `${e.clientY - rect.top}px`
    );

    btn.classList.remove("rip");

    void btn.offsetWidth;

    btn.classList.add("rip");
  });


  /* =========================================================
     PRODUCTS DATA
     
     store.js boleh define:
     window.products
     
     Kalau store.js ada, script ini akan guna data tersebut.
     ========================================================= */

  const defaultProducts = [
    {
      id: 1,
      name: "Mobile Legends Diamonds",
      category: "Mobile Legends",
      price: 5,
      oldPrice: 7,
      emoji: "💎",
      badge: "TOP"
    },
    {
      id: 2,
      name: "Free Fire Diamonds",
      category: "Free Fire",
      price: 5,
      oldPrice: 7,
      emoji: "🔥",
      badge: "TOP"
    },
    {
      id: 3,
      name: "Robux",
      category: "Roblox",
      price: 10,
      oldPrice: 13,
      emoji: "🟩",
      badge: "SALE"
    },
    {
      id: 4,
      name: "TikTok Coins",
      category: "TikTok",
      price: 5,
      oldPrice: 6,
      emoji: "🎵",
      badge: "SALE"
    },
    {
      id: 5,
      name: "Netflix Premium",
      category: "Premium",
      price: 15,
      oldPrice: 20,
      emoji: "🎬",
      badge: "SALE"
    },
    {
      id: 6,
      name: "APK Premium",
      category: "APK Premium",
      price: 10,
      oldPrice: 15,
      emoji: "📱",
      badge: "TOP"
    }
  ];

  let products = Array.isArray(window.products)
    ? window.products
    : defaultProducts;


  /* =========================================================
     CATEGORIES
     ========================================================= */

  const categoryIcons = {
    "Mobile Legends": "🎮",
    "Free Fire": "🔥",
    "Roblox": "🟩",
    "TikTok": "🎵",
    "Premium": "👑",
    "APK Premium": "📱",
    "Games": "🎮"
  };

  function getCategories() {

    const categories = [
      ...new Set(
        products
          .map(p => p.category)
          .filter(Boolean)
      )
    ];

    return categories;
  }


  function renderCategories() {

    if (!catGrid) return;

    const categories = getCategories();

    catGrid.innerHTML = categories.map(category => {

      const icon = categoryIcons[category] || "⚡";

      const count = products.filter(
        p => p.category === category
      ).length;

      return `
        <div class="cat glass reveal"
             data-category="${escapeHTML(category)}">

          <div class="emoji">${icon}</div>

          <h3>${escapeHTML(category)}</h3>

          <p>${count} product${count !== 1 ? "s" : ""}</p>

        </div>
      `;

    }).join("");

    document.querySelectorAll(".cat").forEach(cat => {

      cat.addEventListener("click", () => {

        const category = cat.dataset.category;

        setCategory(category);

        document.getElementById("products")
          ?.scrollIntoView({
            behavior: "smooth"
          });
      });

    });

    revealElements();
  }


  /* =========================================================
     FILTER CHIPS
     ========================================================= */

  let activeCategory = "All";

  function renderChips() {

    if (!chips) return;

    const categories = getCategories();

    chips.innerHTML = [
      "All",
      ...categories
    ].map(category => `
      <button
        class="chip ${category === "All" ? "active" : ""}"
        data-category="${escapeHTML(category)}">
        ${escapeHTML(category)}
      </button>
    `).join("");

    chips.querySelectorAll(".chip").forEach(chip => {

      chip.addEventListener("click", () => {

        setCategory(chip.dataset.category);

      });

    });
  }


  function setCategory(category) {

    activeCategory = category;

    document.querySelectorAll(".chip").forEach(chip => {

      chip.classList.toggle(
        "active",
        chip.dataset.category === category
      );

    });

    renderProducts();
  }


  /* =========================================================
     PRODUCT RENDER
     ========================================================= */

  function renderProducts() {

    if (!productsGrid) return;

    const query = (search?.value || "")
      .trim()
      .toLowerCase();

    const filtered = products.filter(product => {

      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const text = `
        ${product.name || ""}
        ${product.category || ""}
      `.toLowerCase();

      const matchesSearch =
        !query || text.includes(query);

      return matchesCategory && matchesSearch;
    });


    productsGrid.innerHTML = filtered.map(product => {

      const price = Number(product.price || 0);
      const oldPrice = Number(product.oldPrice || 0);

      return `
        <article
          class="card"
          data-id="${escapeHTML(String(product.id))}">

          <div class="art">

            <span style="
              position:relative;
              z-index:2;
              font-size:58px;
            ">
              ${product.image
                ? `<img src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        style="width:100%;height:100%;object-fit:cover;">`
                : (product.emoji || "⚡")
              }
            </span>

            <div class="badges">

              ${
                product.badge
                  ? `<span class="badge ${
                      String(product.badge).toLowerCase() === "sale"
                        ? "disc"
                        : "top"
                    }">
                      ${escapeHTML(product.badge)}
                    </span>`
                  : ""
              }

            </div>

          </div>

          <h3>${escapeHTML(product.name)}</h3>

          <div class="cat-name">
            ${escapeHTML(product.category || "Digital")}
          </div>

          <div class="price">

            <b>RM ${price.toFixed(2)}</b>

            ${
              oldPrice > price
                ? `<s>RM ${oldPrice.toFixed(2)}</s>`
                : ""
            }

          </div>

          <div class="card-actions">

            <button
              class="btn-sm"
              data-action="add"
              data-id="${escapeHTML(String(product.id))}">
              Add Cart
            </button>

            <button
              class="btn-sm buy"
              data-action="buy"
              data-id="${escapeHTML(String(product.id))}">
              Buy Now
            </button>

          </div>

        </article>
      `;

    }).join("");


    if (empty) {
      empty.hidden = filtered.length !== 0;
    }


    productsGrid.querySelectorAll("[data-action]").forEach(button => {

      button.addEventListener("click", () => {

        const id = button.dataset.id;

        const product = products.find(
          p => String(p.id) === String(id)
        );

        if (!product) return;

        if (button.dataset.action === "add") {

          addToCart(product);

        } else {

          addToCart(product);
          openCartDrawer();
        }

      });

    });
  }


  /* =========================================================
     SEARCH
     ========================================================= */

  search?.addEventListener("input", () => {
    renderProducts();
  });


  /* =========================================================
     CART
     ========================================================= */

  let cart = [];

  try {

    const savedCart =
      JSON.parse(
        localStorage.getItem("izzerz-cart") || "[]"
      );

    if (Array.isArray(savedCart)) {
      cart = savedCart;
    }

  } catch {
    cart = [];
  }


  function saveCart() {

    localStorage.setItem(
      "izzerz-cart",
      JSON.stringify(cart)
    );
  }


  function addToCart(product) {

    const existing = cart.find(
      item => String(item.id) === String(product.id)
    );

    if (existing) {

      existing.qty += 1;

    } else {

      cart.push({
        ...product,
        qty: 1
      });

    }

    saveCart();
    renderCart();

    openCartDrawer();
  }


  function removeFromCart(id) {

    cart = cart.filter(
      item => String(item.id) !== String(id)
    );

    saveCart();
    renderCart();
  }


  function changeQty(id, amount) {

    const item = cart.find(
      p => String(p.id) === String(id)
    );

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart();
    renderCart();
  }


  function getCartTotal() {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.qty || 1),
      0
    );
  }


  function getCartCount() {

    return cart.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    );
  }


  function renderCart() {

    if (!cartItems) return;

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty">
          🛒<br><br>
          Your cart is empty.
        </div>
      `;

    } else {

      cartItems.innerHTML = cart.map(item => {

        const itemTotal =
          Number(item.price || 0) *
          Number(item.qty || 1);

        return `
          <div class="cart-item">

            <div class="thumb">
              ${item.emoji || "⚡"}
            </div>

            <div>

              <h4>${escapeHTML(item.name)}</h4>

              <div class="qty">

                <button
                  data-qty="-1"
                  data-id="${escapeHTML(String(item.id))}">
                  −
                </button>

                <span>${item.qty}</span>

                <button
                  data-qty="1"
                  data-id="${escapeHTML(String(item.id))}">
                  +
                </button>

                <span style="
                  margin-left:8px;
                  color:var(--electric-soft);
                  font-size:12px;
                ">
                  RM ${itemTotal.toFixed(2)}
                </span>

              </div>

            </div>

            <button
              class="remove"
              data-remove="${escapeHTML(String(item.id))}"
              aria-label="Remove">
              ✕
            </button>

          </div>
        `;

      }).join("");


      cartItems.querySelectorAll("[data-qty]").forEach(btn => {

        btn.addEventListener("click", () => {

          changeQty(
            btn.dataset.id,
            Number(btn.dataset.qty)
          );

        });

      });


      cartItems.querySelectorAll("[data-remove]").forEach(btn => {

        btn.addEventListener("click", () => {

          removeFromCart(btn.dataset.remove);

        });

      });

    }


    const total = getCartTotal();

    if (cartBadge) {
      cartBadge.textContent = getCartCount();
    }

    if (cartTotal) {
      cartTotal.textContent =
        `RM ${total.toFixed(2)}`;
    }

  }


  /* =========================================================
     CART DRAWER
     ========================================================= */

  function openCartDrawer() {

    drawer?.classList.add("open");
    drawer?.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }


  function closeCartDrawer() {

    drawer?.classList.remove("open");
    drawer?.setAttribute("aria-hidden", "true");

    if (!checkout?.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  }


  openCart?.addEventListener("click", openCartDrawer);

  closeCart?.addEventListener("click", closeCartDrawer);

  drawerScrim?.addEventListener(
    "click",
    closeCartDrawer
  );


  /* =========================================================
     CHECKOUT
     ========================================================= */

  function openCheckoutModal() {

    if (cart.length === 0) {

      alert("Cart masih kosong.");

      return;
    }

    renderSummary();

    checkout?.classList.add("open");

    checkout?.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";
  }


  function closeCheckoutModal() {

    checkout?.classList.remove("open");

    checkout?.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";
  }


  function renderSummary() {

    if (!summary) return;

    summary.innerHTML = cart.map(item => {

      const total =
        Number(item.price || 0) *
        Number(item.qty || 1);

      return `
        <div class="row">
          <span>
            ${escapeHTML(item.name)}
            × ${item.qty}
          </span>

          <b>
            RM ${total.toFixed(2)}
          </b>
        </div>
      `;

    }).join("");

    if (modalTotal) {
      modalTotal.textContent =
        `RM ${getCartTotal().toFixed(2)}`;
    }
  }


  checkoutBtn?.addEventListener(
    "click",
    openCheckoutModal
  );

  closeCheckout?.addEventListener(
    "click",
    closeCheckoutModal
  );

  checkoutScrim?.addEventListener(
    "click",
    closeCheckoutModal
  );


  /* =========================================================
     WHATSAPP CHECKOUT
     ========================================================= */

  checkoutForm?.addEventListener("submit", e => {

    e.preventDefault();

    if (cart.length === 0) return;

    const formData = new FormData(checkoutForm);

    const name =
      String(formData.get("name") || "").trim();

    const phone =
      String(formData.get("phone") || "").trim();


    let message =
      `🛒 *ORDER — IZZERZ STORE MY*%0A%0A`;

    message +=
      `👤 Name: ${encodeURIComponent(name)}%0A`;

    message +=
      `📱 Phone: ${encodeURIComponent(phone)}%0A%0A`;

    message += `📦 *Products:*%0A`;


    cart.forEach((item, index) => {

      const total =
        Number(item.price || 0) *
        Number(item.qty || 1);

      message +=
        `${index + 1}. ${encodeURIComponent(item.name)} x${item.qty} — RM ${total.toFixed(2)}%0A`;

    });


    message += `%0A💰 *TOTAL: RM ${getCartTotal().toFixed(2)}*`;

    const whatsappNumber = "60199910755";

    const url =
      `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(
      url,
      "_blank",
      "noopener"
    );

  });


  /* =========================================================
     CARD MOUSE GLOW
     ========================================================= */

  document.addEventListener("pointermove", e => {

    const card = e.target.closest(".card");

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty(
      "--mx",
      `${x}%`
    );

    card.style.setProperty(
      "--my",
      `${y}%`
    );

  });


  /* =========================================================
     REVEAL ANIMATION
     ========================================================= */

  function revealElements() {

    const elements =
      document.querySelectorAll(".reveal:not(.observer-ready)");

    if (!("IntersectionObserver" in window)) {

      elements.forEach(el =>
        el.classList.add("in")
      );

      return;
    }


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("in");

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    elements.forEach(el => {

      el.classList.add("observer-ready");

      observer.observe(el);

    });

  }


  /* =========================================================
     HERO COUNTERS
     ========================================================= */

  function animateCounters() {

    document
      .querySelectorAll("[data-count]")
      .forEach(counter => {

        const target =
          Number(counter.dataset.count);

        let current = 0;

        const duration = 1500;

        const start =
          performance.now();


        function update(now) {

          const progress =
            Math.min(
              (now - start) / duration,
              1
            );

          const eased =
            1 - Math.pow(1 - progress, 3);

          current =
            Math.floor(target * eased);

          counter.textContent =
            current.toLocaleString();

          if (progress < 1) {

            requestAnimationFrame(update);

          } else {

            counter.textContent =
              target.toLocaleString();

          }

        }

        requestAnimationFrame(update);

      });

  }


  /* =========================================================
     CANVAS PARTICLES
     ========================================================= */

  const particlesCanvas =
    document.getElementById("particles");

  if (particlesCanvas) {

    const ctx =
      particlesCanvas.getContext("2d");

    let particles = [];

    function resizeParticles() {

      particlesCanvas.width =
        particlesCanvas.clientWidth *
        devicePixelRatio;

      particlesCanvas.height =
        particlesCanvas.clientHeight *
        devicePixelRatio;

      ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      );

      const count =
        Math.min(
          100,
          Math.floor(
            particlesCanvas.clientWidth / 10
          )
        );

      particles =
        Array.from(
          { length: count },
          () => ({
            x:
              Math.random() *
              particlesCanvas.clientWidth,

            y:
              Math.random() *
              particlesCanvas.clientHeight,

            r:
              Math.random() * 1.8 + .5,

            vx:
              (Math.random() - .5) * .25,

            vy:
              (Math.random() - .5) * .25,

            a:
              Math.random() * .6 + .2
          })
        );
    }


    function animateParticles() {

      const width =
        particlesCanvas.clientWidth;

      const height =
        particlesCanvas.clientHeight;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      particles.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;


        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;


        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(79,140,255,${p.a})`;

        ctx.fill();

      });


      requestAnimationFrame(
        animateParticles
      );
    }


    resizeParticles();

    window.addEventListener(
      "resize",
      resizeParticles
    );

    animateParticles();
  }


  /* =========================================================
     AURORA CANVAS
     ========================================================= */

  const aurora =
    document.getElementById("aurora");

  if (aurora) {

    const ctx =
      aurora.getContext("2d");

    let t = 0;


    function resizeAurora() {

      aurora.width =
        aurora.clientWidth *
        devicePixelRatio;

      aurora.height =
        aurora.clientHeight *
        devicePixelRatio;

      ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      );
    }


    function drawAurora() {

      const width =
        aurora.clientWidth;

      const height =
        aurora.clientHeight;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      const gradient =
        ctx.createRadialGradient(
          width * .72,
          height * .18,
          20,
          width * .72,
          height * .18,
          width * .65
        );

      gradient.addColorStop(
        0,
        "rgba(79,140,255,.18)"
      );

      gradient.addColorStop(
        .45,
        "rgba(11,31,77,.12)"
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );


      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      t += .005;

      requestAnimationFrame(
        drawAurora
      );
    }


    resizeAurora();

    window.addEventListener(
      "resize",
      resizeAurora
    );

    drawAurora();
  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     INIT
     ========================================================= */

  renderCategories();
  renderChips();
  renderProducts();
  renderCart();
  revealElements();
  animateCounters();

});
