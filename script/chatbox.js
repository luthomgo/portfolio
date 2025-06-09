class PortfolioChatbot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.apiKey = ""; // You'll need to set your Claude API key here

    this.portfolioData = {
      name: "Lutho Mgolombane",
      title: "AI Engineer & Developer",
      location: "Cape Town, South Africa",
      email: "lutho.usa@gmail.com",
      linkedin: "https://www.linkedin.com/in/lutho-mgolombane/",
      github: "https://github.com/luthomgo",

      skills: {
        ai: [
          "Machine Learning (30%)",
          "Natural Language Processing (35%)",
          "Computer Vision (35%)",
          "Reinforcement Learning (35%)",
        ],
        development: [
          "JavaScript (95%)",
          "CSS (90%)",
          "Python (85%)",
          "HTML (80%)",
        ],
        tools: [
          "Cloud Computing",
          "Full Stack",
          "API Integration",
          "Python",
          "Git",
          "Java",
        ],
      },

      projects: [
        {
          name: "Recipe APP",
          description:
            "An interactive, personalized recipe platform integrating Spoonacular API for meal planning and AI-driven recommendations.",
          technologies: [
            "Machine Learning",
            "JavaScript",
            "HTML",
            "CSS",
            "API Integration",
            "Spoonacular API",
          ],
        },
        {
          name: "AI-Powered Design Assistant",
          description:
            "An intelligent assistant that helps designers automate repetitive tasks and generate creative variations.",
          technologies: ["Machine Learning", "JavaScript", "HTML", "CSS"],
        },
        {
          name: "Interactive Visualization",
          description:
            "Data visualization project with interactive elements for better data understanding.",
          technologies: ["node.js", "SVG", "Data Analysis"],
        },
      ],

      bio: "I didn't start out in tech, but once I stepped into the world of software development, something clicked. I found a space where I could think creatively, solve meaningful problems, and constantly push myself to grow. As I explored more, I became especially drawn to artificial intelligence - not just the innovation behind it, but the potential it has to improve how we live and work. I'm passionate about building systems that don't just function, but actually serve people in thoughtful, useful ways.",
    };

    this.initializeElements();
    this.attachEventListeners();
    this.setupAutoResize();
  }

  initializeElements() {
    this.toggle = document.getElementById("chatbotToggle");
    this.container = document.getElementById("chatbotContainer");
    this.messages = document.getElementById("chatbotMessages");
    this.input = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.quickActions = document.querySelectorAll(".quick-action-btn");
  }

  attachEventListeners() {
    this.toggle.addEventListener("click", () => this.toggleChat());
    this.sendButton.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.quickActions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const question = btn.dataset.question;
        this.input.value = question;
        this.sendMessage();
      });
    });
  }

  setupAutoResize() {
    this.input.addEventListener("input", () => {
      this.input.style.height = "auto";
      this.input.style.height = Math.min(this.input.scrollHeight, 100) + "px";
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.toggle.classList.toggle("active", this.isOpen);
    this.container.classList.toggle("active", this.isOpen);

    if (this.isOpen) {
      this.input.focus();
    }
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message || this.isTyping) return;

    this.addMessage(message, "user");
    this.input.value = "";
    this.input.style.height = "auto";

    this.showTypingIndicator();

    try {
      const response = await this.generateResponse(message);
      this.hideTypingIndicator();
      this.addMessage(response, "bot");
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(
        "I'm sorry, I'm having trouble responding right now. Please try asking about Lutho's skills, projects, or contact information!",
        "bot"
      );
    }
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "user" ? "U" : "LM";

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    // Remove welcome message if it exists
    const welcomeMessage = this.messages.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    this.messages.appendChild(messageDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  showTypingIndicator() {
    this.isTyping = true;
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot";
    typingDiv.id = "typing-indicator";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "LM";

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingIndicator);
    this.messages.appendChild(typingDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async generateResponse(userMessage) {
    // Simple rule-based responses for demo
    const message = userMessage.toLowerCase();

    if (
      message.includes("skill") ||
      message.includes("expertise") ||
      message.includes("technology")
    ) {
      return this.getSkillsResponse();
    }

    if (
      message.includes("project") ||
      message.includes("work") ||
      message.includes("portfolio")
    ) {
      return this.getProjectsResponse();
    }

    if (
      message.includes("contact") ||
      message.includes("email") ||
      message.includes("reach") ||
      message.includes("touch")
    ) {
      return this.getContactResponse();
    }

    if (
      message.includes("ai") ||
      message.includes("artificial intelligence") ||
      message.includes("machine learning")
    ) {
      return this.getAIExperienceResponse();
    }

    if (
      message.includes("about") ||
      message.includes("who") ||
      message.includes("background") ||
      message.includes("bio")
    ) {
      return this.getAboutResponse();
    }

    if (message.includes("location") || message.includes("where")) {
      return `Lutho is based in ${this.portfolioData.location}. He's open to both local and remote opportunities.`;
    }

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "Hello! I'm here to help you learn more about Lutho Mgolombane. You can ask me about his skills, projects, experience, or how to get in touch with him. What would you like to know?";
    }

    // Default response
    return "I'd be happy to help you learn more about Lutho! I can tell you about his skills, projects, AI experience, or contact information. What specific aspect would you like to know more about?";
  }

  getSkillsResponse() {
    const { ai, development, tools } = this.portfolioData.skills;
    return `Lutho has expertise in several key areas:

🤖 AI & Machine Learning:
${ai.join(", ")}

💻 Development:
${development.join(", ")}

🛠️ Tools & Technologies:
${tools.join(", ")}

He's particularly passionate about AI and its practical applications in solving real-world problems!`;
  }

  getProjectsResponse() {
    const projects = this.portfolioData.projects
      .map(
        (project) =>
          `• ${project.name}: ${
            project.description
          } (Built with: ${project.technologies.slice(0, 3).join(", ")})`
      )
      .join("\n\n");

    return `Here are some of Lutho's key projects:\n\n${projects}\n\nEach project demonstrates his ability to combine AI with practical development skills. Would you like to know more about any specific project?`;
  }

  getContactResponse() {
    return `You can reach Lutho through:

📧 Email: ${this.portfolioData.email}
💼 LinkedIn: ${this.portfolioData.linkedin}
🔗 GitHub: ${this.portfolioData.github}
📍 Location: ${this.portfolioData.location}

He's always open to discussing new projects, collaborations, or opportunities!`;
  }

  getAIExperienceResponse() {
    return `Lutho is passionate about AI and has experience in:

• Machine Learning - Building intelligent systems that learn from data
• Natural Language Processing - Working with text and language understanding
• Computer Vision - Developing systems that can interpret visual information
• AI-driven recommendations - Creating personalized user experiences

He's particularly interested in building AI systems that serve people in thoughtful, useful ways rather than just being impressive technically. His Recipe App and AI-Powered Design Assistant are great examples of this approach!`;
  }

  getAboutResponse() {
    return `${this.portfolioData.bio}

Lutho is an ${this.portfolioData.title} based in ${this.portfolioData.location}. He's passionate about building reliable, thoughtful systems and is always learning and looking forward to what's possible next.

Would you like to know more about his specific skills or projects?`;
  }
}

// Initialize the chatbot when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioChatbot();
});
