// ========================================
// HASH DE CONTRASEÑA (SHA-256)
// ========================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
// ========================================
// INICIALIZACIÓN DE CONTRASEÑA
// ========================================
function initializePassword() {
    // Contraseña por defecto: "admin123" (hasheada)
    if (!localStorage.getItem('adminPasswordHash')) {
        hashPassword('admin123').then(hash => {
            localStorage.setItem('adminPasswordHash', hash);
        });
    }
}

// =========================================
//  CARGA DE DATOS DESDE NETLIFY + TURSO
// =========================================

let servicesData = [];
let pricesData = [];
// URL de tu función de Netlify
const API_URL = "../reparacionSql/netlify/functions/prices";

// Cargar datos desde tus funciones serverless
async function loadData() {
  try {
    const servicesRes = await fetch("../reparacionSql/netlify/functions/services");
    servicesData = await servicesRes.json();

    const pricesRes = await fetch("../reparacionSql/netlify/functions/prices");
    pricesData = await pricesRes.json();

    renderServices();
    renderPrices();
  } catch (err) {
    console.error("Error cargando datos:", err);
  }
}

// =========================================
//  RENDERIZADO – MOSTRAR EN EL HTML
// =========================================

function renderServices() {
  const container = document.getElementById("servicesGrid");
  if (!container) return;

  container.innerHTML = servicesData
    .map(
      (s) => `
      <div class="service-card">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <p class="price">$${s.price}</p>
      </div>
    `
    )
    .join("");
}


// =========================================
//  PANEL ADMIN – EDITAR SERVICIOS
// =========================================

async function addService(title, description, price) {
  await fetch("/.netlify/functions/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, price }),
  });

  await loadData();
}

async function updateService(id, title, description, price) {
  await fetch("/.netlify/functions/services", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, description, price }),
  });

  await loadData();
}

async function deleteService(id) {
  await fetch(`/.netlify/functions/services?id=${id}`, {
    method: "DELETE",
  });

  await loadData();
}

// =========================================
//  PANEL ADMIN – EDITAR PRECIOS
// =========================================
async function loadPrices() {
  const tableBody = document.getElementById("pricesTableBody");
  tableBody.innerHTML = "<tr><td colspan='4'>Cargando...</td></tr>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>
          <button onclick="editPrice(${item.id}, '${item.name}', ${item.price})">Editar</button>
          <button onclick="deletePrice(${item.id})">Eliminar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    tableBody.innerHTML = "<tr><td colspan='4'>Error al cargar datos</td></tr>";
  }
}

function editPrice(id, name, price) {
  document.getElementById("priceId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;

  document.getElementById("submitBtn").innerText = "Guardar cambios";
}

async function deletePrice(id) {
  if (!confirm("¿Eliminar este precio?")) return;

  await fetch(`${API_URL}?id=${id}`, {
    method: "DELETE",
  });

  loadPrices();
}

async function handleSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("priceId").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  const payload = { name, price };

  let method = "POST";
  if (id) {
    method = "PUT";
    payload.id = id;
  }

  await fetch(API_URL, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  document.getElementById("priceForm").reset();
  document.getElementById("submitBtn").innerText = "Agregar precio";
  document.getElementById("priceId").value = "";

  loadPrices();
}




// ========================================
// ADMIN - ABRIR/CERRAR LOGIN
// ========================================
function openAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'flex';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').focus();
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}




// ========================================
// ADMIN - LOGIN
// ========================================
async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (!password) {
        showToast('⚠ Por favor ingresá la contraseña');
        return;
    }
    
    const hashedInput = await hashPassword(password);
    const storedHash = localStorage.getItem('adminPasswordHash');
    
    if (hashedInput === storedHash) {
        closeAdminLogin();
        openAdminPanel();
        showToast('✓ Acceso concedido');
    } else {
        showToast('⚠ Contraseña incorrecta');
        document.getElementById('adminPassword').value = '';
    }
}

// ========================================
// ADMIN - ABRIR/CERRAR PANEL
// ========================================
function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminServices();
    renderAdminPrices();
}

function closeAdminPanel() {
    // Preguntar si hay cambios sin enviar
    if (editedFiles.services || editedFiles.prices) {
        if (confirm('Hay cambios sin enviar. ¿Querés cerrar sin enviar?')) {
            editedFiles.services = false;
            editedFiles.prices = false;
        } else {
            return; // No cerrar
        }
    }
    
    document.getElementById('adminPanel').style.display = 'none';
    cancelEditService();
    cancelEditPrice();
}

