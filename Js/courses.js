// Course data
const courses = [
    {
        id: 1,
        title: "Understanding ADHD: A Comprehensive Guide",
        category: "fundamentals",
        image: "./Images/course-1.jpg",
        badge: "Bestseller",
        description: "Learn the fundamentals of ADHD, including symptoms, diagnosis, and treatment options.",
        duration: "8 weeks",
        enrolled: "2,500+",
        rating: 4.8,
        reviews: 350,
        price: 99
    },
    {
        id: 2,
        title: "Essential ADHD Management Strategies",
        category: "strategies",
        image: "./Images/course-2.jpg",
        badge: "Popular",
        description: "Practical techniques and tools for managing ADHD symptoms in daily life.",
        duration: "6 weeks",
        enrolled: "1,800+",
        rating: 4.9,
        reviews: 280,
        price: 79
    },
    {
        id: 3,
        title: "Parenting Children with ADHD",
        category: "parents",
        image: "./Images/course-3.jpg",
        badge: "New",
        description: "Expert guidance for parents to support their children's success and well-being.",
        duration: "10 weeks",
        enrolled: "1,200+",
        rating: 5.0,
        reviews: 150,
        price: 129
    }
];

// State
let currentCategory = 'all';
let searchQuery = '';
let selectedCourseId = null;

// DOM Elements
const searchInput = document.querySelector('.search-box input');
const categoryButtons = document.querySelectorAll('.category-filters .btn');
const coursesGrid = document.querySelector('.featured-courses .row');
const loginModal = document.getElementById('loginModal');
const enrollModal = document.getElementById('enrollModal');
const loginModalForm = document.getElementById('loginModalForm');
const toggleModalPassword = document.getElementById('toggleModalPassword');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    initializeEventListeners();
    initializeModals();
});

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderCourses();
        });
    }

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.filter;
            renderCourses();
        });
    });

    // Login modal form submission
    if (loginModalForm) {
        loginModalForm.addEventListener('submit', handleLoginModalSubmit);
    }

    // Password toggle in login modal
    if (toggleModalPassword) {
        toggleModalPassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('loginModalPassword');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleModalPassword.querySelector('i').classList.toggle('fa-eye');
            toggleModalPassword.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Confirm enrollment button
    const confirmEnrollBtn = document.getElementById('confirmEnroll');
    if (confirmEnrollBtn) {
        confirmEnrollBtn.addEventListener('click', handleEnrollmentConfirmation);
    }
}

// Initialize Bootstrap modals
function initializeModals() {
    // Clear form and errors when login modal is hidden
    if (loginModal) {
        loginModal.addEventListener('hidden.bs.modal', () => {
            loginModalForm.reset();
            loginModalForm.querySelector('.alert').classList.add('d-none');
        });
    }

    // Handle enrollment modal closing
    if (enrollModal) {
        enrollModal.addEventListener('hidden.bs.modal', () => {
            selectedCourseId = null;
        });
    }
}

// Handle login modal form submission
async function handleLoginModalSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginModalEmail').value;
    const password = document.getElementById('loginModalPassword').value;
    const rememberMe = document.getElementById('loginModalRememberMe').checked;
    const alertElement = loginModalForm.querySelector('.alert');

    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Store user data
        const userData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }

        // Close login modal and update UI
        const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
        loginModalInstance.hide();

        // Update auth state
        document.querySelector('.auth-buttons').classList.add('d-none');
        document.querySelector('.profile-menu').classList.remove('d-none');

        // If there was a pending enrollment, show the enrollment modal
        if (selectedCourseId !== null) {
            showEnrollmentModal(selectedCourseId);
        }
    } catch (error) {
        alertElement.textContent = error.message;
        alertElement.classList.remove('d-none');
    }
}

// Enroll in course
function enrollCourse(courseId) {
    selectedCourseId = courseId;
    
    // Check if user is authenticated
    const isAuthenticated = checkAuthentication();
    
    if (!isAuthenticated) {
        // Show login modal
        const modal = new bootstrap.Modal(loginModal);
        modal.show();
        return;
    }
    
    showEnrollmentModal(courseId);
}

