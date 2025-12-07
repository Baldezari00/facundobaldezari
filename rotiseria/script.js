// ====================================
// SISTEMA DE TEMAS
// ====================================

function loadTheme() {
    const savedTheme = localStorage.getItem('rotiseriaTheme') || 'clasico';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function changeTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('rotiseriaTheme', themeName);
    toggleThemeMenu();
}

function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    menu.classList.toggle('active');
}

// Cerrar menú de temas al hacer click fuera
document.addEventListener('click', function(event) {
    const themeSelector = document.getElementById('themeSelector');
    const themeMenu = document.getElementById('themeMenu');
    const isClickInside = themeSelector.contains(event.target);
    
    if (!isClickInside && themeMenu.classList.contains('active')) {
        themeMenu.classList.remove('active');
    }
});

// ====================================
// SISTEMA DE SEGURIDAD MEJORADO
// ====================================
// La contraseña se almacena con hash SHA-256 + salt
// NO es posible ver la contraseña original desde localStorage

// Función de hash SHA-256 (implementación simple)
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generar salt aleatorio
function generateSalt() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verificar contraseña
async function verifyPassword(password, storedHash, salt) {
    const hash = await hashPassword(password, salt);
    return hash === storedHash;
}

// Categorías predeterminadas
const defaultCategories = [
    { id: 'pollo', name: 'Pollo al Espiedo' },
    { id: 'minutas', name: 'Minutas' },
    { id: 'empanadas', name: 'Empanadas' },
    { id: 'tartas', name: 'Tartas y Pasteles' },
    { id: 'ensaladas', name: 'Ensaladas' },
    { id: 'combos', name: 'Combos' }
];

// Productos iniciales
const defaultProducts = {
    pollo: [
        { id: 1, name: 'Pollo Entero', description: 'Jugoso pollo asado con especias secretas', price: 10000, badge: 'destacado' },
        { id: 2, name: '1/2 Pollo', description: 'Porción perfecta para 2 personas', price: 5500, badge: '' },
        { id: 3, name: '1/4 Pollo', description: 'Porción individual', price: 3000, badge: '' }
    ],
    minutas: [
        { id: 4, name: 'Milanesa Napolitana', description: 'Con jamón, queso y salsa', price: 6500, badge: '' },
        { id: 5, name: 'Milanesa a Caballo', description: 'Con huevos fritos', price: 6000, badge: '' },
        { id: 6, name: 'Papas Fritas', description: 'Crocantes y doradas', price: 2500, badge: '' }
    ],
    empanadas: [
        { id: 7, name: 'Carne', description: 'Carne cortada a cuchillo', price: 800, badge: 'destacado' },
        { id: 8, name: 'Jamón y Queso', description: 'Clásicas y deliciosas', price: 700, badge: '' },
        { id: 9, name: 'Pollo', description: 'Con salsa criolla', price: 750, badge: '' }
    ],
    tartas: [
        { id: 10, name: 'Tarta de Jamón y Queso', description: 'Casera y abundante', price: 4500, badge: '' },
        { id: 11, name: 'Pastel de Papa', description: 'Con carne picada', price: 5000, badge: '' }
    ],
    ensaladas: [
        { id: 12, name: 'Ensalada Mixta', description: 'Fresca y variada', price: 2000, badge: '' },
        { id: 13, name: 'Ensalada Rusa', description: 'Cremosa y casera', price: 2500, badge: '' }
    ],
    combos: [
        { id: 14, name: 'Combo Familiar', description: 'Pollo entero + Papas fritas grandes + Ensalada + Bebida 2L', price: 15000, badge: 'destacado' },
        { id: 15, name: 'Combo Individual', description: '1/4 Pollo + Papas fritas + Bebida', price: 5500, badge: 'oferta' },
        { id: 16, name: 'Combo Empanadas', description: '12 Empanadas surtidas + Bebida 1.5L', price: 10000, badge: '' },
        { id: 17, name: 'Combo Pareja', description: '1/2 Pollo + 6 Empanadas + Ensalada + Bebida 1.5L', price: 12500, badge: 'popular' }
    ]
};

// Inicializar sistema
async function initSystem() {
    // Cargar tema
    loadTheme();
    
    // Inicializar categorías
    if (!localStorage.getItem('rotiseriaCategories')) {
        localStorage.setItem('rotiseriaCategories', JSON.stringify(defaultCategories));
    }
    
    // Inicializar productos
    if (!localStorage.getItem('rotiseriaProducts')) {
        localStorage.setItem('rotiseriaProducts', JSON.stringify(defaultProducts));
    }
    
    // Inicializar contraseña con hash seguro
    if (!localStorage.getItem('adminPasswordHash')) {
        const salt = generateSalt();
        const hash = await hashPassword('admin123', salt);
        localStorage.setItem('adminPasswordHash', hash);
        localStorage.setItem('adminSalt', salt);
    }
}

// Obtener categorías
function getCategories() {
    const categories = localStorage.getItem('rotiseriaCategories');
    return categories ? JSON.parse(categories) : defaultCategories;
}

