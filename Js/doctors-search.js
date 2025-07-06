// DOM Elements
const searchInput = document.getElementById('doctorSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const experienceFilter = document.getElementById('experienceFilter');
const ratingFilter = document.getElementById('ratingFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const doctorsContainer = document.getElementById('doctorsGrid');
const noResultsMessage = document.getElementById('noResults');
const clearFiltersBtn = document.getElementById('clearFilters');
const loadMoreBtn = document.getElementById('loadMore');
const featuredDoctorsGrid = document.querySelector('.featured-doctors-grid');

// Carousel Elements
const carousel = document.getElementById('doctorsCarousel');
const carouselTrack = carousel?.querySelector('.carousel-track');
const carouselCards = carousel?.querySelectorAll('.carousel-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = carousel?.querySelectorAll('.indicator');

// Carousel State
let currentSlide = 0;
let isAnimating = false;
let autoplayInterval;
let touchStartX = 0;
let touchEndX = 0;

// State
let currentPage = 1;
const doctorsPerPage = 9;
let filteredDoctors = [];

// Initialize filters and featured doctors
function initializeFilters() {
    // Get unique specialties
    const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
    
    // Populate specialty filter
    specialtyFilter.innerHTML = `
        <option value="">All Specialties</option>
        ${specialties.map(specialty => `<option value="${specialty}">${specialty}</option>`).join('')}
    `;

    // Initialize featured doctors
    const featuredDoctors = doctors
        .filter(doctor => doctor.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    if (featuredDoctorsGrid) {
        featuredDoctorsGrid.innerHTML = featuredDoctors.map(createDoctorCard).join('');
    }
}

// Render doctor card
function createDoctorCard(doctor) {
    const statusClass = doctor.status === 'online' ? 'text-success' : 'text-warning';
    const statusText = doctor.status === 'online' ? 'Available' : 'Busy';
    
    return `
        <div class="doctor-card" data-doctor-id="${doctor.id}">
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='./Images/default-doctor.jpg'">
                <span class="status-badge ${statusClass}">
                    <i class="fas fa-circle"></i> ${statusText}
                </span>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialty}</p>
                <div class="rating">
                    ${getRatingStars(doctor.rating)}
                    <span class="rating-number">${doctor.rating}</span>
                </div>
                <p class="experience"><i class="fas fa-clock"></i> ${doctor.experience}</p>
                <div class="specializations">
                    ${doctor.specializations.map(spec => `<span class="badge bg-purple">${spec}</span>`).join('')}
                </div>
                <button class="btn btn-purple w-100" onclick="openBookingModal(${doctor.id})">Book Appointment</button>
            </div>
        </div>
    `;
}

// Generate rating stars
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Filter and display doctors
function filterDoctors() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSpecialty = specialtyFilter.value;
    const selectedExperience = parseInt(experienceFilter.value) || 0;
    const selectedRating = parseFloat(ratingFilter.value) || 0;
    const selectedAvailability = availabilityFilter.value;
    
    filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
                            doctor.specialty.toLowerCase().includes(searchTerm) ||
                            doctor.specializations.some(spec => spec.toLowerCase().includes(searchTerm));
        
        const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
        const matchesExperience = parseInt(doctor.experience) >= selectedExperience;
        const matchesRating = doctor.rating >= selectedRating;
        const matchesAvailability = !selectedAvailability || doctor.status === selectedAvailability;
        
        return matchesSearch && matchesSpecialty && matchesExperience && matchesRating && matchesAvailability;
    });
    
    currentPage = 1;
    displayDoctors();
}

// Display doctors with pagination
function displayDoctors() {
    const start = (currentPage - 1) * doctorsPerPage;
    const end = start + doctorsPerPage;
    const doctorsToShow = filteredDoctors.slice(start, end);
    
    if (filteredDoctors.length === 0) {
        doctorsContainer.innerHTML = '';
        noResultsMessage.classList.remove('d-none');
        loadMoreBtn.classList.add('d-none');
    } else {
        noResultsMessage.classList.add('d-none');
        doctorsContainer.innerHTML = doctorsToShow.map(createDoctorCard).join('');
        
        // Show/hide load more button
        if (end < filteredDoctors.length) {
            loadMoreBtn.classList.remove('d-none');
        } else {
            loadMoreBtn.classList.add('d-none');
        }
    }
}

// Load more doctors
function loadMore() {
    currentPage++;
    displayDoctors();
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    specialtyFilter.value = '';
    experienceFilter.value = '';
    ratingFilter.value = '';
    availabilityFilter.value = '';
    filterDoctors();
}

// Open booking modal
function openBookingModal(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const bookingDoctorInfo = document.querySelector('.booking-doctor-info');
    bookingDoctorInfo.innerHTML = `
        <div class="booking-doctor-image">
            <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='./Images/default-doctor.jpg'">
        </div>
        <div class="booking-doctor-details">
            <h4>${doctor.name}</h4>
            <p>${doctor.specialty}</p>
            <div class="rating">
                ${getRatingStars(doctor.rating)}
                <span class="rating-number">${doctor.rating}</span>
            </div>
        </div>
    `;

    // Populate time slots based on availability
    const timeSelect = document.getElementById('appointmentTime');
    const timeSlots = generateTimeSlots();
    timeSelect.innerHTML = `
        <option value="">Select time...</option>
        ${timeSlots.map(time => `<option value="${time}">${time}</option>`).join('')}
    `;

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('appointmentDate').min = tomorrow.toISOString().split('T')[0];

    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

// Generate time slots
function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would typically send the booking data to your backend
    const formData = {
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        type: document.getElementById('appointmentType').value,
        notes: document.getElementById('appointmentNotes').value
    };
    
    console.log('Booking submitted:', formData);
    
    // Show success message
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();
    
    // You can show a success toast or alert here
    alert('Appointment booked successfully!');
});