// ========================================
// ADMIN - CAMBIAR CONTRASEÑA
// ========================================
async function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        showToast('⚠ Por favor completá ambos campos');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('⚠ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('⚠ Las contraseñas no coinciden');
        return;
    }
    
    const hashedPassword = await hashPassword(newPassword);
    localStorage.setItem('adminPasswordHash', hashedPassword);
    
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showToast('✓ Contraseña cambiada exitosamente');
}

// ========================================
// SISTEMA DE TEMAS
// ========================================
const themes = ['blue', 'green', 'orange', 'purple'];
let currentThemeIndex = 0;

const themeSwitcher = document.getElementById('themeSwitcher');
const body = document.body;

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'blue';
currentThemeIndex = themes.indexOf(savedTheme);
body.setAttribute('data-theme', savedTheme);

// Cambiar tema con animación
themeSwitcher.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    body.setAttribute('data-theme', newTheme);
    
    localStorage.setItem('theme', newTheme);
    
    const themeNames = {
        'blue': 'Azul Técnico',
        'green': 'Verde Tech',
        'orange': 'Naranja Energético',
        'purple': 'Púrpura Profesional'
    };
    showToast(`Tema cambiado a: ${themeNames[newTheme]}`);
});

// ========================================
// MENÚ MÓVIL
// ========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ========================================
// HEADER STICKY
// ========================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// FAQ ACCORDION
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        item.classList.toggle('active');
    });
});

// ========================================
// TESTIMONIOS SLIDER
// ========================================
const sliderDots = document.getElementById('sliderDots');
const testimonialCards = document.querySelectorAll('.testimonial-card');

if (window.innerWidth <= 768) {
    testimonialCards.forEach((card, index) => {
        const dot = document.createElement('span');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        sliderDots.appendChild(dot);
    });
}

// ========================================
// MOSTRAR/OCULTAR INPUTS "OTRO"
// ========================================

// Formulario Rápido - Dispositivo "Otro"
const dispositivoSelect = document.getElementById('dispositivoSelect');
const dispositivoOtro = document.getElementById('dispositivoOtro');

if (dispositivoSelect && dispositivoOtro) {
    dispositivoSelect.addEventListener('change', function() {
        if (this.value === 'Otro') {
            dispositivoOtro.style.display = 'block';
            dispositivoOtro.required = true;
            dispositivoOtro.style.animation = 'slideIn 0.3s ease';
        } else {
            dispositivoOtro.style.display = 'none';
            dispositivoOtro.required = false;
            dispositivoOtro.value = '';
        }
    });
}

// Formulario Rápido - Marca "Otra"
const marcaSelect = document.getElementById('marcaSelect');
const marcaOtra = document.getElementById('marcaOtra');

if (marcaSelect && marcaOtra) {
    marcaSelect.addEventListener('change', function() {
        if (this.value === 'Otra') {
            marcaOtra.style.display = 'block';
            marcaOtra.required = true;
            marcaOtra.style.animation = 'slideIn 0.3s ease';
        } else {
            marcaOtra.style.display = 'none';
            marcaOtra.required = false;
            marcaOtra.value = '';
        }
    });
}

// Formulario de Contacto - Dispositivo "Otro"
const dispositivoContactSelect = document.getElementById('dispositivoContactSelect');
const dispositivoContactOtro = document.getElementById('dispositivoContactOtro');

if (dispositivoContactSelect && dispositivoContactOtro) {
    dispositivoContactSelect.addEventListener('change', function() {
        if (this.value === 'Otro') {
            dispositivoContactOtro.style.display = 'block';
            dispositivoContactOtro.required = true;
            dispositivoContactOtro.style.animation = 'slideIn 0.3s ease';
        } else {
            dispositivoContactOtro.style.display = 'none';
            dispositivoContactOtro.required = false;
            dispositivoContactOtro.value = '';
        }
    });
}

// Formulario de Contacto - Marca "Otra"
const marcaContactSelect = document.getElementById('marcaContactSelect');
const marcaContactOtra = document.getElementById('marcaContactOtra');

