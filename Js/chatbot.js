document.addEventListener('DOMContentLoaded', function() {
    const chatBot = document.getElementById('chatBot');
    const chatBotToggle = document.getElementById('chatBotToggle');
    const chatBotClose = document.getElementById('chatBotClose');
    const chatBotMessages = document.getElementById('chatBotMessages');
    const chatBotInput = document.getElementById('chatBotInput');
    const chatBotSend = document.getElementById('chatBotSend');

    // Enhanced chat context to maintain conversation state
    let conversationContext = {
        lastTopic: null,
        followUpExpected: false,
        questionCount: 0,
        userPreferences: {},
        conversationHistory: [],
        lastResponseCategory: null
    };

    // Expanded knowledge base with more specific patterns and contextual responses
    const responses = {
        greeting: {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'help', 'start', 'begin'],
            responses: [
                {
                    text: "Hello! I'm your ADHD Support Assistant. How can I help you today?\n\n1. Learn about ADHD\n2. Find support resources\n3. Explore treatment options\n4. Get parenting guidance\n5. Discover educational strategies\n6. Schedule an appointment\n7. Access emergency support\n\nJust type the number or describe what you need!",
                    followUp: true
                }
            ],
            followUps: {
                "1": "symptoms",
                "2": "support",
                "3": "treatment",
                "4": "children",
                "5": "teachers",
                "6": "appointment",
                "7": "emergency"
            }
        },
        symptoms: {
            patterns: ['symptoms', 'signs', 'do i have adhd', 'adhd signs', 'diagnose', 'test', 'assessment', '1', 'learn about adhd'],
            responses: [
                {
                    text: "ADHD manifests differently in everyone. What specific aspect interests you?\n\n1. Inattention symptoms\n2. Hyperactivity symptoms\n3. Impulsivity symptoms\n4. Adult ADHD\n5. Childhood ADHD\n6. Take our pre-assessment\n7. Find a diagnostic specialist",
                    followUp: true
                }
            ],
            followUps: {
                "1": "inattention",
                "2": "hyperactivity",
                "3": "impulsivity",
                "4": "adult_adhd",
                "5": "child_adhd",
                "6": "assessment",
                "7": "specialist"
            }
        },
        inattention: {
            patterns: ['inattention', 'focus', 'attention', 'concentrate', 'distract', 'forgetful', '1'],
            responses: [
                {
                    text: "Common inattention symptoms include:\n\n• Difficulty maintaining focus\n• Missing important details\n• Problems with organization\n• Frequently losing items\n• Easily distracted\n• Trouble following instructions\n• Poor time management\n• Difficulty completing tasks\n\nWould you like to:\n1. Learn coping strategies\n2. Schedule an assessment\n3. Join our focus skills workshop\n4. Read success stories\n5. Get workplace accommodation tips",
                    followUp: true
                }
            ],
            followUps: {
                "1": "coping_strategies",
                "2": "assessment",
                "3": "workshops",
                "4": "success_stories",
                "5": "workplace"
            }
        },
        coping_strategies: {
            patterns: ['cope', 'strategy', 'strategies', 'manage', 'tips', '1'],
            responses: [
                {
                    text: "Here are effective strategies for managing inattention:\n\n1. Time Management:\n• Use timers and alarms\n• Break tasks into smaller chunks\n• Implement the Pomodoro Technique\n\n2. Organization:\n• Create structured routines\n• Use digital calendars\n• Maintain designated spaces\n\n3. Focus Enhancement:\n• Minimize distractions\n• Use noise-canceling headphones\n• Practice mindfulness\n\nWould you like to:\n1. Learn more about any strategy\n2. Get personalized recommendations\n3. Try our focus training program\n4. Connect with an ADHD coach",
                    followUp: true
                }
            ],
            followUps: {
                "1": "strategy_details",
                "2": "personalized_plan",
                "3": "training_program",
                "4": "coaching"
            }
        },
        hyperactivity: {
            patterns: ['hyperactivity', 'fidget', 'restless', 'energy', 'moving', '2'],
            responses: [
                {
                    text: "Hyperactivity symptoms can include:\n\n• Constant motion or fidgeting\n• Difficulty sitting still\n• Excessive talking\n• Always 'on the go'\n• Trouble with quiet activities\n• Racing thoughts\n• Internal restlessness\n\nHow would you like to address this?\n1. Physical activity strategies\n2. Workplace accommodations\n3. Relaxation techniques\n4. Energy channeling methods\n5. Speak with a specialist",
                    followUp: true
                }
            ],
            followUps: {
                "1": "physical_strategies",
                "2": "workplace",
                "3": "relaxation",
                "4": "energy_management",
                "5": "specialist"
            }
        },
        treatment: {
            patterns: ['treatment', 'medication', 'therapy', 'help', 'manage', '3', 'explore treatment'],
            responses: [
                {
                    text: "ADHD treatment is personalized to each individual. Let's explore your options:\n\n1. Medication approaches\n2. Behavioral therapy\n3. Cognitive training\n4. Lifestyle modifications\n5. Alternative treatments\n6. Combined approaches\n7. Treatment costs & insurance\n\nSelect a number or ask about any approach!",
                    followUp: true
                }
            ],
            followUps: {
                "1": "medication",
                "2": "therapy",
                "3": "cognitive",
                "4": "lifestyle",
                "5": "alternative",
                "6": "combined",
                "7": "insurance"
            }
        },
        medication: {
            patterns: ['medicines', 'drugs', 'prescriptions', 'stimulants', 'non-stimulants', '1'],
            responses: [
                {
                    text: "ADHD medications fall into several categories:\n\n1. Stimulants:\n• Short-acting (Ritalin, Adderall)\n• Long-acting (Concerta, Vyvanse)\n\n2. Non-stimulants:\n• Atomoxetine (Strattera)\n• Guanfacine (Intuniv)\n• Clonidine (Kapvay)\n\n3. Antidepressants (off-label):\n• Bupropion (Wellbutrin)\n• Others as prescribed\n\nWhat would you like to know?\n1. Side effects\n2. Effectiveness rates\n3. Cost information\n4. Schedule a consultation\n5. Natural alternatives",
                    followUp: true
                }
            ],
            followUps: {
                "1": "side_effects",
                "2": "effectiveness",
                "3": "costs",
                "4": "consultation",
                "5": "natural"
            }
        },
        side_effects: {
            patterns: ['side effects', 'risks', 'safety', '1'],
            responses: [
                {
                    text: "Common side effects of ADHD medications:\n\n1. Stimulants:\n• Decreased appetite\n• Sleep issues\n• Anxiety\n• Increased heart rate\n\n2. Non-stimulants:\n• Fatigue\n• Mood changes\n• Stomach upset\n\nImportant Notes:\n• Side effects often improve over time\n• Regular monitoring is important\n• Different medications affect people differently\n\nWould you like to:\n1. Discuss with a doctor\n2. Learn management strategies\n3. Explore alternatives\n4. Read patient experiences",
                    followUp: true
                }
            ]
        },
        children: {
            patterns: ['child', 'kid', 'parent', 'parenting', 'school', '4', 'get parenting'],
            responses: [
                {
                    text: "Supporting a child with ADHD? Let's focus on what you need:\n\n1. Behavior management strategies\n2. School accommodations\n3. Parenting techniques\n4. Home organization\n5. Homework help\n6. Social skills support\n7. Communication with teachers\n8. Building self-esteem\n\nSelect a topic or ask any question!",
                    followUp: true
                }
            ],
            followUps: {
                "1": "behavior",
                "2": "accommodations",
                "3": "parenting_tips",
                "4": "organization",
                "5": "homework",
                "6": "social_skills",
                "7": "teacher_communication",
                "8": "self_esteem"
            }
        },
        emergency: {
            patterns: ['emergency', 'crisis', 'urgent', 'suicide', 'help now', '7'],
            responses: [
                {
                    text: "If you're experiencing a mental health emergency:\n\n🚨 Emergency Contacts:\n• National Crisis Hotline: 988\n• Emergency Services: 911\n\nImmediate Support Options:\n1. Talk to a counselor now\n2. Crisis text line\n3. Local emergency resources\n4. Family support guidance\n\nYour wellbeing is important. Don't hesitate to reach out for help.",
                    followUp: true,
                    priority: "high"
                }
            ]
        },
        support: {
            patterns: ['community', 'group', 'support', 'connect', 'meet', '2', 'find support'],
            responses: [
                {
                    text: "We offer various support options:\n\n1. Support Groups:\n• Weekly online meetings\n• Local chapters\n• Parent groups\n• Adult ADHD groups\n\n2. Professional Support:\n• ADHD coaches\n• Therapist directory\n• Educational advocates\n\n3. Community Resources:\n• Workshops & webinars\n• Peer mentoring\n• Online forums\n\nWhat interests you?",
                    followUp: true
                }
            ],
            followUps: {
                "1": "groups",
                "2": "professional",
                "3": "resources"
            }
        }
    };

    // Enhanced response matching with context awareness
    function findBestMatch(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const words = lowerMessage.split(' ');
        let bestMatch = null;
        let highestScore = 0;

        // Check each category
        for (const category in responses) {
            let score = 0;
            const patterns = responses[category].patterns;

            // Pattern matching
            patterns.forEach(pattern => {
                if (lowerMessage.includes(pattern)) score += 2;
                words.forEach(word => {
                    if (pattern.includes(word)) score += 1;
                });
            });

            // Context consideration
            if (conversationContext.lastTopic) {
                const lastResponses = responses[conversationContext.lastTopic];
                if (lastResponses && lastResponses.followUps && lastResponses.followUps[lowerMessage]) {
                    score += 3;
                }
                
                // Consider conversation flow
                if (category === conversationContext.lastTopic) {
                    score += 1; // Slight boost for topic continuity
                }
            }

            // Prioritize emergency responses
            if (category === 'emergency' && score > 0) {
                score += 5;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = category;
            }
        }

        return highestScore > 0 ? bestMatch : null;
    }

    // Enhanced bot response function with better context handling
    function getBotResponse(userMessage) {
        const bestMatch = findBestMatch(userMessage);
        
        if (bestMatch) {
            const categoryResponses = responses[bestMatch].responses;
            const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
            
            // Update conversation context
            conversationContext.lastTopic = bestMatch;
            conversationContext.followUpExpected = response.followUp;
            conversationContext.questionCount++;
            conversationContext.conversationHistory.push({
                topic: bestMatch,
                userMessage: userMessage,
                response: response.text
            });

            // Handle priority responses (like emergencies)
            if (response.priority === "high") {
                return {
                    text: response.text,
                    priority: "high"
                };
            }

            return response.text;
        }

        // Enhanced fallback responses based on context
        let fallbackResponse = "";
        if (conversationContext.lastTopic) {
            fallbackResponse = `I see you're interested in ${conversationContext.lastTopic.replace('_', ' ')}. To help you better, could you:\n\n`;
        } else {
            fallbackResponse = "I want to help you better. Could you:\n\n";
        }

        fallbackResponse += "1. Rephrase your question\n2. Choose from these topics:\n" +
            "   • ADHD Symptoms & Diagnosis\n" +
            "   • Treatment Options\n" +
            "   • Support Resources\n" +
            "   • Parenting & Education\n" +
            "   • Coping Strategies\n\n" +
            "You can also type 'start' to begin again, or 'help' for more options.";

        return fallbackResponse;
    }

    // Typing animation
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatBotMessages.appendChild(typingDiv);
        chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
        return typingDiv;
    }

    // Add message to chat
    function addMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        // Handle priority messages
        if (typeof message === 'object' && message.priority === "high") {
            messageDiv.classList.add('priority');
            messageDiv.innerHTML = `<p>${message.text}</p>`;
        } else {
            messageDiv.innerHTML = `<p>${message}</p>`;
        }
        
        chatBotMessages.appendChild(messageDiv);
        chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
    }

    // Send message handler
    async function sendMessage() {
        const message = chatBotInput.value.trim();
        if (message) {
            addMessage('user', message);
            chatBotInput.value = '';

            const typingIndicator = showTypingIndicator();
            
            // Simulate processing time for more natural interaction
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            typingIndicator.remove();
            const response = getBotResponse(message);
            addMessage('bot', response);
        }
    }

    // Event listeners
    if (chatBotToggle) chatBotToggle.addEventListener('click', () => chatBot.classList.toggle('active'));
    if (chatBotClose) chatBotClose.addEventListener('click', () => chatBot.classList.remove('active'));
    if (chatBotInput) {
        chatBotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    if (chatBotSend) chatBotSend.addEventListener('click', sendMessage);
}); 