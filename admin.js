const form = document.getElementById("productForm");
const adminProducts = document.getElementById("adminProducts");
const productCount = document.getElementById("productCount");

const fileInput = document.getElementById("productFile");
const imagePreview = document.getElementById("imagePreview");

const STORAGE_KEY = "china_products";

let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let selectedImage = "";
let editingId = null;

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    alert("Xotira to‘ldi. Kichikroq rasm tanlang!");
    return false;
  }
}

function formatPrice(price) {
  return Number(price).toLocaleString("en-US") + "$";
}

// Rasm tanlash
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Faqat rasm faylini tanlang!");
    fileInput.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Rasm 2 MB dan kichik bo‘lsin!");
    fileInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    selectedImage = reader.result;
    imagePreview.src = selectedImage;
    imagePreview.style.display = "block";
  };

  reader.readAsDataURL(file);
});

// Formani tozalash
function resetForm() {
  form.reset();

  selectedImage = "";
  editingId = null;

  imagePreview.src = "";
  imagePreview.style.display = "none";

  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton) submitButton.textContent = "Mahsulotni saqlash";

  const cancelButton = document.getElementById("cancelEdit");
  if (cancelButton) cancelButton.remove();
}

// Tahrirlashni bekor qilish tugmasi
function addCancelButton() {
  let cancelButton = document.getElementById("cancelEdit");

  if (!cancelButton) {
    cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "cancelEdit";
    cancelButton.textContent = "Bekor qilish";
    cancelButton.style.marginLeft = "10px";

    form.appendChild(cancelButton);
  }

  cancelButton.onclick = resetForm;
}

// Mahsulotlarni chiqarish
function renderProducts() {
  adminProducts.innerHTML = "";
  productCount.textContent = products.length;

  if (products.length === 0) {
    adminProducts.textContent = "Hozircha mahsulot yo‘q.";
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "admin-product";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const info = document.createElement("div");
    info.className = "admin-product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price);

    const category = document.createElement("small");
    category.textContent = "Kategoriya: " + product.category;

    info.append(name, price, category);

    // Tahrirlash tugmasi
    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "✏️ Tahrirlash";

    editButton.addEventListener("click", () => {
      editingId = product.id;

      document.getElementById("productName").value = product.name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productCategory").value = product.category;
      document.getElementById("productDescription").value =
        product.description || "";

      selectedImage = product.image;

      imagePreview.src = selectedImage;
      imagePreview.style.display = "block";

      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) submitButton.textContent = "O‘zgarishlarni saqlash";

      addCancelButton();

      form.scrollIntoView({ behavior: "smooth" });
    });

    // O‘chirish tugmasi
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "O‘chirish";

    deleteButton.addEventListener("click", () => {
      if (!confirm("Mahsulotni o‘chirasizmi?")) return;

      products = products.filter((p) => p.id !== product.id);

      if (saveProducts()) {
        if (editingId === product.id) resetForm();
        renderProducts();
      }
    });

    item.append(img, info, editButton, deleteButton);
    adminProducts.appendChild(item);
  });
}

// Mahsulot saqlash va tahrirlash
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();

  const price = Number(
    document.getElementById("productPrice").value.replace(/[^0-9.]/g, ""),
  );

  const category = document.getElementById("productCategory").value;

  const description = document
    .getElementById("productDescription")
    .value.trim();

  if (!name || !price || price <= 0) {
    alert("Mahsulot nomi va narxini to‘g‘ri kiriting!");
    return;
  }

  if (!selectedImage) {
    alert("Avval rasm tanlang!");
    return;
  }

  const oldProducts = [...products];

  if (editingId !== null) {
    products = products.map((product) => {
      if (product.id === editingId) {
        return {
          ...product,
          name,
          price,
          category,
          image: selectedImage,
          description,
        };
      }

      return product;
    });
  } else {
    const newProduct = {
      id: Date.now(),
      name,
      price,
      category,
      image: selectedImage,
      description,
      rating: 5,
    };

    products.unshift(newProduct);
  }

  if (!saveProducts()) {
    products = oldProducts;
    return;
  }

  resetForm();
  renderProducts();

  alert("Mahsulot muvaffaqiyatli saqlandi!");
});

renderProducts();
