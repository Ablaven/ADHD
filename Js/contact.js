document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form data
            if (!validateForm(formData)) {
                return;
            }
            
            // Show success message (in a real application, this would send data to a server)
            showMessage('Thank you for your message! We will get back to you soon.', 'success');
            
            // Clear form
            contactForm.reset();
        });
    }
    
    function validateForm(data) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.name.trim()) {
            showMessage('Please enter your name.', 'error');
            isValid = false;
        }
        
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            isValid = false;
        }
        
        if (!data.subject) {
            showMessage('Please select a subject.', 'error');
            isValid = false;
        }
        
        if (!data.message.trim()) {
            showMessage('Please enter your message.', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        messageDiv.role = 'alert';
        messageDiv.textContent = message;
        
        // Add message to form
        const formContent = document.querySelector('.contact-form-content');
        formContent.insertBefore(messageDiv, contactForm);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}); 