if (marcaContactSelect && marcaContactOtra) {
    marcaContactSelect.addEventListener('change', function() {
        if (this.value === 'Otra') {
            marcaContactOtra.style.display = 'block';
            marcaContactOtra.required = true;
            marcaContactOtra.style.animation = 'slideIn 0.3s ease';
        } else {
            marcaContactOtra.style.display = 'none';
            marcaContactOtra.required = false;
            marcaContactOtra.value = '';
        }
    });
}

// ========================================
// ENVÍO DE FORMULARIOS CON EMAILJS
// ========================================

const EMAILJS_CONFIG = {
    publicKey: 'YzQVxS-7kuYTarZ40',
    serviceId: 'service_wd0cm2m',
    templateIdQuick: 'template_fmk3hji',
    templateIdContact: 'template_x2jhkxg'
};

// Cargar EmailJS library
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = function() {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    };
    document.head.appendChild(script);
})();

// FORMULARIO RÁPIDO
const quickForm = document.getElementById('quickForm');
if (quickForm) {
    quickForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = quickForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'ENVIANDO...';
        submitBtn.disabled = true;
        
        const formData = new FormData(quickForm);
        
        let dispositivo = formData.get('dispositivo');
        if (dispositivo === 'Otro' && formData.get('dispositivoOtro')) {
            dispositivo = formData.get('dispositivoOtro');
        }
        
        let marca = formData.get('marca');
        if (marca === 'Otra' && formData.get('marcaOtra')) {
            marca = formData.get('marcaOtra');
        }
        
        const templateParams = {
            dispositivo: dispositivo,
            marca: marca,
            problema: formData.get('problema'),
            email: formData.get('email')
        };
        
        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateIdQuick,
                templateParams
            );
            
            showToast('✓ Presupuesto solicitado! Te contactaremos pronto.');
            quickForm.reset();
            if (dispositivoOtro) dispositivoOtro.style.display = 'none';
            if (marcaOtra) marcaOtra.style.display = 'none';
            
        } catch (error) {
            console.error('Error al enviar:', error);
            showToast('⚠ Error al enviar. Por favor llamanos o escribinos por WhatsApp.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// FORMULARIO DE CONTACTO COMPLETO
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'ENVIANDO...';
        submitBtn.disabled = true;
        
        const formData = new FormData(contactForm);
        
        let dispositivo = formData.get('dispositivo');
        if (dispositivo === 'Otro' && formData.get('dispositivoContactOtro')) {
            dispositivo = formData.get('dispositivoContactOtro');
        }
        
        let marca = formData.get('marca');
        if (marca === 'Otra' && formData.get('marcaContactOtra')) {
            marca = formData.get('marcaContactOtra');
        }
        
        const templateParams = {
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            dispositivo: dispositivo,
            marca: marca,
            problema: formData.get('problema'),
            llamar: formData.get('llamar') ? 'Sí, prefiere que lo llamen' : 'No'
        };
        
        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateIdContact,
                templateParams
            );
            
            showToast('✓ Mensaje enviado! Te responderemos en menos de 2 horas.');
            contactForm.reset();
            if (dispositivoContactOtro) dispositivoContactOtro.style.display = 'none';
            if (marcaContactOtra) marcaContactOtra.style.display = 'none';
            
        } catch (error) {
            console.error('Error al enviar:', error);
            showToast('⚠ Error al enviar. Por favor llamanos o escribinos por WhatsApp.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// SISTEMA DE NOTIFICACIONES TOAST
// ========================================
function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// ANIMACIONES AL SCROLL
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.service-card, .why-item, .testimonial-card, .timeline-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// CONTADOR DE VISITAS
// ========================================
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount++;
localStorage.setItem('visitCount', visitCount);

// ========================================
// PREVENIR MÚLTIPLES ENVÍOS
// ========================================
let formSubmitting = false;

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (formSubmitting) {
            e.preventDefault();
            return false;
        }
    });
});

// ========================================
// LOG DE DEBUG
// ========================================
console.log('%c🔧 TechRepair.Pro - Sistema Cargado', 'color: #2563EB; font-size: 16px; font-weight: bold;');
console.log('Tema actual:', body.getAttribute('data-theme'));
console.log('Visitas:', visitCount);
// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
initializePassword();
loadData(); // Cargar datos desde JSON
 loadPrices();

  const form = document.getElementById("priceForm");
  form.addEventListener("submit", handleSubmit);
});