// Guardar categorías
function saveCategories(categories) {
    localStorage.setItem('rotiseriaCategories', JSON.stringify(categories));
}

// Obtener productos
function getProducts() {
    const products = localStorage.getItem('rotiseriaProducts');
    return products ? JSON.parse(products) : defaultProducts;
}

// Guardar productos
function saveProducts(products) {
    localStorage.setItem('rotiseriaProducts', JSON.stringify(products));
}

// Renderizar productos en la página
function renderProducts() {
    const products = getProducts();
    const categories = getCategories();
    const dynamicMenu = document.getElementById('dynamicMenu');
    
    if (dynamicMenu) {
        dynamicMenu.innerHTML = '';
        
        categories.forEach(category => {
            const categoryProducts = products[category.id] || [];
            
            if (categoryProducts.length > 0) {
                const section = document.createElement('div');
                section.className = 'menu-category';
                section.innerHTML = `
                    <h3>${category.name}</h3>
                    <div class="grid grid-3" id="category-${category.id}"></div>
                `;
                dynamicMenu.appendChild(section);
                
                const container = document.getElementById(`category-${category.id}`);
                categoryProducts.forEach(product => {
                    const card = createProductCard(product);
                    container.appendChild(card);
                });
            }
        });
    }
}

// Crear card de producto
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'menu-card';
    
    let badgeHTML = '';
    if (product.badge) {
        const badgeTexts = {
            'destacado': 'Destacado',
            'popular': 'Popular',
            'oferta': 'Oferta'
        };
        badgeHTML = `<span class="badge badge-${product.badge}">${badgeTexts[product.badge]}</span>`;
    }
    
    div.innerHTML = `
        ${badgeHTML}
        <h4>${product.name}</h4>
        <p class="description">${product.description}</p>
        <p class="price">$${product.price.toLocaleString('es-AR')}</p>
    `;
    
    return div;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

function closeMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    nav.classList.remove('active');
    toggle.classList.remove('active');
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', async function() {
    await initSystem();
    renderProducts();
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Animación de entrada para las cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .menu-card, .testimonial').forEach(card => {
        observer.observe(card);
    });
});

// ====================================
// FUNCIONES DE ADMINISTRACIÓN
// ====================================

function openAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'flex';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const storedHash = localStorage.getItem('adminPasswordHash');
    const salt = localStorage.getItem('adminSalt');
    
    const isValid = await verifyPassword(password, storedHash, salt);
    
    if (isValid) {
        closeAdminLogin();
        openAdminPanel();
    } else {
        alert('Contraseña incorrecta');
    }
}

function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.body.style.overflow = 'hidden';
    renderCategoriesList();
    updateCategorySelect();
    renderProductsList();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.body.style.overflow = 'auto';
    cancelEdit();
}

// ====================================
// GESTIÓN DE CATEGORÍAS
// ====================================

