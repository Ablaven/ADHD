// Parents Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Resource Library Section
    const resourceLinks = {
        'understanding-adhd': {
            title: 'Understanding ADHD Guide',
            content: 'A comprehensive guide to understanding ADHD, its symptoms, and how it affects children.',
            downloadUrl: '/resources/understanding-adhd-guide.pdf'
        },
        'school-accommodation': {
            title: 'School Accommodation Tips',
            content: 'Practical strategies and tips for working with schools to ensure your child gets the support they need.',
            downloadUrl: '/resources/school-accommodation-guide.pdf'
        },
        'homework-strategies': {
            title: 'Homework Strategies',
            content: 'Effective methods to help your child stay focused and complete homework successfully.',
            downloadUrl: '/resources/homework-strategies-guide.pdf'
        },
        'executive-function': {
            title: 'Executive Function Support',
            content: 'Tools and techniques to help develop executive function skills.',
            downloadUrl: '/resources/executive-function-guide.pdf'
        },
        'daily-routines': {
            title: 'Daily Routine Templates',
            content: 'Customizable templates to create effective daily routines.',
            downloadUrl: '/resources/daily-routine-templates.pdf'
        },
        'behavior-tracking': {
            title: 'Behavior Tracking Charts',
            content: 'Tools for monitoring and encouraging positive behaviors.',
            downloadUrl: '/resources/behavior-tracking-charts.pdf'
        },
        'reward-system': {
            title: 'Reward System Guide',
            content: 'How to create and implement effective reward systems.',
            downloadUrl: '/resources/reward-system-guide.pdf'
        },
        'organization': {
            title: 'Organization Checklists',
            content: 'Checklists to help maintain organization at home and school.',
            downloadUrl: '/resources/organization-checklists.pdf'
        },
        'self-care': {
            title: 'Self-Care for Parents',
            content: 'Important strategies for maintaining your own well-being while supporting your child.',
            downloadUrl: '/resources/parent-self-care-guide.pdf'
        },
        'confidence': {
            title: 'Building Confidence',
            content: 'Techniques for building self-esteem and confidence in children with ADHD.',
            downloadUrl: '/resources/building-confidence-guide.pdf'
        },
        'frustration': {
            title: 'Managing Frustration',
            content: 'Strategies for handling frustration and emotional regulation.',
            downloadUrl: '/resources/managing-frustration-guide.pdf'
        },
        'communication': {
            title: 'Family Communication',
            content: 'Tips for effective family communication and understanding.',
            downloadUrl: '/resources/family-communication-guide.pdf'
        },
        'support-groups': {
            title: 'Local Support Groups',
            content: 'Directory of local ADHD support groups and resources.',
            downloadUrl: '/resources/local-support-directory.pdf'
        },
        'professional-directory': {
            title: 'Professional Directory',
            content: 'List of ADHD specialists and healthcare providers.',
            downloadUrl: '/resources/professional-directory.pdf'
        },
        'school-programs': {
            title: 'School Programs',
            content: 'Information about specialized school programs and services.',
            downloadUrl: '/resources/school-programs-guide.pdf'
        },
        'advocacy': {
            title: 'Advocacy Resources',
            content: 'Tools and information for advocating for your child\'s needs.',
            downloadUrl: '/resources/advocacy-guide.pdf'
        }
    };

    // Handle resource link clicks
    document.querySelectorAll('.resource-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceId = this.getAttribute('data-resource');
            const resource = resourceLinks[resourceId];
            
            if (!resource) {
                showResourceModal('Resource Coming Soon', 'This resource is currently being developed. Please check back later.');
                return;
            }

            if (!isAuthenticated()) {
                showAuthPrompt();
                return;
            }

            showResourceModal(resource.title, resource.content, resource.downloadUrl);
        });
    });

    // Workshop Registration
    document.querySelectorAll('.workshop-card .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isAuthenticated()) {
                showAuthPrompt();
                return;
            }

            const workshopTitle = this.closest('.workshop-card').querySelector('h3').textContent;
            const workshopDate = this.closest('.workshop-card').querySelector('.workshop-date').textContent;
            showWorkshopModal(workshopTitle, workshopDate);
        });
    });

    // Community Join Button
    document.querySelector('.support-network .btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!isAuthenticated()) {
            showAuthPrompt();
            return;
        }

        showCommunityModal();
    });

    // Resource Modal
    function showResourceModal(title, content, downloadUrl) {
        const modalHtml = `
            <div class="modal fade" id="resourceModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${content}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-purple" data-bs-dismiss="modal">Close</button>
                            <a href="${downloadUrl}" class="btn btn-purple" download>Download Resource</a>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('resourceModal'));
        modal.show();

        // Clean up modal after hiding
        document.getElementById('resourceModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Workshop Modal
    function showWorkshopModal(title, date) {
        const modalHtml = `
            <div class="modal fade" id="workshopModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Register for ${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Workshop Date: ${date}</p>
                            <form id="workshopRegistrationForm">
                                <div class="mb-3">
                                    <label class="form-label">Number of Participants</label>
                                    <select class="form-select" required>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Special Requirements</label>
                                    <textarea class="form-control" rows="3" placeholder="Any special requirements or questions?"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-purple" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-purple" onclick="submitWorkshopRegistration()">Confirm Registration</button>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('workshopModal'));
        modal.show();

        // Clean up modal after hiding
        document.getElementById('workshopModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Community Modal
    function showCommunityModal() {
        const modalHtml = `
            <div class="modal fade" id="communityModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Join Our Parent Community</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Welcome to our supportive parent community! Please select your preferences below:</p>
                            <form id="communityJoinForm">
                                <div class="mb-3">
                                    <label class="form-label">Your Child's Age Group</label>
                                    <select class="form-select" required>
                                        <option value="">Select age group</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="6-8">6-8 years</option>
                                        <option value="9-12">9-12 years</option>
                                        <option value="13-15">13-15 years</option>
                                        <option value="16+">16+ years</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Areas of Interest</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="education">
                                        <label class="form-check-label">Education Support</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="behavior">
                                        <label class="form-check-label">Behavior Management</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="social">
                                        <label class="form-check-label">Social Skills</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="emotional">
                                        <label class="form-check-label">Emotional Support</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Communication Preferences</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="email">
                                        <label class="form-check-label">Email Updates</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="newsletter">
                                        <label class="form-check-label">Monthly Newsletter</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="events">
                                        <label class="form-check-label">Event Notifications</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-purple" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-purple" onclick="submitCommunityJoin()">Join Community</button>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('communityModal'));
        modal.show();

        // Clean up modal after hiding
        document.getElementById('communityModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Auth Prompt Modal
    function showAuthPrompt() {
        const modalHtml = `
            <div class="modal fade" id="authPromptModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Sign In Required</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Please sign in or create an account to access this feature.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-purple" data-bs-dismiss="modal">Cancel</button>
                            <a href="/login.html" class="btn btn-purple">Sign In</a>
                            <a href="/signup.html" class="btn btn-purple">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('authPromptModal'));
        modal.show();

        // Clean up modal after hiding
        document.getElementById('authPromptModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Form submission handlers
    window.submitWorkshopRegistration = function() {
        // TODO: Implement workshop registration API call
        const modal = bootstrap.Modal.getInstance(document.getElementById('workshopModal'));
        modal.hide();
        showSuccessToast('Workshop registration successful! You will receive a confirmation email shortly.');
    };

    window.submitCommunityJoin = function() {
        // TODO: Implement community join API call
        const modal = bootstrap.Modal.getInstance(document.getElementById('communityModal'));
        modal.hide();
        showSuccessToast('Welcome to our community! You will receive a welcome email with next steps.');
    };

    // Success Toast
    function showSuccessToast(message) {
        const toastHtml = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast" role="alert">
                    <div class="toast-header">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        <strong class="me-auto">Success</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', toastHtml);
        const toast = new bootstrap.Toast(document.querySelector('.toast'));
        toast.show();

        // Clean up toast after hiding
        document.querySelector('.toast').addEventListener('hidden.bs.toast', function() {
            this.closest('.toast-container').remove();
        });
    }
}); 