const API_URL = 'http://localhost:8000/api';

/* PRODUCTOS ESTATICOS */
const staticProducts = [
  {
    id: 1,
    code: 'HSJ001',
    product_name: 'Frasco de especias',
    warehouse_id: 1,
    branch_id: 1,
    currency_id: 1,
    price: 12990,
    material_plastic: false,
    material_metal: false,
    material_wood: true,
    material_glass: true,
    material_textile: false,
    product_description: 'Un frasco compacto para tus especias favoritas.',
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    id: 2,
    code: 'SWP002',
    product_name: 'Paño de seda',
    warehouse_id: 1,
    branch_id: 2,
    currency_id: 2,
    price: 24.5,
    material_plastic: true,
    material_metal: false,
    material_wood: false,
    material_glass: false,
    material_textile: true,
    product_description: 'Paño ligero de seda con colores vivos.',
    created_at: '2024-02-05T11:30:00Z',
  },
  {
    id: 3,
    code: 'ATS003',
    product_name: 'Set de té artesanal',
    warehouse_id: 2,
    branch_id: 2,
    currency_id: 1,
    price: 39000,
    material_plastic: false,
    material_metal: false,
    material_wood: true,
    material_glass: true,
    material_textile: true,
    product_description: 'Un set de té diseñado para uso cotidiano.',
    created_at: '2024-03-12T09:15:00Z',
  },
];

/* VALIDACIONES */
function fieldLengthIsPositive(fieldLength, label, notifyToUser) {
  if (fieldLength > 0) return true;
  const warnMessage = `${label} no puede estar en blanco.`
  notifyToUser ? alert(warnMessage) : console.error(warnMessage);
  return false;
}

function fieldLengthIsInRange(fieldLength, label, minLength, maxLength, notifyToUser) {
  if (fieldLength >= minLength && fieldLength <= maxLength) return true;
  const warnMessage = `${label} debe tener entre ${minLength} y ${maxLength} caracteres.`
  notifyToUser ? alert(warnMessage) : console.error(warnMessage);
  return false;
}

function regexTest(regexTests, value, errorMessage, notifyToUser) {
  if (regexTests.every(r => r.test(value))) return true;
  notifyToUser ? alert(errorMessage) : console.error(errorMessage);
  return false;
}

function isValidProductCode(code, notifyToUser) {
  if (typeof code !== 'string') {
    console.error(`Código de producto tiene valor inválido: ${code}`);
    return false;
  }
  const length = code.trim().length;

  const codeLabel = 'El código del producto';
  if (!fieldLengthIsPositive(length, codeLabel, notifyToUser)) return false;
  if (!fieldLengthIsInRange(length, codeLabel, 5, 15, notifyToUser)) return false;
  if (!regexTest(
    [/^[a-zA-Z0-9]+$/, /[A-Za-z]/, /\d/],
    code,
    `${codeLabel} debe contener letras y números.`,
    notifyToUser)) return false;
  return true;
}

async function isUniqueProductCode(code, notifyToUser) {
  const isUnique = currentProducts.filter(p => p && p.code === code).length <= 0;
  if (isUnique) return true;
  const warnMessage = 'El código del producto ya está registrado.';
  notifyToUser ? alert(warnMessage) : console.error(warnMessage);
  return false;
}

function isValidName(name, notifyToUser) {
  if (typeof name !== 'string') return false;
  const length = name.trim().length;
  const nameLabel = 'El nombre del producto';
  if (!fieldLengthIsPositive(length, nameLabel, notifyToUser)) return false;
  if (!fieldLengthIsInRange(length, nameLabel, 2, 50, notifyToUser)) return false;
  return true;
}

function isValidPrice(price, notifyToUser) {
  if (typeof price === 'number') {
    price = price.toString();
  }
  if (typeof price !== 'string') return false;
  const length = price.trim().length;
  const priceLabel = 'El precio del producto';
  if (!fieldLengthIsPositive(length, priceLabel, notifyToUser)) return false;
  if (!regexTest(
    [/^\d+(\.\d{1,2})?$/],
    price,
    `${priceLabel} debe ser un número positivo con hasta dos decimales.`,
    notifyToUser)) return false;

  return true;
}

function isValidMaterialChoice(materials, notifyToUser) {
  if (!Array.isArray(materials) || materials.some(m => typeof m !== 'boolean')) {
    console.error(`Materiales del producto tienen valor inválido: ${materials}`);
    return false;
  }
  const materialCount = materials.filter(m => m === true).length;
  if (materialCount < 2) {
    const warnMessage = 'Debe seleccionar al menos dos materiales para el producto.';
    notifyToUser ? alert(warnMessage) : console.error(warnMessage);
    return false;
  }
  return true;
}

function isValidChoiceField(value, label, notifyToUser) {
  if (value === null || value === undefined || value == -1) {
    const warnMessage = `Debe seleccionar ${label}.`;
    notifyToUser ? alert(warnMessage) : console.error(warnMessage);
    return false;
  }
  return true;
}