function renderCategoriesList() {
    const categories = getCategories();
    const container = document.getElementById('categoriesList');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'category-item';
        const products = getProducts();
        const productCount = (products[category.id] || []).length;
        
        item.innerHTML = `
            <div class="category-item-info">
                <h4>${category.name}</h4>
                <p>ID: ${category.id} | ${productCount} producto(s)</p>
            </div>
            <div class="category-item-actions">
                <button onclick="deleteCategory('${category.id}')" class="btn btn-small btn-delete">Eliminar Categoría</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function addCategory() {
    const id = document.getElementById('newCategoryId').value.trim().toLowerCase();
    const name = document.getElementById('newCategoryName').value.trim();
    
    if (!id || !name) {
        alert('Por favor completá todos los campos');
        return;
    }
    
    // Validar que el ID no contenga espacios ni caracteres especiales
    if (!/^[a-z0-9_]+$/.test(id)) {
        alert('El ID solo puede contener letras minúsculas, números y guiones bajos');
        return;
    }
    
    const categories = getCategories();
    
    // Verificar que no exista
    if (categories.find(c => c.id === id)) {
        alert('Ya existe una categoría con ese ID');
        return;
    }
    
    categories.push({ id, name });
    saveCategories(categories);
    
    // Inicializar productos vacíos para esta categoría
    const products = getProducts();
    products[id] = [];
    saveProducts(products);
    
    document.getElementById('newCategoryId').value = '';
    document.getElementById('newCategoryName').value = '';
    
    renderCategoriesList();
    updateCategorySelect();
    renderProducts();
    alert('Categoría agregada exitosamente');
}

function deleteCategory(categoryId) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);
    const products = getProducts();
    const productCount = (products[categoryId] || []).length;
    
    // Primera confirmación
    const confirmFirst = confirm(
        `¿Estás seguro de que querés eliminar la categoría "${category.name}"?\n\n` +
        `Se eliminarán ${productCount} producto(s) asociado(s).\n\n` +
        `Esta acción NO se puede deshacer.`
    );
    
    if (!confirmFirst) return;
    
    // Segunda confirmación
    const confirmSecond = confirm(
        `CONFIRMACIÓN FINAL:\n\n` +
        `¿REALMENTE querés eliminar "${category.name}" y todos sus productos?\n\n` +
        `Escribí OK en la próxima ventana para confirmar.`
    );
    
    if (!confirmSecond) return;
    
    // Tercera confirmación con texto
    const confirmText = prompt('Escribí "OK" (en mayúsculas) para confirmar la eliminación:');
    
    if (confirmText !== 'OK') {
        alert('Eliminación cancelada');
        return;
    }
    
    // Eliminar categoría y productos
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    saveCategories(updatedCategories);
    
    delete products[categoryId];
    saveProducts(products);
    
    renderCategoriesList();
    updateCategorySelect();
    renderProducts();
    renderProductsList();
    alert('Categoría eliminada exitosamente');
}

function updateCategorySelect() {
    const categories = getCategories();
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Seleccioná una categoría</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });

    renderCategoriesList();
}

// ====================================
// GESTIÓN DE PRODUCTOS
// ====================================

function renderProductsList() {
    const products = getProducts();
    const categories = getCategories();
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const categoryProducts = products[category.id] || [];
        
        if (categoryProducts.length > 0) {
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category.name;
            categoryTitle.style.marginTop = '1.5rem';
            categoryTitle.style.marginBottom = '1rem';
            categoryTitle.style.color = 'var(--primary-color)';
            container.appendChild(categoryTitle);
            
            categoryProducts.forEach(product => {
                const item = document.createElement('div');
                item.className = 'product-item';
                
                const badgeText = product.badge ? ` | ${product.badge.toUpperCase()}` : '';
                
                item.innerHTML = `
                    <div class="product-item-info">
                        <h4>${product.name}${badgeText}</h4>
                        <p>${product.description}</p>
                        <p style="color: var(--primary-color); font-weight: 600;">$${product.price.toLocaleString('es-AR')}</p>
                    </div>
                    <div class="product-item-actions">
                        <a href="#editarRedirect"><button onclick="editProduct('${category.id}', ${product.id})" class="btn btn-small btn-edit" >Editar</button></a>
                        <a><button onclick="deleteProduct('${category.id}', ${product.id})" class="btn btn-small btn-delete">Eliminar</button></a>
                    </div>
                `;
                container.appendChild(item);
            });
        }
    });
}

function saveProduct() {
    const category = document.getElementById('productCategory').value;
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const badge = document.getElementById('productBadge').value;
    const editId = document.getElementById('editProductId').value;
    const editCategory = document.getElementById('editProductCategory').value;
    
    if (!category || !name || !description || !price) {
        alert('Por favor completá todos los campos obligatorios');
        return;
    }
    
    const products = getProducts();
    
    if (editId) {
        // Editar producto existente
        if (editCategory !== category) {
            // Mover producto a otra categoría
            products[editCategory] = products[editCategory].filter(p => p.id != editId);
        }
        
        const productIndex = products[category].findIndex(p => p.id == editId);
        if (productIndex !== -1) {
            products[category][productIndex] = {
                id: parseInt(editId),
                name,
                description,
                price,
                badge
            };
        } else {
            // Si es una nueva categoría, agregarlo
            products[category].push({
                id: parseInt(editId),
                name,
                description,
                price,
                badge
            });
        }
    } else {
        // Crear nuevo producto
        const allProducts = Object.values(products).flat();
        const newId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
        
        if (!products[category]) {
            products[category] = [];
        }
        
        products[category].push({
            id: newId,
            name,
            description,
            price,
            badge
        });
    }
    
    saveProducts(products);
    renderProducts();
    renderProductsList();
    renderCategoriesList();
    cancelEdit();
    alert('Producto guardado exitosamente');
}

function editProduct(category, id) {
    const products = getProducts();
    const product = products[category].find(p => p.id === id);
    
    if (product) {
        document.getElementById('editProductId').value = id;
        document.getElementById('editProductCategory').value = category;
        document.getElementById('productCategory').value = category;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productBadge').value = product.badge || '';
        
        // Scroll to form
        document.querySelector('.admin-section').scrollIntoView({ behavior: 'smooth' });
    }

    renderProducts();
    renderProductsList();
}

function deleteProduct(category, id) {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
        const products = getProducts();
        products[category] = products[category].filter(p => p.id !== id);
        saveProducts(products);
        renderProducts();
        renderProductsList();
        alert('Producto eliminado');
    }

    renderProducts();
    renderProductsList();
    renderCategoriesList();
}

function cancelEdit() {
    document.getElementById('editProductId').value = '';
    document.getElementById('editProductCategory').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productBadge').value = '';
}

// ====================================
// CAMBIAR CONTRASEÑA
// ====================================

async function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('Por favor completá ambos campos');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    const salt = generateSalt();
    const hash = await hashPassword(newPassword, salt);
    
    localStorage.setItem('adminPasswordHash', hash);
    localStorage.setItem('adminSalt', salt);
    
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    alert('Contraseña cambiada exitosamente');
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const isClickInside = nav && toggle && (nav.contains(event.target) || toggle.contains(event.target));
    
    if (nav && !isClickInside && nav.classList.contains('active')) {
        closeMobileMenu();
    }
});