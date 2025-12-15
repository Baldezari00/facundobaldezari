// ===================================
// Global Variables
// ===================================
const selectedService = null
const selectedExtras = []

// ===================================
// DOM Elements
// ===================================
const pageLoader = document.getElementById("pageLoader")
const loaderBar = document.getElementById("loaderBar")
const loaderPercentage = document.getElementById("loaderPercentage")
const customCursor = document.getElementById("customCursor")
const cursorDot = document.querySelector(".cursor-dot")
const cursorOutline = document.querySelector(".cursor-outline")
const header = document.getElementById("header")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")
const contactForm = document.getElementById("contactForm")

// ===================================
// Page Loader
// ===================================
function initPageLoader() {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      setTimeout(() => {
        pageLoader.classList.add("hidden")
        document.body.style.overflow = "visible"
        initAnimations()
      }, 300)
    }
    loaderBar.style.width = progress + "%"
    loaderPercentage.textContent = Math.floor(progress) + "%"
  }, 100)
}


// ===================================
// Magnetic Button Effect
// ===================================
function initMagneticButtons() {
  if (window.innerWidth <= 768) return

  const magneticBtns = document.querySelectorAll(".magnetic-btn")

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)"
    })
  })
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
  hamburger.addEventListener("click", function () {
    this.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-container")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  })
}

// ===================================
// Header Scroll Effect
// ===================================
function initHeaderScroll() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#") return

      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// ===================================
// Intersection Observer for Animations
// ===================================
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animated class with delay
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => {
          entry.target.classList.add("animated")
        }, delay)

        // Animate text reveal for section titles
        if (entry.target.classList.contains("section-title")) {
          animateTextReveal(entry.target)
        }

        // Unobserve after animation
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all elements with data-animate attribute
  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el)
  })
}

// ===================================
// Text Reveal Animation for Section Titles
// ===================================
function animateTextReveal(element) {
  const chars = element.querySelectorAll(".char")
  chars.forEach((char, index) => {
    char.style.animationDelay = `${index * 0.03}s`
  })
}

// ===================================
// Service Cards Toggle
// ===================================
function initServiceCards() {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't toggle if clicking on button
      if (e.target.classList.contains("service-btn") || e.target.closest(".service-btn")) {
        return
      }

      const wasActive = this.classList.contains("active")

      // Close all cards
      document.querySelectorAll(".service-card").forEach((c) => {
        c.classList.remove("active")
      })

      // Open clicked card if it wasn't active
      if (!wasActive) {
        this.classList.add("active")
      }
    })
  })
}

// ===================================
// Select Service (WhatsApp)
// ===================================
function selectService(serviceName, servicePrice) {
  const message =
    servicePrice === 0
      ? `Hola! Me interesa el servicio de ${serviceName}. ¿Podemos coordinar una reunión para discutir los detalles?`
      : `Hola! Me interesa el servicio de ${serviceName}. El presupuesto estimado es ${servicePrice}. ¿Podemos coordinar?`

  const whatsappUrl = `https://wa.me/5492235254889?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question")

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentElement
      const wasActive = faqItem.classList.contains("active")

      // Close all items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Open clicked item if it wasn't active
      if (!wasActive) {
        faqItem.classList.add("active")
      }
    })
  })
}

// ===================================
// Form Validation & Submission
// ===================================
function initContactForm() {
  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const message = document.getElementById("message").value.trim()

    if (!name || !email || !message) {
      alert("Por favor completá los campos obligatorios")
      return false
    }

    if (!isValidEmail(email)) {
      alert("Por favor ingresá un email válido")
      return false
    }

    // Create WhatsApp message
    const whatsappMessage = `Hola! Me contacto desde el formulario de tu web.
        
Nombre: ${name}
Email: ${email}
${phone ? `Teléfono: ${phone}` : ""}

Mensaje: ${message}`

    const whatsappUrl = `https://wa.me/5492235254889?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")

    // Reset form
    contactForm.reset()
  })
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// ===================================
// Parallax Effect for Hero Shapes
// ===================================
function initParallax() {
  if (window.innerWidth <= 768) return

  const shapes = document.querySelectorAll(".shape")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.2
      const yPos = -(scrolled * speed)
      shape.style.transform = `translateY(${yPos}px)`
    })
  })
}

// ===================================
// Init All Animations
// ===================================
function initAnimations() {
  // Trigger initial animations for hero
  const heroElements = document.querySelectorAll(".hero [data-animate]")
  heroElements.forEach((el) => {
    const delay = el.dataset.delay || 0
    setTimeout(() => {
      el.classList.add("animated")
    }, delay)
  })
}

/* ===================================
   Theme Switcher Functionality
   =================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('themeBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  const html = document.documentElement;

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateActiveTheme(savedTheme);

  // Toggle dropdown
  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('active');
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!themeDropdown.contains(e.target) && e.target !== themeBtn) {
      themeDropdown.classList.remove('active');
    }
  });

  // Cambiar tema
  themeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateActiveTheme(theme);
      themeDropdown.classList.remove('active');

      // Animación del botón
      themeBtn.style.transform = 'scale(0.8) rotate(360deg)';
      setTimeout(() => {
        themeBtn.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    });
  });

  function updateActiveTheme(theme) {
    themeOptions.forEach((option) => {
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
}


// ===================================
// Initialize Everything
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  // Start page loader
  initPageLoader()

  // Init after a small delay to ensure DOM is ready
  setTimeout(() => {
    initMagneticButtons()
    initNavigation()
    initHeaderScroll()
    initSmoothScroll()
    initScrollReveal()
    initServiceCards()
    initFAQ()
    initContactForm()
    initParallax()
    initThemeSwitcher();

  }, 100)
})

// ===================================
// Resize Handler
// ===================================
let resizeTimer
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    // Reinit certain features on resize
    initMagneticButtons()
  }, 250)
})

// ===================================
// Performance: Reduce animations on low-end devices
// ===================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.style.setProperty("--duration-slow", "0.6s")
}
