// ===================================
// Service Data
// ===================================
const servicesData = [
    {
        id: 1,
        type: 'Landing Page Simple',
        price: '$30.000 - $50.000',
        priceMin: 30000,
        priceMax: 50000,
        description: 'Página de 1 sección perfecta para captar leads',
        includes: [
            '1 página',
            'Diseño responsive',
            'Formulario de contacto',
            'Hosting primer año incluido'
        ],
        time: '3-5 días',
        ideal: 'Freelancers, profesionales independientes',
        badge: 'Popular'
    },
    {
        id: 2,
        type: 'Sitio Corporativo',
        price: '$60.000 - $100.000',
        priceMin: 60000,
        priceMax: 100000,
        description: 'Sitio profesional para empresas y estudios',
        includes: [
            '5-7 secciones',
            'Diseño a medida',
            'SEO básico',
            'Formularios de contacto',
            'Hosting primer año incluido'
        ],
        time: '7-10 días',
        ideal: 'Contadores, abogados, consultorías',
        badge: 'Profesional'
    },
    {
        id: 3,
        type: 'Rotisería / Gastronomía',
        price: '$50.000 - $80.000',
        priceMin: 50000,
        priceMax: 80000,
        description: 'Página con menú dinámico y sistema de pedidos',
        includes: [
            'Menú editable',
            'Panel admin',
            'WhatsApp integrado',
            'Categorías de productos',
            'Hosting primer año incluido'
        ],
        time: '7-10 días',
        ideal: 'Rotiserías, restaurantes, delivery'
    },
    {
        id: 4,
        type: 'Tienda Online / E-commerce',
        price: '$120.000 - $200.000',
        priceMin: 120000,
        priceMax: 200000,
        description: 'Tienda completa con carrito y pagos online',
        includes: [
            'Catálogo de productos',
            'Carrito de compras',
            'Integración MercadoPago',
            'Panel admin completo',
            'Gestión de pedidos',
            'Hosting primer año incluido'
        ],
        time: '15-20 días',
        ideal: 'Tiendas, comercios, emprendimientos',
        badge: 'Avanzado'
    },
    {
        id: 5,
        type: 'Página para Psicólogos/Terapeutas',
        price: '$50.000 - $75.000',
        priceMin: 50000,
        priceMax: 75000,
        description: 'Sitio profesional con sistema de turnos',
        includes: [
            'Perfil profesional',
            'Especialidades',
            'Formulario de consultas',
            'Calendario de disponibilidad',
            'Hosting primer año incluido'
        ],
        time: '7-10 días',
        ideal: 'Psicólogos, nutricionistas, médicos'
    },
    {
        id: 6,
        type: 'Taller de Reparación',
        price: '$45.000 - $70.000',
        priceMin: 45000,
        priceMax: 70000,
        description: 'Web con presupuestador y lista de servicios',
        includes: [
            'Lista de servicios',
            'Precios',
            'Formulario de presupuesto',
            'Zona de cobertura',
            'Hosting primer año incluido'
        ],
        time: '5-7 días',
        ideal: 'Service técnico, reparaciones'
    },
    {
        id: 7,
        type: 'Gimnasio / Fitness',
        price: '$80.000 - $120.000',
        priceMin: 80000,
        priceMax: 120000,
        description: 'Sitio dinámico con grilla de clases y planes',
        includes: [
            'Horarios de clases',
            'Planes y precios',
            'Galería de fotos',
            'Formulario de inscripción',
            'Integración redes sociales',
            'Hosting primer año incluido'
        ],
        time: '10-14 días',
        ideal: 'Gimnasios, boxes, estudios deportivos'
    },
    {
        id: 8,
        type: 'Página Personalizada',
        price: 'A consultar',
        priceMin: 0,
        priceMax: 0,
        description: 'Proyecto a medida según tus necesidades',
        includes: [
            'Análisis de requerimientos',
            'Diseño 100% personalizado',
            'Funcionalidades específicas',
            'Todo lo que necesites'
        ],
        time: 'A definir',
        ideal: 'Cualquier proyecto especial',
        badge: 'Personalizado'
    }
];

// ===================================
// Global Variables
// ===================================
let selectedService = null;
let selectedExtras = [];

// ===================================
// DOM Elements
// ===================================
const servicesGrid = document.getElementById('servicesGrid');
const extrasSection = document.getElementById('extrasSection');
const priceTotal = document.getElementById('priceTotal');
const totalPrice = document.getElementById('totalPrice');
const requestQuoteBtn = document.getElementById('requestQuoteBtn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const toggleProjectsBtn = document.getElementById('toggleProjects');
const proyectosSection = document.getElementById('proyectos');
const themeSelector = document.getElementById('themeSelector');
const themeOptions = document.querySelectorAll('.theme-option');

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    initNavigation();
    initSmoothScroll();
    initScrollReveal();
    initFAQ();
    initExtras();
    initHeaderScroll();
    initProjectsToggle();
    initThemeSelector();
    loadTheme();
});

