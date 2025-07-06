// Common UI Handler
class CommonUI {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        this.setupUI();
    }

    setupUI() {
        if (this.currentUser) {
            this.updateProfileUI();
        }
    }

    updateProfileUI() {
        // Update profile name in navbar
        const profileNameElement = document.querySelector('.profile-name');
        if (profileNameElement) {
            profileNameElement.textContent = this.currentUser.fullName;
        }

        // Update profile avatar in navbar
        const savedAvatar = localStorage.getItem(`avatar_${this.currentUser.id}`);
        if (savedAvatar) {
            const avatars = document.querySelectorAll('.profile-avatar');
            avatars.forEach(avatar => {
                avatar.src = savedAvatar;
            });
        }
    }
}

// Authentication check function
function isAuthenticated() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    return !!currentUser;
}

// Initialize common UI
document.addEventListener('DOMContentLoaded', () => {
    const commonUI = new CommonUI();
});

// Session Filters
document.addEventListener('DOMContentLoaded', function() {
    const sessionFilters = document.querySelector('.session-filters');
    if (sessionFilters) {
        const filterButtons = sessionFilters.querySelectorAll('.btn-group button');
        const sessionCards = document.querySelectorAll('.session-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.textContent.trim();

                sessionCards.forEach(card => {
                    const sessionType = card.querySelector('.session-type .badge').textContent;
                    if (filterValue === 'All' || sessionType === filterValue) {
                        card.style.display = '';
                        // Add fade-in animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transition = 'opacity 0.3s ease';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = element => {
        element.classList.add('active');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 90)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initial check for elements in view
    handleScrollAnimation();
}); 