// ===== Initialize AOS (Animate On Scroll) =====
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===== Typewriter Effect =====
const typewriterText = "Mechanical Engineer | Robotics Innovator | CAD Specialist";
const typewriterElement = document.getElementById('typewriter-text');
let i = 0;

function typeWriter() {
    if (i < typewriterText.length) {
        typewriterElement.innerHTML += typewriterText.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    } else {
        // Add blinking cursor
        typewriterElement.innerHTML += '<span class="cursor"></span>';
    }
}

// Start typewriter after page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Add cursor style dynamically
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor {
        display: inline-block;
        width: 2px;
        height: 1.5rem;
        background: var(--accent-color);
        margin-left: 5px;
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(cursorStyle);

// ===== Dark/Light Mode Toggle =====
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 23, 0.98)';
        backToTop.classList.add('visible');
    } else {
        navbar.style.background = 'rgba(10, 14, 23, 0.95)';
        backToTop.classList.remove('visible');
    }
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Back to Top Button =====
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Skills Animation on Scroll =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Show loading state
    formStatus.textContent = 'Sending...';
    formStatus.className = '';

    try {
        // In a real application, you would send this to a backend service
        // For now, we'll simulate a successful submission
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'success';
        
        // Reset form
        contactForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = '';
        }, 5000);
        
        // Log the form data (in case you want to set up email later)
        console.log('Form Submission:', formData);
        
    } catch (error) {
        formStatus.textContent = 'Sorry, there was an error sending your message. Please try again.';
        formStatus.className = 'error';
    }
});

// ===== Image Lazy Loading & Error Handling =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', () => {
            // If image fails to load, show placeholder
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTIxYTI1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OTJiMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
        });
    });
});

// ===== Scroll Indicator Hide on Scroll Down =====
let lastScrollTop = 0;
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
    
    lastScrollTop = scrollTop;
});

// ===== Dynamic Year in Footer =====
const currentYear = new Date().getFullYear();
document.querySelector('.footer p').innerHTML = `&copy; ${currentYear} Kalpak Gajanan Korde. All rights reserved.`;

console.log('Portfolio Website Loaded Successfully! 🚀');