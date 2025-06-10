// Enhanced Hugging Face Chatbot Class
class HuggingFaceChatbot {
    constructor() {
        // Using a more suitable model for conversation
        this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
        const token = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN;
        // this.apiKey = 'your_hugging_face_token_here'.env; // Add your token
        this.conversationHistory = [];
      }
      
      
      async sendMessage(userMessage) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    // Add authorization if API key exists
    if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
        this.conversationHistory = [];
        this.maxHistoryLength = 5; // Keep last 5 exchanges
        
        // Portfolio-specific context about Lutho
        this.context = // Portfolio-specific context about Lutho
        this.context = `Hey there! I'm your friendly AI assistant here to show you around Lutho Mgolombane’s portfolio 🤖✨

Lutho is an AI Engineer & Developer based in  Cape Town, South Africa
Her expertise includes:  
- AI and Machine Learning  
- Software Development  
- Tools like Cloud Computing, API Integration, Java and Python ☁️🛠️

Some of her proudest projects?  
🍲 A tasty Recipe App using the Spoonacular API  
🎨 An AI-Powered Design Assistant  
📊 Interactive data visualizations that bring stories to life

Want to connect or learn more?  
📧 lutho.usa@gmail.com  
🔗 Find her on LinkedIn & GitHub too!

Let me know what you’d like to explore — I’ve got all the info you need! 🎉`;
;
    }

    async sendMessage(userMessage) {
        try {
            // Add user message to history
            this.conversationHistory.push({ role: 'user', content: userMessage });
            
            // Build conversation context
            const conversationText = this.buildConversationText(userMessage);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: conversationText,
                    parameters: {
                        max_length: 150,
                        temperature: 0.7,
                        do_sample: true,
                        top_k: 50,
                        top_p: 0.9,
                        repetition_penalty: 1.2
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats
            let aiResponse = '';
            if (Array.isArray(data) && data.length > 0) {
                aiResponse = data[0].generated_text || '';
            } else if (data.generated_text) {
                aiResponse = data.generated_text;
            }

            // Extract only the new response (remove the input context)
            const cleanResponse = this.extractNewResponse(aiResponse, conversationText);
            
            // Add AI response to history
            this.conversationHistory.push({ role: 'assistant', content: cleanResponse });
            
            // Limit history size
            if (this.conversationHistory.length > this.maxHistoryLength * 2) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
            }

            return cleanResponse || "I'm here to help you learn more about Lutho's work and skills!";

        } catch (error) {
            console.error('Chatbot error:', error);
            
            // Fallback responses based on user input
            return this.getFallbackResponse(userMessage);
        }
    }

    buildConversationText(userMessage) {
        // Build conversation context with portfolio information
        let conversationText = this.context + '\n\n';
        
        // Add recent conversation history
        const recentHistory = this.conversationHistory.slice(-6); // Last 3 exchanges
        recentHistory.forEach(msg => {
            conversationText += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
        });
        
        conversationText += `Human: ${userMessage}\nAssistant:`;
        return conversationText;
    }

    extractNewResponse(fullResponse, inputContext) {
        // Remove the input context to get only the new AI response
        if (fullResponse.includes('Assistant:')) {
            const parts = fullResponse.split('Assistant:');
            return parts[parts.length - 1].trim();
        }
        return fullResponse.replace(inputContext, '').trim();
    }

    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Portfolio-specific fallback responses
        if (message.includes('skill') || message.includes('technology')) {
            return"Lutho’s got strong skills in AI and Machine Learning, along with HTML, CSS, JavaScript, Python, and Java. She’s also comfortable working with cloud computing and API integration 🚀.";
        }
        
        if (message.includes('project') || message.includes('work')) {
            return "Great things are coming! Lutho’s projects will be available here shortly.";
        }
        
        if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
            return "Hi there! If you want to get in touch with Lutho, just send her an <a href=\"mailto:lutho.usa@gmail.com\">email</a> or connect with her on <a href=\"https://www.linkedin.com/in/lutho-mgolombane/\" target=\"_blank\" rel=\"noopener noreferrer\">LinkedIn</a>.";
        }

       if (message.toLowerCase().includes("who's lutho") || message.toLowerCase().includes("who is lutho") || message.toLowerCase().includes("about")) {
            return "Lutho didn’t start out in tech, but the moment she found software development, it just clicked. It’s where her creativity and love for problem-solving come alive every day. She’s especially passionate about artificial intelligence—not just the tech itself, but how it can genuinely make life and work better. Lutho’s all about building systems that actually help people in meaningful ways. Along the way, she’s picked up skills in cloud computing, full-stack development, and AI. Always curious and driven, she’s dedicated to crafting thoughtful, reliable solutions and can’t wait to see what’s around the corner.";
        }


        
        // if (message.includes('ai') || message.includes('machine learning') || message.includes('ml')) {
        //     return "Lutho is passionate about AI and machine learning! she has experience in Natural Language Processing, Computer Vision, and Reinforcement Learning, and she's always exploring new ways AI can solve real-world problems.";
        // }
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hey there! I’m Lutho’s AI assistant. I can share info about her skills, projects, experience, or help you get in touch. What would you like to know?";
        }
        
        return "I'm here to help you learn more about Lutho Mgolombane's work and skills. Feel free to ask about her projects, technical expertise, or how to get in touch!";
    }

    // Method to reset conversation
    resetConversation() {
        this.conversationHistory = [];
    }
}

// Initialize the chatbot
const chatbot = new HuggingFaceChatbot();

// Enhanced message handling
async function handleUserMessage(message) {
    if (!message.trim()) return;
    
    // Add user message to UI
    addMessage('user', message);
    
    // Clear input
    const input = document.getElementById('messageInput');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await chatbot.sendMessage(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to UI
        addMessage('bot', response);
        
    } catch (error) {
        console.error('Error getting response:', error);
        hideTypingIndicator();
        addMessage('bot', "I'm having trouble connecting right now, but I'm here to help you learn about Lutho's work!");
    }
}

// Enhanced event listeners
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    // Send button click
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            handleUserMessage(message);
        });
    }
    
    // Enter key press
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = messageInput.value.trim();
                handleUserMessage(message);
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            if (question) {
                handleUserMessage(question);
            }
        });
    });
});

// Enhanced UI functions
function addMessage(sender, text) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    // Remove welcome message if it exists
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage && messagesContainer.children.length === 1) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? 'U' : 'LM'}</div>
        <div class="message-content">${text}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">LM</div>
        <div class="typing-indicator">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

// Chatbot toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    
    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');
            chatbotToggle.classList.toggle('active');
        });
    }
});

// Export for external use if needed
window.HuggingFaceChatbot = HuggingFaceChatbot;