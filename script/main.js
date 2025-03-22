// Neural Network Animation
const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Recalculate node count when window size changes
  resetNodes();
});

// Node class
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
    this.connections = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    
    // Add a small random movement
    if (Math.random() > 0.97) {
      this.vx += (Math.random() * 0.4 - 0.2);
      this.vy += (Math.random() * 0.4 - 0.2);
    }
    
    // Limit velocity
    const maxSpeed = 1.5;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  connect(otherNodes) {
    this.connections = [];
    otherNodes.forEach((node) => {
      const distance = Math.hypot(this.x - node.x, this.y - node.y);
      if (distance < 150 && node !== this) {
        this.connections.push({
          node: node,
          opacity: 1 - distance / 150,
        });
      }
    });
  }

  drawConnections() {
    this.connections.forEach((connection) => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(connection.node.x, connection.node.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * 0.2})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }
}

// Create nodes
let nodes = [];

function resetNodes() {
  const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
  nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    nodes.push(new Node(x, y));
  }
}

resetNodes();

// Mouse interaction
let mouse = {
  x: null,
  y: null,
  radius: 100,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Reset mouse position when cursor leaves window
window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

// Mobile support
window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

window.addEventListener("touchend", () => {
  mouse.x = null;
  mouse.y = null;
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Add CSS for mobile menu when active
    if (navLinks.classList.contains('active')) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.padding = '1rem';
      navLinks.style.background = 'rgba(16, 16, 28, 0.95)';
      navLinks.style.backdropFilter = 'blur(10px)';
    } else {
      navLinks.style.display = '';
    }
  });
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update nodes
  nodes.forEach((node) => {
    node.update();

    // Mouse interaction
    if (mouse.x && mouse.y) {
      const distance = Math.hypot(node.x - mouse.x, node.y - mouse.y);
      if (distance < mouse.radius) {
        // Calculate angle
        const angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
        const force = (mouse.radius - distance) / mouse.radius;

        // Push node away from cursor
        node.vx += Math.cos(angle) * force * 0.2;
        node.vy += Math.sin(angle) * force * 0.2;

        // Add some friction
        node.vx *= 0.95;
        node.vy *= 0.95;
      }
    }

    // Establish connections
    node.connect(nodes);
  });

  // Draw connections first (so they appear behind nodes)
  nodes.forEach((node) => {
    node.drawConnections();
  });

  // Draw nodes
  nodes.forEach((node) => {
    node.draw();
  });

  requestAnimationFrame(animate);
}

animate();