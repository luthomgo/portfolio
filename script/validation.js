// Form validation and animation scripts
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  // Add labels to form inputs
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea");
    if (input) {
      // Create label
      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = input.placeholder;

      // Create error message element
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";

      // Add to DOM
      group.insertBefore(label, input);
      group.appendChild(errorMsg);

      // Update input styling
      input.placeholder = "";
    }
  });

  // Create feedback element
  const feedbackElement = document.createElement("div");
  feedbackElement.className = "form-feedback";
  contactForm.insertBefore(feedbackElement, contactForm.firstChild);

  // Form validation functions
  function validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group error";
    const errorMessage = formGroup.querySelector(".error-message");
    errorMessage.innerText = message;
  }

  function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group success";
  }

  function showFeedback(type, message) {
    feedbackElement.className = `form-feedback ${type}`;
    feedbackElement.innerText = message;
    feedbackElement.style.display = "block";

    // Auto-hide feedback after 5 seconds
    setTimeout(() => {
      feedbackElement.style.display = "none";
    }, 5000);
  }

  // Form submission handler
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset states
    formGroups.forEach((group) => {
      group.className = "form-group";
    });
    feedbackElement.style.display = "none";

    // Validate name
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required");
    } else {
      showSuccess(nameInput);
    }

    // Validate email
    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, "Email is not valid");
    } else {
      showSuccess(emailInput);
    }

    // Validate message
    if (messageInput.value.trim() === "") {
      showError(messageInput, "Message is required");
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Message must be at least 10 characters");
    } else {
      showSuccess(messageInput);
    }

    // Check if form is valid
    const hasErrors = document.querySelectorAll(".form-group.error").length > 0;

    if (!hasErrors) {
      // Simulate form submission (replace with actual form submission)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";

      // Simulate network request
      setTimeout(() => {
        // Show success message
        showFeedback(
          "success",
          "Your message has been sent successfully! I will contact you soon."
        );

        // Reset form
        contactForm.reset();
        formGroups.forEach((group) => {
          group.className = "form-group";
        });

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }, 1500);
    }
  });

  // Animate skill bars on scroll
  const animateSkillBars = () => {
    const skillItems = document.querySelectorAll(".skill-item");

    skillItems.forEach((item) => {
      const skillBar = item.querySelector(".skill-progress");
      const percentage = item.querySelector(".skill-percentage").innerText;

      // Reset initial width
      skillBar.style.width = "0";

      // Set up observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate to target width when visible
              setTimeout(() => {
                skillBar.style.width = percentage;
              }, 200);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(item);
    });
  };

  // Run skill bar animation
  animateSkillBars();

  // Re-run on window resize
  window.addEventListener("resize", animateSkillBars);
});
