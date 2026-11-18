"use strict";

/* ==========================================
   CHINA_ABDULAZIZ — MAIN APP
========================================== */

const $ = (id) => document.getElementById(id);

/* ==========================================
   DEFAULT PRODUCTS
========================================== */

const defaultProducts = [
  {
    id: 1,
    name: "Premium qora futbolka",
    category: "kiyim",
    price: 120000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    rating: 5,
  },
  {
    id: 2,
    name: "Oq klassik ko‘ylak",
    category: "kiyim",
    price: 185000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    rating: 5,
  },
  {
    id: 3,
    name: "Erkaklar qora shim",
    category: "kiyim",
    price: 210000,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
    rating: 4,
  },
  {
    id: 4,
    name: "Oversize futbolka",
    category: "kiyim",
    price: 145000,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    rating: 5,
  },
  {
    id: 5,
    name: "Erkaklar sport sumkasi",
    category: "sumka",
    price: 220000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    rating: 5,
  },
  {
    id: 6,
    name: "Qora kundalik ryukzak",
    category: "sumka",
    price: 195000,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800",
    rating: 4,
  },
  {
    id: 7,
    name: "Sport krossovka",
    category: "oyoq",
    price: 350000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    rating: 5,
  },
  {
    id: 8,
    name: "Oq kundalik krossovka",
    category: "oyoq",
    price: 320000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    rating: 5,
  },
  {
    id: 9,
    name: "Qora erkaklar ko‘zoynagi",
    category: "achki",
    price: 95000,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    rating: 4,
  },
  {
    id: 10,
    name: "Classic quyosh ko‘zoynagi",
    category: "achki",
    price: 115000,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    rating: 5,
  },
  {
    id: 11,
    name: "Qora erkaklar kepkasi",
    category: "kepka",
    price: 85000,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
    rating: 5,
  },
  {
    id: 12,
    name: "Sport kepka",
    category: "kepka",
    price: 75000,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800",
    rating: 4,
  },
];

/* ==========================================
   STORAGE
========================================== */

function loadStorage(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    showToast("Brauzer xotirasi to‘ldi!");
    return false;
  }
}

// Admin mahsulotlari
let adminProducts = loadStorage("china_products", []);

if (!Array.isArray(adminProducts)) {
  adminProducts = [];
}

// Takroriy ID bo‘lmasligi uchun
const products = [
  ...defaultProducts,
  ...adminProducts.filter(
    (adminProduct) =>
      !defaultProducts.some(
        (defaultProduct) => defaultProduct.id === adminProduct.id,
      ),
  ),
];

let cart = loadStorage("china_cart", []);
let favorites = loadStorage("china_favorites", []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(favorites)) favorites = [];

/* ==========================================
   ELEMENTS
========================================== */

const elements = {
  productsGrid: $("productsGrid"),
  searchInput: $("searchInput"),
  categoryFilter: $("categoryFilter"),
  sortFilter: $("sortFilter"),
  productTotal: $("productTotal"),
  emptyProducts: $("emptyProducts"),

  cartDrawer: $("cartDrawer"),
  cartItems: $("cartItems"),
  cartTotal: $("cartTotal"),
  cartCount: $("cartCount"),

  favoritesDrawer: $("favoritesDrawer"),
  favoriteItems: $("favoriteItems"),
  favoriteCount: $("favoriteCount"),

  drawerOverlay: $("drawerOverlay"),
  productModal: $("productModal"),
  productDetails: $("productDetails"),
  orderModal: $("orderModal"),
  toast: $("toast"),
};

/* ==========================================
   HELPERS
========================================== */