// ===================================
// Render Services
// ===================================
function renderServices() {
    servicesGrid.innerHTML = servicesData.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-header">
                <h3 class="service-type">${service.type}</h3>
                ${service.badge ? `<span class="service-badge">${service.badge}</span>` : ''}
            </div>
            <div class="service-price">${service.price}</div>
            <p class="service-description">${service.description}</p>
            <span>Haz clic para ver más</span>

            
            <div class="service-details">
                <div class="service-includes">
                    <h4>Qué incluye:</h4>
                    <ul>
                        ${service.includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="service-meta">
                    <div class="service-time">
                        <strong>Tiempo estimado:</strong>
                        <span>${service.time}</span>
                    </div>
                    <div class="service-ideal">
                        <strong>Ideal para:</strong>
                        <span>${service.ideal}</span>
                    </div>
                </div>
                
                <button class="service-btn" onclick="selectService(${service.id})">Solicitar este servicio</button>
            </div>
        </div>
    `).join('');
    
    // Add click listeners to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('service-btn')) {
                const serviceId = parseInt(this.dataset.serviceId);
                toggleServiceCard(serviceId);
            }
        });
    });
}

// ===================================
// Toggle Service Card
// ===================================
function toggleServiceCard(serviceId) {
    const card = document.querySelector(`[data-service-id="${serviceId}"]`);
    const wasActive = card.classList.contains('active');
    
    // Close all cards
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('active');
    });
    
    // Open clicked card if it wasn't active
    if (!wasActive) {
        card.classList.add('active');
        selectedService = servicesData.find(s => s.id === serviceId);
        extrasSection.style.display = 'block';
        calculateTotal();
    } else {
        selectedService = null;
        extrasSection.style.display = 'none';
        priceTotal.style.display = 'none';
    }
}

// ===================================
// Select Service
// ===================================
function selectService(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;
    
    const message = service.priceMin === 0 
        ? `Hola! Me interesa el servicio de ${service.type}. ¿Podemos coordinar una reunión para discutir los detalles?`
        : `Hola! Me interesa el servicio de ${service.type}. El presupuesto estimado es ${service.price}. ¿Podemos coordinar?`;
    
    const whatsappUrl = `https://wa.me/5492235254889?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===================================
// Initialize Extras
// ===================================
function initExtras() {
    const extraCheckboxes = document.querySelectorAll('.extra-checkbox input');
    extraCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const price = parseInt(this.dataset.price);
            const name = this.dataset.name;
            
            if (this.checked) {
                selectedExtras.push({ name, price });
            } else {
                selectedExtras = selectedExtras.filter(e => e.name !== name);
            }
            
            calculateTotal();
        });
    });
}

// ===================================
// Calculate Total
// ===================================
function calculateTotal() {
    if (!selectedService) return;
    
    const basePrice = selectedService.priceMax || selectedService.priceMin;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const total = basePrice + extrasPrice;
    
    if (basePrice > 0) {
        totalPrice.textContent = `$${total.toLocaleString('es-AR')}`;
        priceTotal.style.display = 'block';
        
        // Update WhatsApp button
        const extrasText = selectedExtras.length > 0 
            ? ` con ${selectedExtras.map(e => e.name).join(', ')}`
            : '';
        
        requestQuoteBtn.onclick = function() {
            const message = `Hola! Me interesa el servicio de ${selectedService.type}${extrasText}. El presupuesto calculado es $${total.toLocaleString('es-AR')}. ¿Podemos coordinar?`;
            const whatsappUrl = `https://wa.me/5492235254889?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        };
    }
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Header Scroll Effect
// ===================================
function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===================================
// Scroll Reveal
// ===================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const wasActive = faqItem.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!wasActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ===================================
// Projects Toggle
// ===================================
function initProjectsToggle() {
    if (toggleProjectsBtn && proyectosSection) {
        toggleProjectsBtn.addEventListener('click', function() {
            const isVisible = proyectosSection.style.display !== 'none';
            
            if (isVisible) {
                proyectosSection.style.display = 'none';
                toggleProjectsBtn.querySelector('.projects-btn-text').textContent = 'Ver Demos';
            } else {
                proyectosSection.style.display = 'block';
                toggleProjectsBtn.querySelector('.projects-btn-text').textContent = 'Ocultar Demos';
                // Scroll to projects section
                setTimeout(() => {
                    proyectosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    }
}

// ===================================
// Theme Selector
// ===================================
function initThemeSelector() {
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}


function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'purple';
    setTheme(savedTheme);
    
    // Set active state on the saved theme
    const activeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (activeOption) {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        activeOption.classList.add('active');
    }
}

// ===================================
// Form Validation
// ===================================
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!name || !email) {
            e.preventDefault();
            alert('Por favor completá los campos obligatorios (Nombre y Email)');
            return false;
        }
        
        if (!isValidEmail(email)) {
            e.preventDefault();
            alert('Por favor ingresá un email válido');
            return false;
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}