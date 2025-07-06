// Blog post data (in a real application, this would come from a server)
const blogPostsData = {
    1: {
        title: "Time Management Strategies for ADHD",
        excerpt: "Practical tips and techniques to help manage time effectively with ADHD. Learn how to stay organized and focused.",
        content: `
            <p>Living with ADHD can make time management particularly challenging. The good news is that with the right strategies and tools, you can develop effective ways to manage your time and stay organized. Here are some proven techniques that can help:</p>

            <h2>1. Break Tasks into Smaller Chunks</h2>
            <p>Large tasks can feel overwhelming. Breaking them down into smaller, manageable pieces makes them less daunting and easier to complete. Try these approaches:</p>
            <ul>
                <li><strong>Room-by-Room Organization:</strong> Instead of "clean the house," break it into specific rooms and tasks within each room</li>
                <li><strong>Project Management:</strong> Rather than "write a report," break it into outline, research, draft sections, and final review</li>
                <li><strong>Time Blocking:</strong> Break study sessions into 25-minute focused periods with 5-minute breaks (Pomodoro Technique)</li>
            </ul>

            <h2>2. Use Visual Time Management Tools</h2>
            <p>Visual aids can help make time more concrete and easier to manage. Consider implementing these tools:</p>
            <ul>
                <li><strong>Time-blocking Calendars:</strong> Color-code different types of activities and create dedicated blocks for focused work</li>
                <li><strong>Visual Timers:</strong> Use countdown timers or time visualization apps to stay aware of time passing</li>
                <li><strong>Color-coded Schedules:</strong> Assign different colors to various activities to make your schedule more visually engaging</li>
            </ul>

            <h2>3. Create External Structure</h2>
            <p>External structures help compensate for executive function challenges. Implement these strategies:</p>
            <ul>
                <li><strong>Daily Routines:</strong> Establish consistent morning and evening routines to automate regular tasks</li>
                <li><strong>Digital Assistance:</strong> Use reminder apps and alarms to stay on track throughout the day</li>
                <li><strong>Schedule Consistency:</strong> Maintain regular times for important activities like work, exercise, and meals</li>
            </ul>

            <h2>4. Implement the Two-Minute Rule</h2>
            <p>If a task will take less than two minutes, do it immediately rather than putting it off. This simple rule can help you:</p>
            <ul>
                <li><strong>Prevent Task Buildup:</strong> Handle small tasks before they accumulate and become overwhelming</li>
                <li><strong>Build Momentum:</strong> Complete quick wins to maintain motivation throughout the day</li>
                <li><strong>Reduce Mental Load:</strong> Clear your mind of small tasks to focus on bigger priorities</li>
            </ul>

            <h2>5. Use Technology Wisely</h2>
            <p>Modern technology offers many tools to help with time management. Here are some essential tools:</p>
            <ul>
                <li><strong>Calendar Apps:</strong> Use smart calendars that sync across devices and send timely reminders</li>
                <li><strong>Task Management:</strong> Implement digital task lists with priority settings and deadlines</li>
                <li><strong>Focus Apps:</strong> Use applications that block distractions during dedicated work periods</li>
            </ul>
        `,
        category: "tips-strategies",
        categoryDisplay: "Tips & Strategies",
        image: "Images/65853cb72d33d.jpg",
        date: "May 10, 2024",
        readTime: "5 min read",
        author: {
            name: "Dr. Sarah Johnson",
            image: "Images/65853cb72d33d.jpg",
            bio: "Dr. Sarah Johnson is a clinical psychologist specializing in ADHD treatment with over 15 years of experience. She is passionate about helping individuals develop practical strategies for managing ADHD.",
            social: {
                twitter: "#",
                linkedin: "#",
                instagram: "#"
            }
        },
        video: {
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
            title: "Time Management Strategies Explained",
            description: "Watch Dr. Sarah Johnson demonstrate these time management techniques and provide additional tips for ADHD management."
        },
        tags: ["Time Management", "ADHD Strategies", "Productivity", "Organization"],
        relatedPosts: [2, 6, 7]
    },
    2: {
        title: "Latest ADHD Research Findings",
        excerpt: "New discoveries and insights from recent ADHD studies and research. Stay informed about the latest developments.",
        content: `
            <p>Recent research has revealed fascinating new insights into ADHD, its causes, and potential treatments. Here's what the latest studies tell us:</p>

            <h2>1. Genetic Factors in ADHD</h2>
            <p>New genetic research has identified several key findings:</p>
            <ul>
                <li><strong>Multiple Genes:</strong> Research has identified over 100 genetic variants associated with ADHD</li>
                <li><strong>Hereditary Patterns:</strong> Studies show ADHD has a heritability rate of approximately 74%</li>
                <li><strong>Gene-Environment Interaction:</strong> Research reveals how genetic factors interact with environmental influences</li>
            </ul>

            <h2>2. Brain Structure and Function</h2>
            <p>Advanced imaging studies have shown:</p>
            <ul>
                <li><strong>Neural Networks:</strong> Differences in connectivity patterns between various brain regions</li>
                <li><strong>Brain Development:</strong> Unique patterns of brain maturation in individuals with ADHD</li>
                <li><strong>Executive Function:</strong> New understanding of how ADHD affects decision-making processes</li>
            </ul>

            <h2>3. Treatment Effectiveness</h2>
            <p>Recent studies on treatment approaches show:</p>
            <ul>
                <li><strong>Medication Timing:</strong> New insights into optimal medication scheduling and dosing</li>
                <li><strong>Behavioral Interventions:</strong> Evidence supporting new therapeutic approaches</li>
                <li><strong>Combined Treatments:</strong> Research on the synergy between different treatment methods</li>
            </ul>
        `,
        category: "research-studies",
        categoryDisplay: "Research & Studies",
        image: "Images/65853cb72d33d.jpg",
        date: "May 8, 2024",
        readTime: "7 min read",
        author: {
            name: "Dr. Michael Chen",
            image: "Images/65853cb72d33d.jpg",
            bio: "Dr. Michael Chen is a neuroscience researcher specializing in ADHD studies. He has published numerous papers on brain development and ADHD.",
            social: {
                twitter: "#",
                linkedin: "#",
                instagram: "#"
            }
        },
        video: {
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
            title: "Understanding ADHD Research",
            description: "Dr. Chen explains the latest research findings and their implications for ADHD treatment and management."
        },
        tags: ["Research", "Neuroscience", "ADHD Studies", "Treatment"],
        relatedPosts: [1, 4, 9]
    }
    // Add more blog posts with similar detailed content...
};

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to create related post card
function createRelatedPostCard(post) {
    return `
        <div class="col-lg-4 col-md-6 mb-4">
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

// Function to load blog post content
function loadBlogPost() {
    const postId = getUrlParameter('id');
    if (!postId || !blogPostsData[postId]) {
        window.location.href = 'blog.html';
        return;
    }

    const post = blogPostsData[postId];

    // Update page title
    document.title = `${post.title} - ADHD Support Platform`;

    // Update meta description
    document.querySelector('meta[name="description"]').content = post.excerpt;

    // Update breadcrumb
    document.getElementById('post-category').textContent = post.categoryDisplay;

    // Update post header
    document.getElementById('post-category-badge').textContent = post.categoryDisplay;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author-img').src = post.author.image;
    document.getElementById('post-author-img').alt = post.author.name;
    document.getElementById('post-author').textContent = post.author.name;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-read-time').textContent = post.readTime;

    // Update featured image
    document.getElementById('post-image').src = post.image;
    document.getElementById('post-image').alt = post.title;

    // Update post content
    document.getElementById('post-content').innerHTML = post.content;

    // Update video section
    if (post.video) {
        document.getElementById('post-video').innerHTML = `
            <iframe src="${post.video.url}" 
                    title="${post.video.title}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;
        document.getElementById('video-title').textContent = post.video.title;
        document.getElementById('video-description').textContent = post.video.description;
    }

    // Update tags
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<span class="badge bg-purple">${tag}</span>`
    ).join('');

    // Update author bio
    document.getElementById('author-img').src = post.author.image;
    document.getElementById('author-img').alt = post.author.name;
    document.getElementById('author-name').textContent = post.author.name;
    document.getElementById('author-bio').textContent = post.author.bio;

    // Update related posts
    const relatedPostsContainer = document.getElementById('related-posts');
    relatedPostsContainer.innerHTML = post.relatedPosts
        .map(id => blogPostsData[id])
        .map(relatedPost => createRelatedPostCard({ ...relatedPost, id }))
        .join('');

    // Handle share buttons
    document.querySelectorAll('.post-share a').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(post.title);
            
            if (button.querySelector('.fa-facebook-f')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            } else if (button.querySelector('.fa-twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
            } else if (button.querySelector('.fa-linkedin-in')) {
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, '_blank');
            }
        });
    });

    // Handle copy link button
    document.getElementById('copyLink').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadBlogPost); 