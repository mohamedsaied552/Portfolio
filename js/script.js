'use strict';

// DOM Elements
const body = document.querySelector('body');
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const themeToggle = document.getElementById('theme-toggle');
const skillsSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.progress');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
const toggleNav = () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('nav-active');
    
    // Prevent scrolling when menu is open
    document.body.classList.toggle('no-scroll');
};

// Theme Toggle
const toggleTheme = () => {
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
};

// Check user theme preference
const checkTheme = () => {
    const userTheme = localStorage.getItem('theme');
    
    if (userTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Check system preference if no localStorage preference
    if (!userTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-mode');
        }
    }
};

// Handle scroll animations
const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    // Add shadow to header on scroll
    if (scrollPos > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Animate skill bars when scrolled into view
    if (isInViewport(skillsSection)) {
        setTimeout(() => {
            animateSkills();
        }, 200);
    }
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
};

// Animate skill progress bars
const animateSkills = () => {
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = "0";
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Smooth scrolling for anchor links
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile nav if open
            if (navLinks.classList.contains('active')) {
                toggleNav();
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Form submission handling
const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);
    
    // Simulate form submission (in a real project, send to a server)
    console.log('Form submitted with data:', formObject);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.classList.add('form-success');
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
    
    contactForm.innerHTML = '';
    contactForm.appendChild(successMessage);
};

// Resize handling for window changes
const handleResize = () => {
    // Reset mobile nav on larger screens
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('nav-active');
        document.body.classList.remove('no-scroll');
    }
};

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    checkTheme();
    
    // Setup scrolling
    initSmoothScrolling();
    
    // Add event listeners
    burger.addEventListener('click', toggleNav);
    themeToggle.addEventListener('click', toggleTheme);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initial scroll position check
    handleScroll();
    
    // Add CSS class when page is fully loaded
    document.body.classList.add('page-loaded');
});

// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}); 