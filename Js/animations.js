document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
    });

    // Initialize sections immediately without waiting for scroll
    const initializeSections = () => {
        // Initialize Popular Courses section
        const popularCoursesSection = document.querySelector('.popular-courses');
        if (popularCoursesSection) {
            popularCoursesSection.classList.add('active');
            const courseCards = popularCoursesSection.querySelectorAll('.course-card');
            courseCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }

        // Initialize Success Stories section
        const successStoriesSection = document.querySelector('.success-stories');
        if (successStoriesSection) {
            successStoriesSection.classList.add('active');
            const storyCards = successStoriesSection.querySelectorAll('.success-story-card');
            storyCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    };

    // Call initialization immediately
    initializeSections();

    // Learning Journey Path Animation
    const pathTimeline = document.querySelector('.path-timeline');
    if (pathTimeline) {
        const pathItems = pathTimeline.querySelectorAll('.path-item');
        let activeIndex = 0;

        // Initialize first item as active
        pathItems[0].classList.add('active');

        // Intersection Observer for path items
        const pathObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const index = Array.from(pathItems).indexOf(item);
                    
                    // Activate current item and all previous items
                    for (let i = 0; i <= index; i++) {
                        pathItems[i].classList.add('active');
                    }
                    
                    // Update active index
                    activeIndex = Math.max(activeIndex, index);
                }
            });
        }, {
            threshold: 0.5
        });

        // Observe each path item
        pathItems.forEach(item => pathObserver.observe(item));

        // Add hover effects
        pathItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (index <= activeIndex) {
                    item.classList.add('hover');
                    
                    // Ripple effect on icon
                    const icon = item.querySelector('.path-icon');
                    const ripple = document.createElement('span');
                    ripple.className = 'path-ripple';
                    icon.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 1000);
                }
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
            });

            // Click handler for path items
            item.addEventListener('click', () => {
                if (index <= activeIndex) {
                    // Trigger pulse animation
                    item.classList.add('pulse');
                    setTimeout(() => item.classList.remove('pulse'), 1000);

                    // Show content preview
                    const content = item.querySelector('.path-content');
                    const preview = document.createElement('div');
                    preview.className = 'path-preview';
                    preview.innerHTML = `
                        <div class="path-preview-content">
                            <h4>${content.querySelector('h3').textContent}</h4>
                            <p>${content.querySelector('p').textContent}</p>
                            <div class="path-preview-stats">
                                <span><i class="fas fa-clock"></i> 4-6 weeks</span>
                                <span><i class="fas fa-book-reader"></i> 5 modules</span>
                            </div>
                        </div>
                    `;

                    // Position preview
                    const rect = item.getBoundingClientRect();
                    preview.style.top = rect.top + window.scrollY + 'px';
                    preview.style.left = rect.right + 20 + 'px';

                    // Add to document
                    document.body.appendChild(preview);

                    // Remove preview on click outside
                    const removePreview = (e) => {
                        if (!preview.contains(e.target) && !item.contains(e.target)) {
                            preview.remove();
                            document.removeEventListener('click', removePreview);
                        }
                    };
                    document.addEventListener('click', removePreview);
                }
            });
        });

        // Add connecting lines animation
        const addConnectingLines = () => {
            const line = document.createElement('div');
            line.className = 'path-line';
            pathTimeline.appendChild(line);

            // Animate line based on scroll position
            const animateLine = () => {
                const timelineRect = pathTimeline.getBoundingClientRect();
                const scrollPercentage = Math.max(0, Math.min(1, 
                    (window.innerHeight - timelineRect.top) / (timelineRect.height + window.innerHeight)
                ));
                line.style.height = (scrollPercentage * 100) + '%';
            };

            window.addEventListener('scroll', animateLine);
            animateLine(); // Initial animation
        };
        addConnectingLines();
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('live-sessions-content')) {
                    document.querySelector('.live-sessions-features').classList.add('animate');
                }
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate, .live-sessions-content').forEach(el => {
        observer.observe(el);
    });

    // Button Ripple Effect
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => ripple.remove(), 800);
        });

        // Mouse move effect
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });

    // Particle Effect
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.live-sessions-section').appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = (Math.random() * 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // Feature cards enhanced interaction
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        // 3D Tilt Effect
        feature.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable on mobile

            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((centerX - x) / centerX) * 10;
            
            feature.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
                scale3d(1.05, 1.05, 1.05)
            `;
        });

        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1, 1, 1)';
        });

        // Magnetic Effect
        feature.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable on mobile

            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const icon = feature.querySelector('i');
            const text = feature.querySelector('span');
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = ((x - centerX) / centerX) * 15;
            const deltaY = ((y - centerY) / centerY) * 15;
            
            icon.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            text.style.transform = `translate(${deltaX * 0.5}px, ${deltaY * 0.5}px)`;
        });

        feature.addEventListener('mouseleave', () => {
            const icon = feature.querySelector('i');
            const text = feature.querySelector('span');
            
            icon.style.transform = 'translate(0, 0)';
            text.style.transform = 'translate(0, 0)';
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Parallax effect for live sessions section
    const liveSessionsSection = document.querySelector('.live-sessions-section');
    if (liveSessionsSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            liveSessionsSection.style.backgroundPosition = `center ${rate}px`;
        });
    }

    // Create particles for the carousel
    const particlesContainer = document.querySelector('.carousel-particles');
    if (particlesContainer) {
        // Create 50 particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'carousel-particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random size
            const size = Math.random() * 4 + 2; // 2-6px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 10 + 's';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.scroll-animate');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
}); 