// Show enrollment confirmation modal
function showEnrollmentModal(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    if (enrollModal) {
        // Update course preview
        const previewImage = enrollModal.querySelector('.course-preview-image img');
        previewImage.src = course.image;
        previewImage.alt = course.title;

        // Update badge
        const badge = enrollModal.querySelector('.course-badge');
        if (course.badge) {
            badge.textContent = course.badge;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

        // Update course details
        enrollModal.querySelector('.course-title').textContent = course.title;
        enrollModal.querySelector('.course-description').textContent = course.description;
        enrollModal.querySelector('.duration').textContent = course.duration;
        enrollModal.querySelector('.enrolled').textContent = course.enrolled;
        
        // Update rating
        enrollModal.querySelector('.stars').innerHTML = generateStars(course.rating);
        enrollModal.querySelector('.reviews').textContent = `${course.rating} (${course.reviews} reviews)`;

        // Update price
        const priceElements = enrollModal.querySelectorAll('.course-price');
        priceElements.forEach(el => el.textContent = `$${course.price}`);
        
        const modal = new bootstrap.Modal(enrollModal);
        modal.show();
    }
}

// Handle enrollment confirmation
async function handleEnrollmentConfirmation() {
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return;

    try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) throw new Error('User not found');

        // Get user's enrolled courses
        let userCourses = JSON.parse(localStorage.getItem(`courses_${currentUser.id}`)) || [];

        // Check if already enrolled
        if (userCourses.some(c => c.id === selectedCourseId.toString())) {
            throw new Error('You are already enrolled in this course');
        }

        // Show loading state
        const confirmButton = document.getElementById('confirmEnroll');
        const originalText = confirmButton.innerHTML;
        confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        confirmButton.disabled = true;

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add course to user's enrolled courses
        userCourses.push({
            id: selectedCourseId.toString(),
            title: course.title,
            description: course.description,
            progress: 0,
            enrolledDate: new Date().toISOString()
        });

        // Save updated courses
        localStorage.setItem(`courses_${currentUser.id}`, JSON.stringify(userCourses));

        // Update user stats
        let stats = JSON.parse(localStorage.getItem(`stats_${currentUser.id}`)) || {
            coursesEnrolled: 0,
            learningTime: 0,
            certificatesEarned: 0
        };
        stats.coursesEnrolled++;
        localStorage.setItem(`stats_${currentUser.id}`, JSON.stringify(stats));

        // Add to activities
        let activities = JSON.parse(localStorage.getItem(`activities_${currentUser.id}`)) || [];
        activities.unshift({
            icon: 'fa-graduation-cap',
            title: 'Enrolled in Course',
            description: course.title,
            time: 'Just now'
        });
        localStorage.setItem(`activities_${currentUser.id}`, JSON.stringify(activities));

        // Close modal and show success message
        const modal = bootstrap.Modal.getInstance(enrollModal);
        modal.hide();

        showToast('Enrollment Successful', 
            `<div class="mb-2">Welcome to <strong>${course.title}</strong>!</div>
             <div>You can access your course materials from your profile dashboard.</div>`, 
            'success');

        // Reset selected course and button state
        selectedCourseId = null;
        confirmButton.innerHTML = originalText;
        confirmButton.disabled = false;

        // Update UI if needed (e.g., change enroll button to "Go to Course")
        const courseCard = document.querySelector(`.course-card[data-course-id="${course.id}"]`);
        if (courseCard) {
            const enrollButton = courseCard.querySelector('.btn-purple');
            enrollButton.textContent = 'Go to Course';
            enrollButton.onclick = () => window.location.href = 'profile.html';
        }
    } catch (error) {
        showToast('Error', error.message, 'danger');
    }
}

// Check authentication status
function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return currentUser !== null;
}

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Render courses
function renderCourses() {
    const filteredCourses = filterCourses();
    
    if (coursesGrid) {
        coursesGrid.innerHTML = filteredCourses.map(course => createCourseCard(course)).join('');
        initializeCourseCards();
    }
}

// Filter courses based on search and category
function filterCourses() {
    return courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery) ||
                            course.description.toLowerCase().includes(searchQuery);
        const matchesCategory = currentCategory === 'all' || course.category === currentCategory;
        
        return matchesSearch && matchesCategory;
    });
}

// Create course card HTML
function createCourseCard(course) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}" class="img-fluid">
                    ${course.badge ? `<span class="course-badge">${course.badge}</span>` : ''}
                </div>
                <div class="course-content">
                    <div class="course-category">${formatCategory(course.category)}</div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-user-graduate"></i> ${course.enrolled} enrolled</span>
                    </div>
                    <div class="course-rating">
                        <div class="stars">
                            ${generateStars(course.rating)}
                        </div>
                        <span>${course.rating} (${course.reviews} reviews)</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="course-price h5 mb-0">$${course.price}</span>
                        <button class="btn btn-purple" onclick="enrollCourse(${course.id})">Enroll Now</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Format category name
function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Initialize course cards
function initializeCourseCards() {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
        // Add hover animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
} 