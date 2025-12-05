// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize all features
    initNavigation();
    initThemeToggle();
    initScrollEffects();
    initCounters();
    initPortfolioFilters();
    initTestimonials();
    initContactForm();
    initScrollToTop();
});

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===================================
// THEME TOGGLE
// ===================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===================================
// SCROLL EFFECTS
// ===================================
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');

        if (heroContent && heroVisual) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

// ===================================
// ANIMATED COUNTERS
// ===================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;

        const heroSection = document.querySelector('.hero');
        const heroRect = heroSection.getBoundingClientRect();

        if (heroRect.top < window.innerHeight && heroRect.bottom >= 0) {
            hasAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load
}

// ===================================
// PORTFOLIO FILTERS
// ===================================
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// TESTIMONIALS SLIDER
// ===================================
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.getElementById('testimonial-dots');

    let currentIndex = 0;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function updateSlider() {
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        updateSlider();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-play testimonials
    setInterval(nextSlide, 5000);
}

// ===================================
// CONTACT FORM
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Simulate form submission
        console.log('Form submitted:', data);

        // Show success message
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');

        // Reset form after 3 seconds
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.classList.remove('show');
        }, 3000);

        // In a real application, you would send the data to a server here
        // Example:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        //     // Show success message
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     // Show error message
        // });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
}

// ===================================
// SCROLL TO TOP
// ===================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Optimize scroll events
const optimizedScroll = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Lazy load images (if you add real images later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Call lazy load if needed
// lazyLoadImages();

// ===================================
// ADDITIONAL ANIMATIONS
// ===================================

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');

    const rippleElement = button.getElementsByClassName('ripple')[0];
    if (rippleElement) {
        rippleElement.remove();
    }

    button.appendChild(ripple);
}

// Apply ripple effect to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 CHOLOK INTELLIGENT SYSTEM', 'color: #00A859; font-size: 24px; font-weight: bold;');
console.log('%cWhere Innovation Meets Intelligence', 'color: #6A0DAD; font-size: 16px;');
console.log('%cWebsite developed with ❤️ using HTML, CSS, and JavaScript', 'color: #666; font-size: 12px;');
