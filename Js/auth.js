// User Authentication Module
class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        this.setupEventListeners();
        this.updateUIState();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Password toggle buttons
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.querySelector('i').classList.toggle('fa-eye');
                togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }

        if (toggleConfirmPassword && confirmPasswordInput) {
            toggleConfirmPassword.addEventListener('click', () => {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye');
                toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    }

    updateUIState() {
        const authButtons = document.querySelector('.auth-buttons');
        const profileMenu = document.querySelector('.profile-menu');

        if (authButtons && profileMenu) {
            if (this.currentUser) {
                authButtons.classList.add('d-none');
                profileMenu.classList.remove('d-none');
                // Initialize common UI to update profile
                const commonUI = new CommonUI();
            } else {
                authButtons.classList.remove('d-none');
                profileMenu.classList.add('d-none');
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            if (user.isDeactivated) {
                // Reactivate account
                const userIndex = users.findIndex(u => u.id === user.id);
                users[userIndex].isDeactivated = false;
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Store user data
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }

            window.location.href = 'profile.html';
        } catch (error) {
            const alertElement = document.querySelector('.alert');
            if (alertElement) {
                alertElement.textContent = error.message;
                alertElement.classList.remove('d-none');
            }
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                throw new Error('Email already exists');
            }

            const newUser = {
                id: Date.now().toString(),
                fullName,
                email,
                password,
                isDeactivated: false
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Initialize sample data for the new user
            this.initializeUserData(newUser.id);

            // Redirect to login
            window.location.href = 'login.html';
        } catch (error) {
            const alertElement = document.querySelector('.alert');
            if (alertElement) {
                alertElement.textContent = error.message;
                alertElement.classList.remove('d-none');
            }
        }
    }

    initializeUserData(userId) {
        // Initialize sample courses
        const sampleCourses = [
            {
                id: '1',
                title: 'Understanding ADHD Fundamentals',
                description: 'Learn the basics of ADHD and its impact on daily life.',
                progress: 75
            },
            {
                id: '2',
                title: 'ADHD Management Strategies',
                description: 'Practical techniques for managing ADHD symptoms.',
                progress: 30
            }
        ];
        localStorage.setItem(`courses_${userId}`, JSON.stringify(sampleCourses));

        // Initialize sample appointments
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const sampleAppointments = [
            {
                id: '1',
                doctorName: 'Dr. Sarah Mitchell',
                specialization: 'Child Psychiatrist',
                date: nextWeek.toISOString(),
                time: '2:30 PM',
                isOnline: true,
                location: null
            }
        ];
        localStorage.setItem(`appointments_${userId}`, JSON.stringify(sampleAppointments));

        // Initialize notification settings
        const notificationSettings = {
            emailNotifications: true,
            courseUpdates: true,
            appointmentReminders: true
        };
        localStorage.setItem(`notificationSettings_${userId}`, JSON.stringify(notificationSettings));

        // Initialize privacy settings
        const privacySettings = {
            profileVisibility: false,
            activitySharing: false
        };
        localStorage.setItem(`privacySettings_${userId}`, JSON.stringify(privacySettings));

        // Initialize user stats
        const stats = {
            coursesEnrolled: 2,
            learningTime: 12,
            certificatesEarned: 1
        };
        localStorage.setItem(`stats_${userId}`, JSON.stringify(stats));

        // Initialize recent activities
        const activities = [
            {
                icon: 'fa-play-circle',
                title: 'Resumed Course',
                description: 'Understanding ADHD Fundamentals - Module 3',
                time: '2 hours ago'
            },
            {
                icon: 'fa-certificate',
                title: 'Earned Certificate',
                description: 'ADHD Management Strategies',
                time: 'Yesterday'
            },
            {
                icon: 'fa-calendar-check',
                title: 'Booked Appointment',
                description: 'Dr. Sarah Mitchell - Next Tuesday',
                time: '2 days ago'
            }
        ];
        localStorage.setItem(`activities_${userId}`, JSON.stringify(activities));
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Initialize auth
document.addEventListener('DOMContentLoaded', () => {
    const auth = new Auth();
}); 