// Floating cats animation
const catsContainer = document.getElementById('catsContainer');
const catImages = ['akukiku_cat2', 'Bumba_dog1', 'Cebi_cat1', 'koboy_dog2', 'landi_dog3', 'lyra_cat3'];
const numCats = 12; // Number of floating cats

function createFloatingCat() {
    const cat = document.createElement('img');
    const randomCat = catImages[Math.floor(Math.random() * catImages.length)];
    cat.src = `assets/cats/${randomCat}.png`;
    cat.classList.add('floating-cat');
    
    // Random size between 60px and 120px
    const size = Math.random() * 60 + 60;
    cat.style.width = `${size}px`;
    cat.style.height = 'auto';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    cat.style.left = `${startX}px`;
    cat.style.top = `${startY}px`;
    
    // Random animation duration between 20-40 seconds
    const duration = Math.random() * 20 + 20;
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 300;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;
    
    catsContainer.appendChild(cat);
    
    // Animate the cat
    animateCat(cat, startX, startY, endX, endY, duration);
}

function animateCat(cat, startX, startY, endX, endY, duration) {
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % (duration * 1000)) / (duration * 1000);
        
        // Smooth easing function
        const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
        const easedProgress = easeInOutSine(progress);
        
        // Calculate position with a gentle floating motion
        const x = startX + (endX - startX) * easedProgress;
        const y = startY + (endY - startY) * easedProgress + Math.sin(progress * Math.PI * 4) * 20;
        
        cat.style.left = `${x}px`;
        cat.style.top = `${y}px`;
        
        // Gentle rotation
        cat.style.transform = `rotate(${Math.sin(progress * Math.PI * 2) * 10}deg)`;
        
        // Reset when animation completes
        if (progress >= 0.99) {
            // Generate new random end position
            const newAngle = Math.random() * Math.PI * 2;
            const newDistance = 200 + Math.random() * 300;
            const newEndX = x + Math.cos(newAngle) * newDistance;
            const newEndY = y + Math.sin(newAngle) * newDistance;
            
            // Wrap around screen edges
            const wrappedEndX = ((newEndX % window.innerWidth) + window.innerWidth) % window.innerWidth;
            const wrappedEndY = ((newEndY % window.innerHeight) + window.innerHeight) % window.innerHeight;
            
            animateCat(cat, x, y, wrappedEndX, wrappedEndY, duration);
        } else {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Initialize cats
for (let i = 0; i < numCats; i++) {
    setTimeout(() => createFloatingCat(), i * 200);
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
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

// Observe elements for animations
const animateOnScroll = document.querySelectorAll('.timeline-item, .project-card, .stat-card, .contact-card');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add stagger delay to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger delay to project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Interactive cat on click (Easter egg)
let catClickCount = 0;
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('floating-cat')) {
        catClickCount++;
        
        // Make the clicked cat briefly more visible and slightly bigger
        e.target.style.opacity = '0.8';
        e.target.style.transform = 'scale(1.2) rotate(15deg)';
        
        setTimeout(() => {
            e.target.style.opacity = '0.15';
            e.target.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        // Easter egg: if user clicks 5 cats, spawn more!
        if (catClickCount === 5) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createFloatingCat(), i * 100);
            }
            catClickCount = 0; // Reset counter
        }
    }
});

// Parallax effect on hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});

// Mobile menu handling (for future enhancement)
// Currently using simple horizontal nav, but keeping this for scalability
const handleResize = () => {
    if (window.innerWidth <= 640) {
        // Could add hamburger menu logic here if needed
        console.log('Mobile view active');
    }
};

window.addEventListener('resize', handleResize);
handleResize(); // Initial check

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero section on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Typing effect for hero title (subtle enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';
    
    let charIndex = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (charIndex < text.length) {
            heroTitle.innerHTML += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Uncomment below to enable typing effect
    // setTimeout(typeWriter, 500);
    
    // For now, just show it all at once
    heroTitle.innerHTML = text;
}

// Console Easter egg
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cLooking for something interesting? Try clicking on the floating cats! 🐱', 'font-size: 14px; color: #64748b;');
console.log('%cBuilt with ❤️ and curiosity by Gerald', 'font-size: 12px; font-style: italic; color: #8b5cf6;');