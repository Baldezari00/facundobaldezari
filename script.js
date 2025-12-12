
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
    initHeaderScroll();
    initProjectsToggle();
    initThemeSelector();
    loadTheme();
});

// ===================================
// Render Services
// ===================================
function renderServices() {
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
    } else {
        selectedService = null;
    }
}

// ===================================
// Select Service
// ===================================
function selectService(serviceName,servicePrice) {

    
    const message = servicePrice === 0 
        ? `Hola! Me interesa el servicio de ${serviceName}. ¿Podemos coordinar una reunión para discutir los detalles?`
        : `Hola! Me interesa el servicio de ${serviceName}. El presupuesto estimado es ${servicePrice}. ¿Podemos coordinar?`;
    
    const whatsappUrl = `https://wa.me/5492235254889?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    const themeBtn = document.querySelector('.theme-btn');
    const themeOptionsEl = document.getElementById('themeOptions');
    
    // Toggle menu con click
    themeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        themeOptionsEl.classList.toggle('active');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.theme-selector')) {
            themeOptionsEl.classList.remove('active');
        }
    });
    
    // Seleccionar tema
    themeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const theme = this.dataset.theme;
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Cerrar el menú después de seleccionar
            themeOptionsEl.classList.remove('active');
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