function isValidDescription(description, notifyToUser) {
  if (typeof description !== 'string') return false;
  const length = description.trim().length;
  const descriptionLabel = 'La descripción del producto';
  if (!fieldLengthIsPositive(length, descriptionLabel, notifyToUser)) return false;
  if (!fieldLengthIsInRange(length, descriptionLabel, 10, 1000, notifyToUser)) return false;
  return true;
}

function isValidProduct(product, checkUniqueCodes = false, notifyToUser = false) {
  console.log('Validando producto:', product);
  console.log('Validando producto:', JSON.stringify(product));
  if (!product || typeof product !== 'object') return false;

  const materialCount = [
    product.material_plastic,
    product.material_metal,
    product.material_wood,
    product.material_glass,
    product.material_textile,
  ].filter((value) => value === true).length;

  return (
    isValidProductCode(product.code, notifyToUser) &&
    (checkUniqueCodes ? isUniqueProductCode(product.code, notifyToUser) : true) &&
    isValidName(product.product_name, notifyToUser) &&
    isValidPrice(product.price, notifyToUser) &&
    isValidMaterialChoice([
      product.material_plastic,
      product.material_metal,
      product.material_wood,
      product.material_glass,
      product.material_textile
    ], notifyToUser) &&
    isValidChoiceField(product.warehouse_id, 'una bodega', notifyToUser) &&
    isValidChoiceField(product.branch_id, 'una sucursal para la bodega seleccionada', notifyToUser) &&
    isValidChoiceField(product.currency_id, 'una moneda para el producto', notifyToUser) &&
    isValidDescription(product.product_description, notifyToUser)
  );
}

function areProductsValid(products, checkUniqueCodes = false) {
  console.log('productos:', products);
  return Array.isArray(products) && products.every(p => isValidProduct(p, checkUniqueCodes));
}

function isValidArray(array) {
  return array && Array.isArray(array) && array.length > 0;
}


/* INTERFAZ DE USUARIO */
const productListDiv = document.getElementById('productListDiv');
const createProductDiv = document.getElementById('createProductDiv');
const addProductBtn = document.getElementById('addProductBtn');
// const refreshBtn = document.getElementById('refreshBtn');
const statusText = document.getElementById('status');
const cardTitle = document.getElementById('card-title');
const cardHeader = document.getElementById('card-header');

let currentProducts = [];

function switchCardTitle(isAddProductView) {
  if (!cardTitle) return;
  cardTitle.textContent = isAddProductView ? 'Formulario de Producto' : 'Lista de Productos';
  cardHeader.style.justifyContent = isAddProductView ? 'center' : 'space-between';
  addProductBtn.hidden = isAddProductView;
}

function renderProducts(items) {
  productListDiv.innerHTML = items.map((product) => `
    <article class="product-card">
      <h3>${product.product_name}</h3>
      <p>${product.product_description}</p>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Bodega:</strong> ${product.warehouse_id}</p>
      <p><strong>Sucursal:</strong> ${product.branch_id}</p>
      <p><strong>Moneda:</strong> ${product.currency_id}</p>
      <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
      <p><strong>Materiales:</strong> ${[
      product.material_plastic && 'Plástico',
      product.material_metal && 'Metal',
      product.material_wood && 'Madera',
      product.material_glass && 'Vidrio',
      product.material_textile && 'Textil',
    ].filter(Boolean).join(', ') || 'Ninguno'}</p>
    </article>
  `).join('');
}