// Initialize carousel
function initializeCarousel() {
    if (!carousel) return;

    // Set up initial state
    updateCarousel();
    startAutoplay();

    // Event Listeners
    prevBtn?.addEventListener('click', () => {
        if (isAnimating) return;
        currentSlide = (currentSlide - 1 + carouselCards.length) % carouselCards.length;
        updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
        if (isAnimating) return;
        currentSlide = (currentSlide + 1) % carouselCards.length;
        updateCarousel();
    });

    indicators?.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (isAnimating || currentSlide === index) return;
            currentSlide = index;
            updateCarousel();
        });
    });

    // Touch events for mobile swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    });

    carousel.addEventListener('touchmove', (e) => {
        if (isAnimating) return;
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                currentSlide = (currentSlide + 1) % carouselCards.length;
            } else {
                currentSlide = (currentSlide - 1 + carouselCards.length) % carouselCards.length;
            }
            updateCarousel();
            touchStartX = touchEndX;
        }
    });

    carousel.addEventListener('touchend', () => {
        startAutoplay();
    });

    // Mouse events
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

// Update carousel state
function updateCarousel() {
    if (!carousel || !carouselTrack || !carouselCards) return;

    isAnimating = true;
    
    // Update track position
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active states
    carouselCards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSlide);
        card.setAttribute('aria-hidden', index !== currentSlide);
    });

    // Update indicators
    indicators?.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
        indicator.setAttribute('aria-selected', index === currentSlide);
    });

    // Reset animation flag
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Autoplay functionality
function startAutoplay() {
    if (!carousel) return;
    stopAutoplay();
    autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselCards.length;
        updateCarousel();
    }, 5000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeCarousel();
    filterDoctors(); // Show all doctors initially
    
    // Add event listeners for filters
    searchInput.addEventListener('input', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);
    experienceFilter.addEventListener('change', filterDoctors);
    ratingFilter.addEventListener('change', filterDoctors);
    availabilityFilter.addEventListener('change', filterDoctors);
    clearFiltersBtn.addEventListener('click', clearFilters);
    loadMoreBtn.addEventListener('click', loadMore);
}); 