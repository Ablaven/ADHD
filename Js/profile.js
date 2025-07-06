// Profile Page Handler
class Profile {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        this.setupEventListeners();
        this.loadUserData();
        this.loadUserStats();
        this.loadRecentActivity();
        this.loadCourses();
        this.loadAppointments();
        this.initializeProgressChart();
        this.setupThemeCustomization();
        this.handleInitialHash();
    }

    setupEventListeners() {
        // Profile settings form
        const profileSettingsForm = document.getElementById('profileSettingsForm');
        if (profileSettingsForm) {
            profileSettingsForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Avatar edit button
        const avatarEdit = document.querySelector('.avatar-edit');
        if (avatarEdit) {
            avatarEdit.addEventListener('click', () => this.handleAvatarEdit());
        }

        // Password toggle buttons
        const toggleSettingsPassword = document.getElementById('toggleSettingsPassword');
        const toggleSettingsConfirmPassword = document.getElementById('toggleSettingsConfirmPassword');
        if (toggleSettingsPassword) {
            toggleSettingsPassword.addEventListener('click', () => this.togglePasswordVisibility('settingsPassword', toggleSettingsPassword));
        }
        if (toggleSettingsConfirmPassword) {
            toggleSettingsConfirmPassword.addEventListener('click', () => this.togglePasswordVisibility('settingsConfirmPassword', toggleSettingsConfirmPassword));
        }

        // Notification settings
        const notificationToggles = document.querySelectorAll('.notification-settings .form-check-input');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handleNotificationToggle(e));
        });

        // Privacy settings
        const privacyToggles = document.querySelectorAll('.privacy-settings .form-check-input');
        privacyToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handlePrivacyToggle(e));
        });

        // Account deactivation
        const deactivateBtn = document.getElementById('deactivateAccount');
        if (deactivateBtn) {
            deactivateBtn.addEventListener('click', () => this.handleDeactivation());
        }

        // Tab change handler
        const tabLinks = document.querySelectorAll('.profile-nav .nav-link');
        const contentSections = document.querySelectorAll('.content-section');

        // Hide all sections except overview initially
        contentSections.forEach(section => {
            if (!section.id.includes('overview')) {
                section.style.display = 'none';
            }
        });

        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                tabLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show the selected section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            });
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Mark notification as read
        const markReadBtns = document.querySelectorAll('.mark-read-btn');
        markReadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.markNotificationAsRead(e));
        });

        // New appointment form
        const newAppointmentForm = document.getElementById('newAppointmentForm');
        if (newAppointmentForm) {
            newAppointmentForm.addEventListener('submit', (e) => this.handleNewAppointment(e));
        }

        // Theme customization
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => this.changeTheme(option.dataset.theme));
        });

        const displayModeInputs = document.querySelectorAll('input[name="displayMode"]');
        displayModeInputs.forEach(input => {
            input.addEventListener('change', () => this.changeDisplayMode(input.id));
        });

        // Data management
        const exportDataBtn = document.querySelector('[title="Export all data"]');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportUserData());
        }

        const dataImport = document.getElementById('dataImport');
        if (dataImport) {
            dataImport.addEventListener('change', (e) => this.importUserData(e));
        }
    }

    handleInitialHash() {
        // Handle the initial hash when the page loads
        const hash = window.location.hash || '#overview';
        this.switchToTab(hash.substring(1));
    }

    handleHashChange() {
        // Handle hash changes when navigating
        const hash = window.location.hash || '#overview';
        this.switchToTab(hash.substring(1));
    }

    switchToTab(tabId) {
        // Remove active class from all tabs and nav items
        document.querySelectorAll('.tab-pane').forEach(tab => {
            tab.classList.remove('show', 'active');
        });
        document.querySelectorAll('.profile-nav li').forEach(navItem => {
            navItem.classList.remove('active');
        });

        // Activate the selected tab and nav item
        const selectedTab = document.getElementById(tabId);
        const selectedNavItem = document.querySelector(`.profile-nav a[href="#${tabId}"]`).closest('li');
        
        if (selectedTab && selectedNavItem) {
            selectedTab.classList.add('show', 'active');
            selectedNavItem.classList.add('active');
        }
    }

    loadUserData() {
        // Update profile info in sidebar
        const profileNameLarge = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');

        if (profileNameLarge) {
            profileNameLarge.textContent = this.currentUser.fullName;
        }
        if (profileEmail) {
            profileEmail.textContent = this.currentUser.email;
        }

        // Load saved avatar
        const savedAvatar = localStorage.getItem(`avatar_${this.currentUser.id}`);
        if (savedAvatar && profileAvatar) {
            profileAvatar.src = savedAvatar;
        }

        // Load settings form data
        const settingsName = document.getElementById('settingsName');
        const settingsEmail = document.getElementById('settingsEmail');
        const settingsPhone = document.getElementById('settingsPhone');
        const settingsTimezone = document.getElementById('settingsTimezone');

        if (settingsName) {
            settingsName.value = this.currentUser.fullName;
        }
        if (settingsEmail) {
            settingsEmail.value = this.currentUser.email;
        }
        if (settingsPhone) {
            settingsPhone.value = this.currentUser.phone || '';
        }
        if (settingsTimezone) {
            settingsTimezone.value = this.currentUser.timezone || 'UTC';
        }

        // Load notification settings
        const savedSettings = JSON.parse(localStorage.getItem(`notificationSettings_${this.currentUser.id}`)) || {
            emailNotifications: true,
            courseUpdates: true,
            appointmentReminders: true
        };
        
        Object.entries(savedSettings).forEach(([key, value]) => {
            const toggle = document.getElementById(key);
            if (toggle) {
                toggle.checked = value;
            }
        });

        // Load privacy settings
        const privacySettings = JSON.parse(localStorage.getItem(`privacySettings_${this.currentUser.id}`)) || {
            profileVisibility: false,
            activitySharing: false
        };

        Object.entries(privacySettings).forEach(([key, value]) => {
            const toggle = document.getElementById(key);
            if (toggle) {
                toggle.checked = value;
            }
        });

        // Load security settings
        const twoFactorAuth = document.getElementById('twoFactorAuth');
        if (twoFactorAuth) {
            twoFactorAuth.checked = this.currentUser.twoFactorEnabled || false;
        }

        // Load theme settings
        const savedTheme = localStorage.getItem(`theme_${this.currentUser.id}`);
        if (savedTheme) {
            this.applyTheme(JSON.parse(savedTheme));
        }
    }

    loadUserStats() {
        // Load user statistics from localStorage
        const stats = JSON.parse(localStorage.getItem(`stats_${this.currentUser.id}`)) || {
            coursesEnrolled: 0,
            learningTime: 0,
            certificatesEarned: 0,
            weeklyGoal: {
                target: 5,
                completed: 4
            },
            monthlyProgress: {
                target: 20,
                completed: 18
            }
        };

        // Update stats in the UI
        const statsElements = {
            coursesEnrolled: document.querySelector('[data-stat="coursesEnrolled"]'),
            learningTime: document.querySelector('[data-stat="learningTime"]'),
            certificatesEarned: document.querySelector('[data-stat="certificatesEarned"]')
        };

        if (statsElements.coursesEnrolled) {
            statsElements.coursesEnrolled.textContent = `${stats.coursesEnrolled} Active Courses`;
        }
        if (statsElements.learningTime) {
            statsElements.learningTime.textContent = `${stats.learningTime} Hours`;
        }
        if (statsElements.certificatesEarned) {
            statsElements.certificatesEarned.textContent = `${stats.certificatesEarned} Earned`;
        }

        // Update progress stats
        const weeklyGoal = document.querySelector('.progress-stat-item:first-child p');
        const monthlyProgress = document.querySelector('.progress-stat-item:last-child p');

        if (weeklyGoal) {
            weeklyGoal.textContent = `${stats.weeklyGoal.completed}/${stats.weeklyGoal.target} hours completed`;
        }
        if (monthlyProgress) {
            monthlyProgress.textContent = `${stats.monthlyProgress.completed}/${stats.monthlyProgress.target} hours completed`;
        }
    }

    loadRecentActivity() {
        // Load recent activity from localStorage
        const activities = JSON.parse(localStorage.getItem(`activities_${this.currentUser.id}`)) || [];
        const activityTimeline = document.querySelector('.activity-timeline');

        if (activityTimeline && activities.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history fa-3x mb-3 text-purple"></i>
                    <h4>No Recent Activity</h4>
                    <p>Your learning journey starts here!</p>
                </div>
            `;
        }
    }

    loadCourses() {
        const coursesContainer = document.querySelector('#courses .courses-grid');
        if (!coursesContainer) return;

        // Load courses from localStorage or use default empty array
        const userCourses = JSON.parse(localStorage.getItem(`courses_${this.currentUser.id}`)) || [];
        
        if (userCourses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h4>No Courses Yet</h4>
                    <p>Start your learning journey by enrolling in a course.</p>
                    <a href="courses.html" class="btn btn-purple">Browse Courses</a>
                </div>
            `;
            return;
        }

        coursesContainer.innerHTML = userCourses.map(course => `
            <div class="course-card">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-progress">
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${course.progress}%" 
                                 aria-valuenow="${course.progress}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span>${course.progress}% Complete</span>
                    </div>
                </div>
                <div class="course-content">
                    <span class="course-category">${course.category}</span>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-book-open"></i> ${course.lessons} Lessons</span>
                    </div>
                    <a href="courses.html#${course.id}" class="btn btn-purple">Continue Learning</a>
                </div>
            </div>
        `).join('');

        // Update stats
        const coursesEnrolled = document.querySelector('[data-stat="coursesEnrolled"]');
        if (coursesEnrolled) {
            coursesEnrolled.textContent = `${userCourses.length} Active Courses`;
        }
    }

    loadAppointments() {
        const appointmentsContainer = document.querySelector('#appointments .appointments-grid');
        if (!appointmentsContainer) return;

        // Load appointments from localStorage or use default empty array
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${this.currentUser.id}`)) || [];
        
        if (userAppointments.length === 0) {
            appointmentsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h4>No Appointments Scheduled</h4>
                    <p>Book a session with one of our experts.</p>
                    <a href="doctors.html" class="btn btn-purple">Find a Doctor</a>
                </div>
            `;
            return;
        }

        // Sort appointments by date
        userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

        appointmentsContainer.innerHTML = userAppointments.map(appointment => {
            const appointmentDate = new Date(appointment.date);
            const isUpcoming = appointmentDate > new Date();
            const statusClass = isUpcoming ? 'upcoming' : 'completed';
            const statusText = isUpcoming ? 'Upcoming' : 'Completed';
            
            return `
                <div class="appointment-card ${statusClass}">
                    <div class="appointment-status">
                        <span class="status-badge">${statusText}</span>
                    </div>
                    <div class="appointment-details">
                        <h4>Session with Dr. ${appointment.doctorName}</h4>
                        <p><i class="fas fa-calendar"></i> ${appointmentDate.toLocaleDateString()}</p>
                        <p><i class="fas fa-clock"></i> ${appointment.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${appointment.location}</p>
                    </div>
                    <div class="appointment-actions">
                        ${isUpcoming ? `
                            <button class="btn btn-sm btn-purple" onclick="profile.joinCall('${appointment.id}')" 
                                    ${appointment.isOnline ? '' : 'disabled'}>
                                <i class="fas fa-video"></i> Join Call
                            </button>
                            <button class="btn btn-sm btn-outline-purple" onclick="profile.handleReschedule('${appointment.id}')">
                                <i class="fas fa-calendar-alt"></i> Reschedule
                            </button>
                            ${!appointment.isOnline ? `
                                <button class="btn btn-sm btn-outline-purple" onclick="profile.getDirections('${appointment.id}')">
                                    <i class="fas fa-directions"></i> Get Directions
                                </button>
                            ` : ''}
                        ` : `
                            <button class="btn btn-sm btn-purple" onclick="profile.bookFollowUp('${appointment.id}')">
                                <i class="fas fa-calendar-plus"></i> Book Follow-up
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    handleReschedule(appointmentId) {
        // Show reschedule modal
        const appointment = this.getUserAppointment(appointmentId);
        if (!appointment) return;

        const modal = new bootstrap.Modal(document.getElementById('rescheduleModal'));
        const modalBody = document.querySelector('#rescheduleModal .modal-body');
        
        modalBody.innerHTML = `
            <form id="rescheduleForm">
                <input type="hidden" name="appointmentId" value="${appointmentId}">
                <div class="mb-3">
                    <label class="form-label">Current Date & Time</label>
                    <p class="form-text">${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}</p>
                </div>
                <div class="mb-3">
                    <label for="newDate" class="form-label">New Date</label>
                    <input type="date" class="form-control" id="newDate" name="newDate" required>
                </div>
                <div class="mb-3">
                    <label for="newTime" class="form-label">New Time</label>
                    <select class="form-control" id="newTime" name="newTime" required>
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="reason" class="form-label">Reason for Rescheduling</label>
                    <textarea class="form-control" id="reason" name="reason" rows="3" required></textarea>
                </div>
            </form>
        `;

        modal.show();

        // Handle form submission
        const form = document.getElementById('rescheduleForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReschedule(form);
            modal.hide();
        });
    }

    getUserAppointment(appointmentId) {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${this.currentUser.id}`)) || [];
        return appointments.find(a => a.id === appointmentId);
    }

    joinCall(appointmentId) {
        const appointment = this.getUserAppointment(appointmentId);
        if (!appointment || !appointment.isOnline) return;
        
        // Open video call in new window
        window.open(`video-call.html?id=${appointmentId}`, '_blank', 'width=1200,height=800');
    }

    getDirections(appointmentId) {
        const appointment = this.getUserAppointment(appointmentId);
        if (!appointment || appointment.isOnline) return;
        
        // Open directions in Google Maps
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(appointment.location)}`, '_blank');
    }

    bookFollowUp(appointmentId) {
        const appointment = this.getUserAppointment(appointmentId);
        if (!appointment) return;
        
        // Redirect to booking page with pre-filled doctor
        window.location.href = `doctors.html?doctor=${encodeURIComponent(appointment.doctorId)}#booking`;
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        const newName = document.getElementById('settingsName').value;
        const newPassword = document.getElementById('settingsPassword').value;
        const confirmPassword = document.getElementById('settingsConfirmPassword').value;

        try {
            if (newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (newPassword.length < 8) {
                    throw new Error('Password must be at least 8 characters long');
                }
            }

            // Update user data
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].fullName = newName;
                if (newPassword) {
                    users[userIndex].password = btoa(newPassword); // Simple encoding for demo
                }
                localStorage.setItem('users', JSON.stringify(users));

                // Update current user
                this.currentUser.fullName = newName;
                if (localStorage.getItem('currentUser')) {
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }
                if (sessionStorage.getItem('currentUser')) {
                    sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }

                // Reload user data
                this.loadUserData();
                // Update common UI
                const commonUI = new CommonUI();

                // Show success message
                alert('Profile updated successfully');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    handleAvatarEdit() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('Image size should be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarUrl = e.target.result;
                    // Save avatar URL to local storage
                    localStorage.setItem(`avatar_${this.currentUser.id}`, avatarUrl);
                    // Update UI
                    this.loadUserData();
                    // Update common UI
                    const commonUI = new CommonUI();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    togglePasswordVisibility(inputId, buttonElement) {
        const input = document.getElementById(inputId);
        const icon = buttonElement.querySelector('i');
        
        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    handleNotificationToggle(e) {
        const settingId = e.target.id;
        const isEnabled = e.target.checked;
        
        // Save notification settings
        const savedSettings = JSON.parse(localStorage.getItem(`notificationSettings_${this.currentUser.id}`)) || {};
        savedSettings[settingId] = isEnabled;
        localStorage.setItem(`notificationSettings_${this.currentUser.id}`, JSON.stringify(savedSettings));
    }

    handlePrivacyToggle(e) {
        const settingId = e.target.id;
        const isEnabled = e.target.checked;
        
        // Save privacy settings
        const savedSettings = JSON.parse(localStorage.getItem(`privacySettings_${this.currentUser.id}`)) || {};
        savedSettings[settingId] = isEnabled;
        localStorage.setItem(`privacySettings_${this.currentUser.id}`, JSON.stringify(savedSettings));
    }

    handleDeactivation() {
        if (confirm('Are you sure you want to deactivate your account? You can reactivate it by logging in again.')) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].isDeactivated = true;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Log out the user
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        }
    }

    initializeProgressChart() {
        const ctx = document.getElementById('learningProgressChart');
        if (!ctx) return;

        // Load progress data
        const progressData = JSON.parse(localStorage.getItem(`progress_${this.currentUser.id}`)) || {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [2, 1.5, 3, 2, 2.5, 1, 0]
        };

        // Initialize Chart.js
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: progressData.labels,
                datasets: [{
                    label: 'Learning Hours',
                    data: progressData.data,
                    borderColor: 'rgb(124, 58, 237)',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    setupThemeCustomization() {
        // Load saved theme
        const savedTheme = localStorage.getItem(`theme_${this.currentUser.id}`);
        if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            this.applyTheme(theme);
        }

        // Load saved display mode
        const savedDisplayMode = localStorage.getItem(`displayMode_${this.currentUser.id}`);
        if (savedDisplayMode) {
            document.querySelector(`#${savedDisplayMode}`).checked = true;
            this.applyDisplayMode(savedDisplayMode);
        }
    }

    applyTheme(theme) {
        document.documentElement.style.setProperty('--purple-600', theme.color);
        // Update active state of color options
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme.name);
        });
    }

    applyDisplayMode(mode) {
        const root = document.documentElement;
        switch (mode) {
            case 'darkMode':
                root.classList.add('dark-mode');
                root.classList.remove('light-mode');
                break;
            case 'lightMode':
                root.classList.add('light-mode');
                root.classList.remove('dark-mode');
                break;
            case 'systemMode':
                root.classList.remove('dark-mode', 'light-mode');
                break;
        }
    }

    changeTheme(themeName) {
        const themeColors = {
            purple: { name: 'purple', color: 'var(--purple-600)' },
            blue: { name: 'blue', color: 'var(--status-info)' },
            green: { name: 'green', color: 'var(--status-online)' },
            orange: { name: 'orange', color: 'var(--status-warning)' }
        };

        const theme = themeColors[themeName];
        if (theme) {
            this.applyTheme(theme);
            localStorage.setItem(`theme_${this.currentUser.id}`, JSON.stringify(theme));
        }
    }

    changeDisplayMode(mode) {
        this.applyDisplayMode(mode);
        localStorage.setItem(`displayMode_${this.currentUser.id}`, mode);
    }

    markNotificationAsRead(e) {
        const notificationItem = e.target.closest('.notification-item');
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            e.target.remove();
        }
    }

    handleNewAppointment(e) {
        e.preventDefault();
        // Implementation for handling new appointment submission
        const formData = new FormData(e.target);
        const appointmentData = {
            doctor: formData.get('doctor'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            notes: formData.get('notes')
        };

        // Save appointment data
        const appointments = JSON.parse(localStorage.getItem(`appointments_${this.currentUser.id}`)) || [];
        appointments.push(appointmentData);
        localStorage.setItem(`appointments_${this.currentUser.id}`, JSON.stringify(appointments));

        // Close modal and refresh appointments list
        const modal = bootstrap.Modal.getInstance(document.getElementById('newAppointmentModal'));
        modal.hide();
        this.loadAppointments();
    }

    exportUserData() {
        const userData = {
            profile: this.currentUser,
            stats: JSON.parse(localStorage.getItem(`stats_${this.currentUser.id}`)),
            activities: JSON.parse(localStorage.getItem(`activities_${this.currentUser.id}`)),
            appointments: JSON.parse(localStorage.getItem(`appointments_${this.currentUser.id}`)),
            progress: JSON.parse(localStorage.getItem(`progress_${this.currentUser.id}`))
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `adhd_support_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importUserData(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    // Validate and merge imported data
                    if (this.validateImportedData(importedData)) {
                        this.mergeImportedData(importedData);
                        alert('Data imported successfully!');
                        window.location.reload();
                    }
                } catch (error) {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    }

    validateImportedData(data) {
        // Add validation logic here
        return true;
    }

    mergeImportedData(data) {
        // Merge imported data with existing data
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(`${key}_${this.currentUser.id}`, JSON.stringify(value));
        });
    }
}

// Initialize profile
document.addEventListener('DOMContentLoaded', () => {
    const profile = new Profile();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tabs
    const tabElements = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabElements.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('href');
            
            // Remove active class from all tabs and tab panes
            document.querySelectorAll('.profile-nav a').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('show', 'active');
            });
            
            // Add active class to clicked tab and its corresponding pane
            this.classList.add('active');
            const tabPane = document.querySelector(tabId);
            if (tabPane) {
                tabPane.classList.add('show', 'active');
            }
        });
    });
}); 