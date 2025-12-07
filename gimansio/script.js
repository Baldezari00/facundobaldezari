// EmailJS Configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'YzQVxS-7kuYTarZ40';
const EMAILJS_SERVICE_ID = 'service_wd0cm2m';
const EMAILJS_TEMPLATE_ID = 'template_fmk3hji';

// Initialize EmailJS (only if credentials are provided)
if (EMAILJS_PUBLIC_KEY !== 'YzQVxS-7kuYTarZ40') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for Stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// Transformations Slider - FIXED
let currentSlide = 0;
const sliderContainer = document.getElementById('sliderContainer');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDotsContainer = document.getElementById('sliderDots');
const slides = document.querySelectorAll('.transformation-item');
const totalSlides = slides.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.slider-dot');

function updateSlider() {
    const offset = -currentSlide * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

sliderNext.addEventListener('click', nextSlide);
sliderPrev.addEventListener('click', prevSlide);

// Auto-play slider
let autoplayInterval = setInterval(nextSlide, 5000);

// Pause autoplay on hover
const sliderWrapper = document.querySelector('.transformaciones-slider');
sliderWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

sliderWrapper.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 5000);
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Contact Form with EmailJS
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading message
    formMessage.textContent = 'Enviando...';
    formMessage.className = 'form-message';
    formMessage.style.display = 'block';
    formMessage.style.background = '#3b82f6';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        objetivo: document.getElementById('objetivo').value,
        experiencia: document.getElementById('experiencia').value,
        acepto: document.getElementById('acepto').checked ? 'Sí ✅, acepta recibir información de promos' : 'No'
    };
    
    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YzQVxS-7kuYTarZ40') {
        // EmailJS not configured - show success anyway (for demo)
        setTimeout(() => {
            formMessage.textContent = '¡Mensaje recibido! (Demo mode - configurá EmailJS para envío real)';
            formMessage.className = 'form-message success';
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1000);
        return;
    }
    
    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
        .then(() => {
            formMessage.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
            formMessage.className = 'form-message success';
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            formMessage.textContent = 'Error al enviar el mensaje. Por favor, intentá nuevamente o contactanos por WhatsApp.';
            formMessage.className = 'form-message error';
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 7000);
        });
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme Switcher
const themes = ['neon-tech', 'red-black', 'orange-energy', 'yellow-power'];
let currentTheme = 0;
const themeSwitcher = document.getElementById('themeSwitcher');

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('gymTheme');
if (savedTheme) {
    const themeIndex = themes.indexOf(savedTheme);
    if (themeIndex !== -1) {
        currentTheme = themeIndex;
        if (savedTheme !== 'neon-tech') {
            document.body.setAttribute('data-theme', savedTheme);
        }
    }
}

themeSwitcher.addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % themes.length;
    const newTheme = themes[currentTheme];
    
    if (newTheme === 'neon-tech') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('gymTheme', 'neon-tech');
    } else {
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('gymTheme', newTheme);
    }
});

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.clase-card, .plan-card, .beneficio-item, .instalacion-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('🏋️ Power Gym Website Loaded Successfully!');