function money(value) {
  return new Intl.NumberFormat("en-US").format(value) + "$";
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function getProduct(id) {
  return products.find((product) => String(product.id) === String(id));
}

function getImage(product) {
  return escapeHTML(
    product.image || "https://placehold.co/600x600?text=China+Abdulaziz",
  );
}

/* ==========================================
   TOAST
========================================== */

let toastTimer;

function showToast(message) {
  const toast = elements.toast;
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ==========================================
   CATEGORIES
========================================== */

const categoryNames = {
  kiyim: "Erkaklar kiyimi",
  sumka: "Erkaklar sumkasi",
  oyoq: "Oyoq kiyim",
  achki: "Ko‘zoynak",
  kepka: "Kepkalar",
};

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts() {
  const grid = elements.productsGrid;
  if (!grid) return;

  const search = elements.searchInput?.value.trim().toLowerCase() || "";
  const category = elements.categoryFilter?.value || "all";
  const sorting = elements.sortFilter?.value || "default";

  const min = Math.max(0, Number($("minPrice")?.value) || 0);
  const maxValue = $("maxPrice")?.value;
  const max = maxValue ? Number(maxValue) : Infinity;

  let result = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);

    const matchesCategory = category === "all" || product.category === category;

    const matchesPrice =
      Number(product.price) >= min && Number(product.price) <= max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sorting === "cheap") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sorting === "expensive") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sorting === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name, "uz"));
  }

  grid.innerHTML = result
    .map((product) => {
      const favorite = favorites.some(
        (id) => String(id) === String(product.id),
      );

      return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${getImage(product)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.src='https://placehold.co/600x600?text=China+Abdulaziz'"
          >

          <span class="product-badge">CHINA</span>

          <button
            class="favorite-toggle ${favorite ? "active" : ""}"
            type="button"
            onclick="toggleFavorite('${product.id}')"
          >${favorite ? "♥" : "♡"}</button>
        </div>

        <div class="product-info">
          <span class="product-category">
            ${escapeHTML(categoryNames[product.category] || "Mahsulot")}
          </span>

          <h3>${escapeHTML(product.name)}</h3>

          <div class="product-rating">★★★★★</div>

          <div class="product-bottom">
            <span class="product-price">${money(product.price)}</span>

            <button
              class="add-cart"
              type="button"
              onclick="addToCart('${product.id}')"
            >🛒 Savatga</button>
          </div>

          <button
            class="view-product"
            type="button"
            onclick="showProduct('${product.id}')"
          >Mahsulotni ko‘rish →</button>
        </div>
      </article>
    `;
    })
    .join("");

  if (elements.productTotal) {
    elements.productTotal.textContent = result.length + " ta mahsulot";
  }

  if (elements.emptyProducts) {
    elements.emptyProducts.hidden = result.length !== 0;
  }
}

/* ==========================================
   CART
========================================== */

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const existing = cart.find((item) => String(item.id) === String(id));

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: product.id, quantity: 1 });
  }

  saveStorage("china_cart", cart);
  renderCart();
  showToast("✓ Mahsulot savatga qo‘shildi!");
}

function removeFromCart(id) {
  cart = cart.filter((item) => String(item.id) !== String(id));

  saveStorage("china_cart", cart);
  renderCart();
  showToast("Mahsulot savatdan o‘chirildi");
}

function changeQuantity(id, amount) {
  const item = cart.find((product) => String(product.id) === String(id));

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveStorage("china_cart", cart);
  renderCart();
}

function renderCart() {
  const container = elements.cartItems;
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <h3>Savatcha bo‘sh</h3>
        <p>Mahsulotlarni savatga qo‘shing.</p>
      </div>
    `;
  } else {
    container.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.id);
        if (!product) return "";

        return `
        <div class="cart-item">
          <img src="${getImage(product)}" alt="${escapeHTML(product.name)}">

          <div class="cart-item-info">
            <h4>${escapeHTML(product.name)}</h4>
            <strong>${money(product.price)}</strong>

            <div class="quantity-controls">
              <button onclick="changeQuantity('${product.id}', -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeQuantity('${product.id}', 1)">+</button>
            </div>

            <button
              class="remove-cart"
              onclick="removeFromCart('${product.id}')"
            >O‘chirish</button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (elements.cartTotal) {
    elements.cartTotal.textContent = money(total);
  }

  if (elements.cartCount) {
    elements.cartCount.textContent = count;
  }
}

/* ==========================================
   FAVORITES
========================================== */

function toggleFavorite(id) {
  const exists = favorites.some((item) => String(item) === String(id));

  if (exists) {
    favorites = favorites.filter((item) => String(item) !== String(id));
    showToast("Sevimlilardan olib tashlandi");
  } else {
    favorites.push(id);
    showToast("♥ Sevimlilarga qo‘shildi!");
  }

  saveStorage("china_favorites", favorites);
  renderProducts();
  renderFavorites();
}

function renderFavorites() {
  const container = elements.favoriteItems;
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span>♡</span>
        <h3>Sevimlilar bo‘sh</h3>
        <p>Yoqtirgan mahsulotlaringizni saqlang.</p>
      </div>
    `;
  } else {
    container.innerHTML = favorites
      .map((id) => {
        const product = getProduct(id);
        if (!product) return "";

        return `
        <div class="favorite-item">
          <img src="${getImage(product)}" alt="${escapeHTML(product.name)}">

          <div>
            <h4>${escapeHTML(product.name)}</h4>
            <strong>${money(product.price)}</strong>

            <button onclick="addToCart('${product.id}')">Savatga</button>
            <button onclick="toggleFavorite('${product.id}')">♥ O‘chirish</button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  if (elements.favoriteCount) {
    elements.favoriteCount.textContent = favorites.length;
  }
}

/* ==========================================
   PRODUCT MODAL
========================================== */

function showProduct(id) {
  const product = getProduct(id);
  if (!product || !elements.productDetails) return;

  elements.productDetails.innerHTML = `
    <div class="modal-product">
      <img
        src="${getImage(product)}"
        alt="${escapeHTML(product.name)}"
      >

      <span class="product-category">
        ${escapeHTML(categoryNames[product.category] || "Mahsulot")}
      </span>

      <h2>${escapeHTML(product.name)}</h2>
      <div class="product-rating">★★★★★</div>
      <h3 class="product-price">${money(product.price)}</h3>
      <p>${escapeHTML(product.description || "Sifatli mahsulot.")}</p>

      <button class="add-cart" onclick="addToCart('${product.id}')">
        🛒 Savatga qo‘shish
      </button>

      <button class="favorite-modal" onclick="toggleFavorite('${product.id}')">
        ♥ Sevimlilarga
      </button>
    </div>
  `;

  elements.productModal?.classList.add("show");
}

/* ==========================================
   DRAWERS
========================================== */

function closeDrawers() {
  elements.cartDrawer?.classList.remove("open");
  elements.favoritesDrawer?.classList.remove("open");
  elements.drawerOverlay?.classList.remove("show");
}

function openDrawer(type) {
  closeDrawers();

  if (type === "cart") {
    elements.cartDrawer?.classList.add("open");
  }

  if (type === "favorites") {
    elements.favoritesDrawer?.classList.add("open");
  }

  elements.drawerOverlay?.classList.add("show");
}

/* ==========================================
   THEME
========================================== */

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);

  const button = $("themeBtn");

  if (button) {
    button.textContent = dark ? "☀️" : "🌙";
  }

  localStorage.setItem("china_theme", dark ? "dark" : "light");
}

$("themeBtn")?.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});

setTheme(localStorage.getItem("china_theme") === "dark");

/* ==========================================
   SEARCH AND FILTERS
========================================== */

elements.searchInput?.addEventListener("input", renderProducts);
elements.categoryFilter?.addEventListener("change", renderProducts);
elements.sortFilter?.addEventListener("change", renderProducts);

$("applyPrice")?.addEventListener("click", () => {
  const min = Number($("minPrice")?.value || 0);
  const max = $("maxPrice")?.value ? Number($("maxPrice").value) : Infinity;

  if (min < 0 || max < 0 || min > max) {
    showToast("Narxlarni to‘g‘ri kiriting!");
    return;
  }

  renderProducts();
});

$("resetFilters")?.addEventListener("click", () => {
  if (elements.searchInput) elements.searchInput.value = "";
  if (elements.categoryFilter) elements.categoryFilter.value = "all";
  if (elements.sortFilter) elements.sortFilter.value = "default";
  if ($("minPrice")) $("minPrice").value = "";
  if ($("maxPrice")) $("maxPrice").value = "";

  renderProducts();
  showToast("Filtrlar tozalandi");
});

$("clearSearch")?.addEventListener("click", () => {
  if (!elements.searchInput) return;

  elements.searchInput.value = "";
  renderProducts();
  elements.searchInput.focus();
});

/* ==========================================
   CATEGORY CARDS
========================================== */

document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if (elements.categoryFilter) {
      elements.categoryFilter.value = category;
    }

    renderProducts();

    $("products")?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ==========================================
   BUTTON EVENTS
========================================== */

$("cartBtn")?.addEventListener("click", () => openDrawer("cart"));
$("favoriteBtn")?.addEventListener("click", () => openDrawer("favorites"));

$("closeCart")?.addEventListener("click", closeDrawers);
$("closeFavorites")?.addEventListener("click", closeDrawers);

elements.drawerOverlay?.addEventListener("click", closeDrawers);

$("closeProductModal")?.addEventListener("click", () => {
  elements.productModal?.classList.remove("show");
});

$("closeOrderModal")?.addEventListener("click", () => {
  elements.orderModal?.classList.remove("show");
});

document.querySelectorAll(".modal-overlay").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

/* ==========================================
   MOBILE MENU
========================================== */

$("menuBtn")?.addEventListener("click", () => {
  $("navigation")?.classList.toggle("show");
});

document.querySelectorAll("#navigation a").forEach((link) => {
  link.addEventListener("click", () => {
    $("navigation")?.classList.remove("show");
  });
});

/* ==========================================
   ORDER
========================================== */

$("checkoutBtn")?.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Avval savatga mahsulot qo‘shing!");
    return;
  }

  elements.orderModal?.classList.add("show");
});

$("orderForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("customerName")?.value.trim();
  const phone = $("customerPhone")?.value.trim();
  const address = $("customerAddress")?.value.trim();

  if (!name || !phone || !address) {
    showToast("Barcha maydonlarni to‘ldiring!");
    return;
  }

  const itemList = cart
    .map((item) => {
      const product = getProduct(item.id);

      return product
        ? `${product.name} x ${item.quantity} = ${money(product.price * item.quantity)}`
        : "";
    })
    .filter(Boolean)
    .join("\n");

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const message =
    `Assalomu alaykum! Yangi buyurtma:\n\n` +
    `Ism: ${name}\nTelefon: ${phone}\nManzil: ${address}\n\n` +
    `Mahsulotlar:\n${itemList}\n\nJami: ${money(total)}`;

  const telegramURL =
    "https://t.me/share/url?url=" +
    encodeURIComponent("https://t.me/abdulazizsobitov") +
    "&text=" +
    encodeURIComponent(message);

  window.open(telegramURL, "_blank", "noopener,noreferrer");
});

/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawers();
    elements.productModal?.classList.remove("show");
    elements.orderModal?.classList.remove("show");
  }
});

/* ==========================================
   ADMIN PRODUCTS LIVE UPDATE
========================================== */

window.addEventListener("storage", (event) => {
  if (event.key === "china_products") {
    adminProducts = loadStorage("china_products", []);

    if (!Array.isArray(adminProducts)) {
      adminProducts = [];
    }

    products.splice(
      0,
      products.length,
      ...defaultProducts,
      ...adminProducts.filter(
        (adminProduct) =>
          !defaultProducts.some(
            (defaultProduct) => defaultProduct.id === adminProduct.id,
          ),
      ),
    );

    renderProducts();
    renderCart();
    renderFavorites();
    showToast("Mahsulotlar yangilandi!");
  }
});

/* ==========================================
   INITIALIZE
========================================== */

renderProducts();
renderCart();
renderFavorites();

console.log("CHINA_ABDULAZIZ tayyor!");
