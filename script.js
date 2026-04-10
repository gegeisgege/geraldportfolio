// ==================== DARK MODE ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// ==================== BLOG CMS SYSTEM ====================
class BlogCMS {
    constructor() {
        this.posts = this.loadPosts();
        this.init();
    }

    loadPosts() {
        const saved = localStorage.getItem('blogPosts');
        if (saved) {
            return JSON.parse(saved);
        }
        // Default sample posts
        return [
            {
                id: Date.now() + 1,
                title: "My Journey with Machine Learning at NTUST",
                category: "Machine Learning",
                excerpt: "Reflecting on my experience building neural networks for air quality forecasting in Taipei, working with 100,000+ samples and learning the intricacies of Particle Swarm Optimization.",
                content: "Full blog post content here...",
                date: "2026-01-15",
                readTime: "5 min read",
                tags: ["Machine Learning", "Neural Networks", "Taiwan", "PSO"]
            },
            {
                id: Date.now() + 2,
                title: "Designing for Impact: The CLASTIC Experience",
                category: "UI/UX",
                excerpt: "How we created an AI-powered waste sorting app for rural Indonesia, balancing user needs with technical constraints and real-world testing in Sumberbening Village.",
                content: "Full blog post content here...",
                date: "2024-06-20",
                readTime: "7 min read",
                tags: ["UI/UX", "Design Thinking", "Social Impact", "AI"]
            },
            {
                id: Date.now() + 3,
                title: "Understanding Fuzzy Logic in Control Systems",
                category: "Tutorial",
                excerpt: "A beginner-friendly guide to implementing fuzzy logic controllers for dynamic target tracking, with code examples and practical applications in autonomous systems.",
                content: "Full blog post content here...",
                date: "2025-12-10",
                readTime: "10 min read",
                tags: ["Fuzzy Logic", "Control Systems", "Tutorial", "Python"]
            }
        ];
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    init() {
        this.renderPosts();
        this.initCMSAdmin();
    }

    renderPosts() {
        const blogGrid = document.getElementById('blogGrid');
        
        if (this.posts.length === 0) {
            blogGrid.innerHTML = `
                <div class="blog-loading">
                    <p style="color: var(--text-secondary);">No blog posts yet. Check back soon!</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        const sortedPosts = [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        blogGrid.innerHTML = sortedPosts.map(post => `
            <div class="blog-card" onclick="blogCMS.viewPost(${post.id})">
                <div class="blog-card-header">
                    <span class="blog-category">${post.category}</span>
                    <h3>${post.title}</h3>
                    <div class="blog-meta">
                        <span>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>${post.readTime}</span>
                    </div>
                </div>
                <div class="blog-card-body">
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    initCMSAdmin() {
        const toggleCMS = document.getElementById('toggleCMS');
        const cmsEditor = document.getElementById('cmsEditor');
        const blogForm = document.getElementById('blogForm');
        const cancelEdit = document.getElementById('cancelEdit');

        // Show CMS admin only when accessing with special key combination (Ctrl+Shift+B)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                document.getElementById('cmsAdmin').style.display = 'block';
            }
        });

        toggleCMS?.addEventListener('click', () => {
            cmsEditor.style.display = cmsEditor.style.display === 'none' ? 'block' : 'none';
        });

        blogForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePost();
        });

        cancelEdit?.addEventListener('click', () => {
            this.resetForm();
        });
    }

    savePost() {
        const id = document.getElementById('postId').value;
        const post = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('postTitle').value,
            category: document.getElementById('postCategory').value,
            excerpt: document.getElementById('postExcerpt').value,
            content: document.getElementById('postContent').value,
            date: new Date().toISOString().split('T')[0],
            readTime: this.calculateReadTime(document.getElementById('postContent').value),
            tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t)
        };

        if (id) {
            // Update existing
            const index = this.posts.findIndex(p => p.id === parseInt(id));
            this.posts[index] = post;
        } else {
            // Add new
            this.posts.push(post);
        }

        this.savePosts();
        this.renderPosts();
        this.resetForm();
        alert('Blog post saved successfully!');
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }

    resetForm() {
        document.getElementById('blogForm').reset();
        document.getElementById('postId').value = '';
        document.getElementById('cmsEditor').style.display = 'none';
    }

    viewPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        alert(`${post.title}\n\n${post.excerpt}\n\nFull blog post viewing coming soon!`);
    }

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;
        document.getElementById('postTags').value = post.tags.join(', ');
        
        document.getElementById('cmsEditor').style.display = 'block';
        document.getElementById('cmsEditor').scrollIntoView({ behavior: 'smooth' });
    }

    deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(p => p.id !== id);
            this.savePosts();
            this.renderPosts();
        }
    }
}

// Initialize Blog CMS
const blogCMS = new BlogCMS();