async function renderCreateProductForm() {
  const { warehouses, branches, currencies } = await fetchCreateProductOptions();

  const blankChoice = '<option value="-1"></option>';
  const warehouseOptions = blankChoice +
    warehouses.map((warehouse) => `
          <option value="${warehouse.id}">${warehouse.label}</option>
        `).join('');
  const branchOptions = blankChoice;
  const currencyOptions = blankChoice +
    currencies.map((currency) => `
          <option value="${currency.id}">${currency.label}</option>
        `).join('');

  const formHtml = `
    <form id="createProductForm" class="product-form">
      <label class="two-col-field">
        Código
        <input type="text" name="code">
      </label>
      <label class="two-col-field">
        Nombre
        <input type="text" name="product_name">
      </label>
      <label class="two-col-field">
        Bodega
        <select name="warehouse_id">
          ${warehouseOptions}
        </select>
      </label>
      <label class="two-col-field">
        Sucursal
        <select name="branch_id">
          ${branchOptions}
        </select>
      </label>
      <label class="two-col-field">
        Moneda
        <select name="currency_id">
          ${currencyOptions}
        </select>
      </label>
      <label class="two-col-field">
        Precio
        <input type="text" name="price">
      </label>
      <fieldset>
        <legend>Material del Producto:</legend>
        <label>
          <input type="checkbox" name="material_plastic"> Plástico
        </label>
        <label>
          <input type="checkbox" name="material_metal"> Metal
        </label>
        <label>
          <input type="checkbox" name="material_wood"> Madera
        </label>
        <label>
          <input type="checkbox" name="material_glass"> Vidrio
        </label>
        <label>
          <input type="checkbox" name="material_textile"> Textil
        </label>
      </fieldset>
      <label class="full-width-field">
        Descripción:
        <textarea name="product_description" id="product_description"></textarea>
      </label>
      <div class="product-form-buttons">
        <!-- <button class="cancel-button" type="button">Cancelar</button> -->
        <button class="create-product-button" type="submit">Guardar Producto</button>
      </div>
    </form>
  `;

  productListDiv.hidden = true;
  createProductDiv.hidden = false;
  createProductDiv.innerHTML = formHtml;
  switchCardTitle(true);

  const form = document.getElementById('createProductForm');

  const warehouseSelect = form.querySelector('select[name="warehouse_id"]');
  const branchSelect = form.querySelector('select[name="branch_id"]');

  const updateBranchOptions = (warehouseId) => {
    if (warehouseId === null || Number.isNaN(warehouseId)) {
      branchSelect.innerHTML = blankChoice;
      return;
    }

    const options = blankChoice + branches
      .filter((branch) => branch.warehouse_id === warehouseId)
      .map((branch) => `
          <option value="${branch.id}">${branch.label}</option>
        `).join('');

    branchSelect.innerHTML = options;
  };

  warehouseSelect.addEventListener('change', (event) => {
    const selectedWarehouseId = Number(event.target.value);
    updateBranchOptions(selectedWarehouseId);
  });

  // document.querySelector('.cancel-button').addEventListener('click', (event) => {
  //   createProductDiv.hidden = true;
  //   productListDiv.hidden = false;
  // });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const newProduct = {
      code: formData.get('code'),
      product_name: formData.get('product_name'),
      warehouse_id: Number(formData.get('warehouse_id')),
      branch_id: Number(formData.get('branch_id')),
      currency_id: Number(formData.get('currency_id')),
      price: formData.get('price'),
      material_plastic: formData.get('material_plastic') === 'on',
      material_metal: formData.get('material_metal') === 'on',
      material_wood: formData.get('material_wood') === 'on',
      material_glass: formData.get('material_glass') === 'on',
      material_textile: formData.get('material_textile') === 'on',
      product_description: formData.get('product_description')
    };
    try {
      if (!isValidProduct(newProduct, true, true)) throw new Error('Producto no cumple con el formato requerido.');
      await createProduct(newProduct);
      await fetchProducts();
      createProductDiv.hidden = true;
      productListDiv.hidden = false;
      switchCardTitle(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      window.alert('Hubo un error al crear el producto. Intente nuevamente.');
    }
  });
}

function updateStatus(message, isError = false) {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.className = isError ? 'status status-error' : 'status';
}
function showStatus(show) {
  statusText.hidden = !show;
}

function updateProducts(newProducts) {
  currentProducts = newProducts;
}

/* FUNCIONES DE BACKEND */
async function fetchCreateProductOptions() {
  try {
    const response = await fetch(`${API_URL}/products/options`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    console.log('Respuesta de opciones del backend:', response);
    const data = await response.json();
    console.log('Opciones recibidas del backend:', data);
    if (!data || typeof data !== 'object') {
      throw new Error('Backend returned data in unexpected format.');
    }

    const warehouses = data.warehouses;
    const branches = data.branches;
    const currencies = data.currencies;

    if (!isValidArray(warehouses)) {
      throw new Error('Opciones de bodega invalidas.');
    }
    if (!isValidArray(branches)) {
      throw new Error('Opciones de sucursal invalidas.');
    }
    if (!isValidArray(currencies)) {
      throw new Error('Opciones de moneda invalidas.');
    }

    return { warehouses, branches, currencies };
  } catch (error) {
    console.error('Error al obtener opciones del backend:', error);
    window.alert('Error interno de sistema. No se pudieron cargar opciones dinámicas. Intente nuevamente más tarde.');
  }
}

async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    window.alert('Producto creado exitosamente.');
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

async function fetchProducts() {
  showStatus(true);
  updateStatus('Cargando productos...');

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    let products = Array.isArray(data)
      ? data
      : Array.isArray(data.products)
        ? data.products
        : staticProducts;

    if (products === staticProducts) {
      throw new Error('Backend returned data in unexpected format.');
    } else if (!areProductsValid(products)) {
      showStatus(true);
      updateStatus('Productos almacenados con error de formato. Mostrando productos de ejemplo', true);
      products = staticProducts;
    } else {
      showStatus(false);
    }

    renderProducts(products);
    updateProducts(products);
  } catch (error) {
    console.error('Failed to load backend products:', error);
    showStatus(true);
    updateStatus('Error interno de sistema. Mostrando productos de ejemplo.', true);
    renderProducts(staticProducts);
  }
}

// refreshBtn.addEventListener('click', fetchProducts);
addProductBtn.addEventListener('click', async () => {
  await renderCreateProductForm();
});
fetchProducts();
