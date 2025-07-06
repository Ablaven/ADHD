// Blog post data
const blogPosts = [
    {
        id: 1,
        title: "Time Management Strategies for ADHD",
        excerpt: "Practical tips and techniques to help manage time effectively with ADHD. Learn how to stay organized and focused.",
        category: "tips-strategies",
        categoryDisplay: "Tips & Strategies",
        image: "Images/65853cb72d33d.jpg",
        date: "May 10, 2024",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Latest ADHD Research Findings",
        excerpt: "New discoveries and insights from recent ADHD studies and research. Stay informed about the latest developments.",
        category: "research-studies",
        categoryDisplay: "Research & Studies",
        image: "Images/65853cb72d33d.jpg",
        date: "May 8, 2024",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "ADHD-Friendly Home Organization",
        excerpt: "Create an organized living space that works with your ADHD, not against it. Practical tips for parents.",
        category: "parent-resources",
        categoryDisplay: "Parent Resources",
        image: "Images/65853cb72d33d.jpg",
        date: "May 5, 2024",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Understanding ADHD Medications",
        excerpt: "A comprehensive guide to different ADHD medications, their effects, and what to expect when starting treatment.",
        category: "research-studies",
        categoryDisplay: "Research & Studies",
        image: "Images/65853cb72d33d.jpg",
        date: "May 3, 2024",
        readTime: "8 min read"
    },
    {
        id: 5,
        title: "Success Story: From Struggle to Strength",
        excerpt: "Read about Sarah's journey of overcoming ADHD challenges and achieving her academic goals.",
        category: "success-stories",
        categoryDisplay: "Success Stories",
        image: "Images/65853cb72d33d.jpg",
        date: "May 1, 2024",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "ADHD in the Workplace: Tips for Success",
        excerpt: "Essential strategies for managing ADHD symptoms and thriving in your professional life.",
        category: "tips-strategies",
        categoryDisplay: "Tips & Strategies",
        image: "Images/65853cb72d33d.jpg",
        date: "April 28, 2024",
        readTime: "6 min read"
    },
    {
        id: 7,
        title: "Supporting Your ADHD Child in School",
        excerpt: "Guide for parents on working with teachers and creating an effective learning environment.",
        category: "parent-resources",
        categoryDisplay: "Parent Resources",
        image: "Images/65853cb72d33d.jpg",
        date: "April 25, 2024",
        readTime: "7 min read"
    },
    {
        id: 8,
        title: "Breaking Through: An Adult ADHD Journey",
        excerpt: "John shares his experience of being diagnosed with ADHD as an adult and finding his path to success.",
        category: "success-stories",
        categoryDisplay: "Success Stories",
        image: "Images/65853cb72d33d.jpg",
        date: "April 22, 2024",
        readTime: "5 min read"
    },
    {
        id: 9,
        title: "New Study: ADHD and Sleep Patterns",
        excerpt: "Recent research reveals the connection between ADHD and sleep disorders, with practical solutions.",
        category: "research-studies",
        categoryDisplay: "Research & Studies",
        image: "Images/65853cb72d33d.jpg",
        date: "April 20, 2024",
        readTime: "6 min read"
    }
];

// Function to create a blog post card
function createBlogPostCard(post) {
    return `
        <div class="col-lg-4 col-md-6 mb-4 blog-post" data-category="${post.category}">
            <article class="blog-card h-100" style="background-color: var(--purple-800); border-radius: 15px; overflow: hidden;">
                <img src="${post.image}" alt="${post.title}" class="w-100" style="height: 200px; object-fit: cover;">
                <div class="p-4">
                    <span class="badge bg-purple mb-2">${post.categoryDisplay}</span>
                    <h4 style="color: var(--purple-100);">${post.title}</h4>
                    <p style="color: var(--purple-300);">${post.excerpt}</p>
                    <div class="mt-3 d-flex justify-content-between align-items-center">
                        <small style="color: var(--purple-200);">${post.date} • ${post.readTime}</small>
                        <a href="blog-post.html?id=${post.id}" class="btn btn-sm btn-outline-purple">Read More</a>
                    </div>
                </div>
            </article>
        </div>
    `;
}

// Function to display blog posts
function displayBlogPosts(posts = blogPosts) {
    const blogGrid = document.querySelector('.blog-posts .row');
    blogGrid.innerHTML = posts.map(post => createBlogPostCard(post)).join('');
}

// Function to filter blog posts by category
function filterBlogPosts(category) {
    const filteredPosts = category === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === category);
    displayBlogPosts(filteredPosts);

    // Update active button state
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('btn-purple');
        btn.classList.add('btn-outline-purple');
    });
    document.querySelector(`[data-category="${category}"]`).classList.remove('btn-outline-purple');
    document.querySelector(`[data-category="${category}"]`).classList.add('btn-purple');
}

// Initialize blog functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Display all posts initially
    displayBlogPosts();

    // Add click event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterBlogPosts(category);
        });
    });

    // Handle search functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPosts = blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm)
        );
        displayBlogPosts(filteredPosts);
    });

    // Handle load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real application, this would load more posts from the server
            alert('In a real application, this would load more posts from the server.');
        });
    }
}); 