// ==================== PDF RESUME DOWNLOAD ====================
document.getElementById('downloadCV')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const generator = new CVGenerator();
        const success = await generator.generatePDF();
        
        if (success) {
            // PDF generated successfully
            console.log('PDF downloaded successfully!');
        } else {
            // Fell back to text version
            alert('CV downloaded as text file. For a PDF version with full formatting, please ensure you have a modern browser with JavaScript enabled.');
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again or contact me directly at gerald.pranaja@gmail.com');
    }
});

function generateCVData() {
    // This function is now in cv-generator.js as part of CVGenerator class
    // Kept here for backwards compatibility if needed
    return `CV content...`;
}

// ==================== FLOATING CATS - BIGGER & MORE VISIBLE ====================
const catsContainer = document.getElementById('catsContainer');
const catImages = ['akukiku_cat2', 'Bumba_dog1', 'Cebi_cat1', 'koboy_dog2', 'landi_dog3', 'lyra_cat3'];
const numCats = 15; // Increased from 12

function createFloatingCat() {
    const cat = document.createElement('img');
    const randomCat = catImages[Math.floor(Math.random() * catImages.length)];
    cat.src = `assets/cats/${randomCat}.png`;
    cat.classList.add('floating-cat');
    
    // BIGGER SIZE: 80px to 160px (increased from 60-120px)
    const size = Math.random() * 80 + 80;
    cat.style.width = `${size}px`;
    cat.style.height = 'auto';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    cat.style.left = `${startX}px`;
    cat.style.top = `${startY}px`;
    
    // Random animation duration between 25-45 seconds (slower for visibility)
    const duration = Math.random() * 20 + 25;
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 250 + Math.random() * 350;
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
        const y = startY + (endY - startY) * easedProgress + Math.sin(progress * Math.PI * 4) * 25;
        
        cat.style.left = `${x}px`;
        cat.style.top = `${y}px`;
        
        // Gentle rotation
        cat.style.transform = `rotate(${Math.sin(progress * Math.PI * 2) * 15}deg)`;
        
        // Reset when animation completes
        if (progress >= 0.99) {
            // Generate new random end position
            const newAngle = Math.random() * Math.PI * 2;
            const newDistance = 250 + Math.random() * 350;
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

// Initialize cats with stagger
for (let i = 0; i < numCats; i++) {
    setTimeout(() => createFloatingCat(), i * 150);
}

// ==================== NAVBAR SCROLL EFFECT ====================
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

// ==================== SMOOTH SCROLL ====================
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

// ==================== INTERSECTION OBSERVER ====================
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
const animateOnScroll = document.querySelectorAll('.timeline-item, .project-card, .stat-card, .contact-card, .blog-card');
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

// ==================== CAT CLICK EASTER EGG ====================
let catClickCount = 0;
let totalCatClicks = 0;

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('floating-cat')) {
        catClickCount++;
        totalCatClicks++;
        
        // Make the clicked cat briefly more visible and bigger
        e.target.style.opacity = '0.9';
        const currentTransform = e.target.style.transform;
        e.target.style.transform = 'scale(1.3) rotate(360deg)';
        
        setTimeout(() => {
            e.target.style.opacity = '0.3';
            e.target.style.transform = currentTransform;
        }, 400);
        
        // Easter egg: if user clicks 5 cats, spawn more!
        if (catClickCount === 5) {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => createFloatingCat(), i * 100);
            }
            catClickCount = 0;
            
            // Show fun message
            if (totalCatClicks === 5) {
                console.log('%c🐱 Meow! You found the cats! Keep clicking for more!', 'font-size: 16px; color: #2563eb;');
            }
        }
        
        // Super secret: click 20 cats total
        if (totalCatClicks === 20) {
            alert('🎉 Wow! You REALLY love cats! Here\'s a secret: Press Ctrl+Shift+B to access the blog CMS!');
        }
    }
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});

// ==================== MOBILE HANDLING ====================
const handleResize = () => {
    if (window.innerWidth <= 640) {
        console.log('Mobile view active');
    }
};

window.addEventListener('resize', handleResize);
handleResize();

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
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

// ==================== CONSOLE EASTER EGGS ====================
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%c🐱 Try clicking on the floating cats! Click 5 to spawn more!', 'font-size: 14px; color: #64748b;');
console.log('%c🎨 Press Ctrl+Shift+B to access the secret blog CMS!', 'font-size: 14px; color: #8b5cf6;');
console.log('%c💡 Toggle dark mode with the button in the top right!', 'font-size: 14px; color: #64748b;');
console.log('%c❤️ Built with curiosity by Gerald', 'font-size: 12px; font-style: italic; color: #8b5cf6;');

// ==================== INTERACTIVE PROJECT CARDS ====================
document.querySelectorAll('.interactive-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.setProperty('--hover-scale', '1.05');
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.setProperty('--hover-scale', '1');
    });
});