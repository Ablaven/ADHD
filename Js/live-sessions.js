// Sample session data - Replace with actual API call
const sampleSessions = [
    {
        id: '1',
        type: 'Workshop',
        date: '2024-03-20',
        time: '14:00',
        timeZone: 'EST',
        duration: 90,
        title: 'Time Management Strategies',
        description: 'Learn practical techniques for better time management and organization.',
        instructor: 'Dr. Sarah Johnson',
        spotsTotal: 25,
        spotsLeft: 20
    },
    {
        id: '2',
        type: 'Group Therapy',
        date: '2024-03-22',
        time: '18:00',
        timeZone: 'EST',
        duration: 90,
        title: 'Adult ADHD Support Group',
        description: 'Weekly support group for adults dealing with ADHD challenges.',
        instructor: 'Dr. Michael Chen',
        spotsTotal: 8,
        spotsLeft: 3
    },
    {
        id: '3',
        type: 'Q&A',
        date: '2024-03-25',
        time: '19:00',
        timeZone: 'EST',
        duration: 60,
        title: 'Ask the Experts: Medication',
        description: 'Open Q&A about ADHD medication with our expert panel.',
        instructor: 'Expert Panel',
        spotsTotal: 100,
        spotsLeft: 50
    }
];

class LiveSessions {
    constructor() {
        this.sessions = [];
        this.currentFilter = 'All';
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Get current user from Auth
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        
        // In the future, replace with actual API call
        this.sessions = sampleSessions;
        
        // Load user's reservations
        this.loadUserReservations();
        
        this.renderSessions();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    loadUserReservations() {
        if (this.currentUser) {
            this.userReservations = JSON.parse(localStorage.getItem(`reservations_${this.currentUser.id}`)) || [];
        } else {
            this.userReservations = [];
        }
    }

    saveUserReservations() {
        if (this.currentUser) {
            localStorage.setItem(`reservations_${this.currentUser.id}`, JSON.stringify(this.userReservations));
        }
    }

    initializeAnimations() {
        // Add active class to trigger initial animations
        const sessionsGrid = document.querySelector('.sessions-grid');
        if (!sessionsGrid) return;

        // Add active class after a short delay to ensure smooth animation
        setTimeout(() => {
            sessionsGrid.classList.add('active');
            // Stagger the card animations
            const cards = sessionsGrid.querySelectorAll('.session-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    renderSessions(filter = 'All') {
        const sessionsGrid = document.querySelector('.sessions-grid');
        if (!sessionsGrid) return;

        // Filter sessions
        const filteredSessions = filter === 'All' 
            ? this.sessions 
            : this.sessions.filter(session => session.type === filter);

        // Remove active class before updating content
        sessionsGrid.classList.remove('active');

        // Update grid content
        sessionsGrid.innerHTML = filteredSessions.map(session => {
            const { month, day, time } = this.formatDateTime(session.date, session.time, session.timeZone);
            const isReserved = this.userReservations?.some(r => r.sessionId === session.id);
            
            return `
                <div class="session-card" data-session-id="${session.id}">
                    <div class="session-type">
                        <span class="badge bg-purple">${session.type}</span>
                    </div>
                    <div class="session-datetime">
                        <div class="date">
                            <span class="month">${month}</span>
                            <span class="day">${day}</span>
                        </div>
                        <div class="time">${time}</div>
                    </div>
                    <div class="session-info">
                        <h3>${session.title}</h3>
                        <p>${session.description}</p>
                        <div class="session-meta">
                            <span><i class="fas fa-user"></i> ${session.instructor}</span>
                            <span><i class="fas fa-users"></i> ${session.spotsLeft} spots left</span>
                        </div>
                    </div>
                    <div class="session-actions">
                        ${isReserved 
                            ? `<button class="btn btn-outline-danger cancel-reservation">Cancel Reservation</button>`
                            : `<button class="btn btn-purple view-session">View Details & Reserve</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');

        // Re-add active class and trigger animations
        setTimeout(() => {
            sessionsGrid.classList.add('active');
            const cards = sessionsGrid.querySelectorAll('.session-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.session-filters .btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Update filter and re-render
                const filter = e.target.textContent.trim();
                this.currentFilter = filter;
                this.renderSessions(filter);
            });
        });

        // Session buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.session-actions .view-session')) {
                this.handleViewSession(e);
            } else if (e.target.matches('.session-actions .cancel-reservation')) {
                this.handleCancelReservation(e);
            } else if (e.target.matches('#confirmReservationBtn')) {
                this.confirmReservation();
            }
        });
    }

    formatDateTime(date, time, timeZone) {
        const sessionDate = new Date(date + 'T' + time);
        const month = sessionDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const day = sessionDate.getDate();
        const formattedTime = sessionDate.toLocaleString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
        return {
            month,
            day,
            time: `${formattedTime} ${timeZone}`
        };
    }

    async handleViewSession(e) {
        const sessionCard = e.target.closest('.session-card');
        const sessionId = sessionCard.dataset.sessionId;
        const session = this.sessions.find(s => s.id === sessionId);
        
        if (!session) return;

        // Store the session being viewed/reserved
        this.sessionToReserve = session;
        
        // Check if user is authenticated
        if (!this.currentUser) {
            // Show login modal
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
            return;
        }

        // Show session details modal with reservation option
        const detailsModal = new bootstrap.Modal(document.getElementById('sessionDetailsModal'));
        const modalBody = document.getElementById('sessionDetailsBody');
        const modalTitle = document.getElementById('sessionDetailsModalLabel');
        const modalFooter = document.querySelector('#sessionDetailsModal .modal-footer');
        
        modalTitle.textContent = session.title;
        modalBody.innerHTML = `
            <div class="session-details">
                <div class="session-overview mb-4">
                    <div class="session-time-info">
                        <h5><i class="fas fa-calendar-alt me-2"></i>Session Time</h5>
                        <p>Date: ${new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p>Time: ${session.time} ${session.timeZone}</p>
                        <p>Duration: ${session.duration} minutes</p>
                    </div>
                </div>
                <div class="mb-4">
                    <h5><i class="fas fa-info-circle me-2"></i>About this Session</h5>
                    <p>${session.description}</p>
                </div>
                <div class="mb-4">
                    <h5><i class="fas fa-user me-2"></i>Session Information</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-chalkboard-teacher me-2"></i>Instructor: ${session.instructor}</li>
                        <li><i class="fas fa-users me-2"></i>Spots Left: ${session.spotsLeft} of ${session.spotsTotal}</li>
                        <li><i class="fas fa-tag me-2"></i>Session Type: ${session.type}</li>
                    </ul>
                </div>
                <div class="mb-4">
                    <h5><i class="fas fa-clipboard-list me-2"></i>What to Expect</h5>
                    <ul>
                        <li>Interactive discussion and exercises</li>
                        <li>Q&A opportunities</li>
                        <li>Resources and materials provided</li>
                        <li>Recording available for 30 days (for workshops)</li>
                    </ul>
                </div>
                <div class="reservation-agreement">
                    <h5><i class="fas fa-handshake me-2"></i>Reservation Agreement</h5>
                    <p>By reserving a spot, you agree to:</p>
                    <ul>
                        <li>Attend the session at the scheduled time</li>
                        <li>Cancel at least 24 hours in advance if unable to attend</li>
                        <li>Follow the session guidelines and code of conduct</li>
                    </ul>
                </div>
            </div>
        `;

        modalFooter.innerHTML = `
            <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-purple" id="confirmReservationBtn">Reserve Spot</button>
        `;
        
        detailsModal.show();
    }

    async confirmReservation() {
        if (!this.sessionToReserve || !this.currentUser) return;

        try {
            // Add reservation
            const reservation = {
                sessionId: this.sessionToReserve.id,
                userId: this.currentUser.id,
                timestamp: new Date().toISOString()
            };

            // Update spots left
            const sessionIndex = this.sessions.findIndex(s => s.id === this.sessionToReserve.id);
            if (sessionIndex !== -1) {
                this.sessions[sessionIndex].spotsLeft--;
            }

            // Add to user's reservations
            this.userReservations.push(reservation);
            this.saveUserReservations();

            // Close modal
            const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmSessionModal'));
            confirmModal.hide();

            // Re-render sessions
            this.renderSessions(this.currentFilter);

            // Show success message
            alert('Session reserved successfully! Check your email for confirmation.');
        } catch (error) {
            console.error('Error reserving session:', error);
            alert('Failed to reserve session. Please try again.');
        }
    }

    async handleCancelReservation(e) {
        const sessionCard = e.target.closest('.session-card');
        const sessionId = sessionCard.dataset.sessionId;
        
        if (confirm('Are you sure you want to cancel this reservation?')) {
            try {
                // Remove reservation
                this.userReservations = this.userReservations.filter(r => r.sessionId !== sessionId);
                this.saveUserReservations();

                // Update spots left
                const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
                if (sessionIndex !== -1) {
                    this.sessions[sessionIndex].spotsLeft++;
                }

                // Re-render sessions
                this.renderSessions(this.currentFilter);

                alert('Reservation cancelled successfully.');
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                alert('Failed to cancel reservation. Please try again.');
            }
        }
    }

    showSessionDetails(e) {
        const sessionCard = e.target.closest('.session-card');
        const sessionId = sessionCard.dataset.sessionId;
        const session = this.sessions.find(s => s.id === sessionId);
        
        if (!session) return;

        // Populate and show details modal
        const detailsModal = new bootstrap.Modal(document.getElementById('sessionDetailsModal'));
        const modalBody = document.getElementById('sessionDetailsBody');
        
        modalBody.innerHTML = `
            <div class="session-details">
                <div class="mb-4">
                    <h5>About this Session</h5>
                    <p>${session.description}</p>
                </div>
                <div class="mb-4">
                    <h5>Session Information</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-clock me-2"></i>Duration: ${session.duration} minutes</li>
                        <li><i class="fas fa-user me-2"></i>Instructor: ${session.instructor}</li>
                        <li><i class="fas fa-users me-2"></i>Spots Left: ${session.spotsLeft} of ${session.spotsTotal}</li>
                    </ul>
                </div>
                <div class="mb-4">
                    <h5>What to Expect</h5>
                    <ul>
                        <li>Interactive discussion and exercises</li>
                        <li>Q&A opportunities</li>
                        <li>Resources and materials provided</li>
                        <li>Recording available for 30 days (for workshops)</li>
                    </ul>
                </div>
            </div>
        `;
        
        detailsModal.show();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const liveSessions = new LiveSessions();
}); 