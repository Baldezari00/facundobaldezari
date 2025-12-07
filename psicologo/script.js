// ==========================================================================
// SCRIPT PRINCIPAL - Página Psicólogo/Terapeuta
// ==========================================================================

(function() {
    'use strict';
    
    // ==========================================================================
    // INICIALIZAR EmailJS
    // ==========================================================================
    // IMPORTANTE: Reemplazar 'YOUR_PUBLIC_KEY' con tu clave pública de EmailJS
    // Registrate gratis en https://www.emailjs.com/
    // Paso 1: Crear cuenta
    // Paso 2: Agregar servicio de email (Gmail, Outlook, etc)
    // Paso 3: Crear template de email
    // Paso 4: Copiar tu Public Key y reemplazar abajo
    
    // emailjs.init('YOUR_PUBLIC_KEY'); // <-- DESCOMENTAR Y AGREGAR TU KEY
    
    // ==========================================================================
    // VARIABLES GLOBALES
    // ==========================================================================
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.getElementById('contactoForm');
    const formSuccess = document.getElementById('formSuccess');
    const sliderDots = document.querySelectorAll('.dot');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeBtn = themeSwitcher.querySelector('.theme-btn');
    const themeOptions = document.getElementById('themeOptions');
    const themeOptionButtons = document.querySelectorAll('.theme-option');
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonio-slide');
    let slideInterval;
    
    // ==========================================================================
    // THEME SWITCHER
    // ==========================================================================
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Toggle theme options
    themeBtn.addEventListener('click', function() {
        themeOptions.classList.toggle('active');
    });
    
    // Cerrar theme options al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!themeSwitcher.contains(e.target)) {
            themeOptions.classList.remove('active');
        }
    });
    
    // Cambiar tema
    themeOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeOptions.classList.remove('active');
            
            // Animación suave al cambiar tema
            document.body.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        });
    });
    
    // ==========================================================================
    // HEADER SCROLL EFFECT
    // ==========================================================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ==========================================================================
    // MENÚ HAMBURGUESA (MOBILE)
    // ==========================================================================
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
    
    // Cerrar menú al hacer click en un link
    const navLinks = document.querySelectorAll('.nav-link, .btn-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // ==========================================================================
    // SMOOTH SCROLL PARA LINKS INTERNOS
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Evitar error si el href es solo "#"
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Ajuste por header fixed
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle del item actual
            item.classList.toggle('active');
        });
    });
    
    // ==========================================================================
    // SLIDER DE TESTIMONIOS
    // ==========================================================================
    function showSlide(index) {
        // Remover clase active de todos los slides y dots
        slides.forEach(slide => slide.classList.remove('active'));
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        // Añadir clase active al slide y dot correspondiente
        if (slides[index]) {
            slides[index].classList.add('active');
            sliderDots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Click en dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            resetSlideInterval();
        });
    });
    
    // Auto-play del slider
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Iniciar slider si hay slides
    if (slides.length > 0) {
        showSlide(0);
        startSlideInterval();
    }
    
    // ==========================================================================
    // FORMULARIO DE CONTACTO CON EmailJS
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpiar errores previos
            document.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
            });
            
            // Validación
            let isValid = true;
            
            // Nombre
            const nombre = document.getElementById('nombre');
            if (nombre.value.trim().length < 2) {
                document.getElementById('nombreError').textContent = 'Por favor, ingresá tu nombre completo';
                isValid = false;
            }
            
            // Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                document.getElementById('emailError').textContent = 'Por favor, ingresá un email válido';
                isValid = false;
            }
            
            // Teléfono
            const telefono = document.getElementById('telefono');
            if (telefono.value.trim().length < 8) {
                document.getElementById('telefonoError').textContent = 'Por favor, ingresá un teléfono válido';
                isValid = false;
            }
            
            // Motivo
            const motivo = document.getElementById('motivo');
            if (motivo.value.trim().length < 10) {
                document.getElementById('motivoError').textContent = 'Por favor, contanos un poco más (mínimo 10 caracteres)';
                isValid = false;
            }
            
            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoader = submitBtn.querySelector('.btn-loader');
                
                // Deshabilitar botón y mostrar loader
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline';
                
                // Preparar datos del formulario
                const formData = {
                    nombre: nombre.value,
                    email: email.value,
                    telefono: telefono.value,
                    edad: document.getElementById('edad').value || 'No especificada',
                    motivo: motivo.value,
                    preferencia: document.querySelector('input[name="preferencia"]:checked').value
                };
                
                // OPCIÓN 1: Enviar con EmailJS (RECOMENDADO)
                // Descomentar estas líneas cuando tengas configurado EmailJS:
                /*
                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                    .then(function(response) {
                        console.log('Email enviado exitosamente!', response);
                        mostrarExito();
                    }, function(error) {
                        console.error('Error al enviar email:', error);
                        alert('Hubo un error al enviar el formulario. Por favor, intentá nuevamente o contactanos por WhatsApp.');
                        resetButton();
                    });
                */
                
                // OPCIÓN 2: Simular envío (TEMPORAL - para testing)
                // Comentar o eliminar esto cuando tengas EmailJS configurado:
                setTimeout(function() {
                    console.log('Formulario enviado (simulado):', formData);
                    mostrarExito();
                }, 1500);
            }
        });
        
        function mostrarExito() {
            // Ocultar formulario y mostrar mensaje de éxito
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Reset del formulario
            contactForm.reset();
            
            // Volver a mostrar el formulario después de 5 segundos
            setTimeout(function() {
                formSuccess.classList.remove('show');
                contactForm.style.display = 'block';
                resetButton();
            }, 5000);
        }
        
        function resetButton() {
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }
    
    // ==========================================================================
    // INTERSECTION OBSERVER - ANIMACIONES AL SCROLL
    // ==========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con clase 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // ==========================================================================
    // PREVENIR ZOOM EN MOBILE AL HACER FOCUS EN INPUTS
    // ==========================================================================
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
        }
    }
    
    // ==========================================================================
    // LOG DE INICIO
    // ==========================================================================
    console.log('✅ Script cargado correctamente');
    console.log('📋 FAQ items:', faqItems.length);
    console.log('🎭 Testimonios:', slides.length);
    console.log('📱 Dispositivo móvil:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    console.log('🎨 Tema actual:', document.body.getAttribute('data-theme') || 'default');
    
})();