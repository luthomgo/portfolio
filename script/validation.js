document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");

   // ✅ Check if we're coming from Formspree's thanks page
  // This handles both the custom redirect and Formspree's default thanks page
  const urlParams = new URLSearchParams(window.location.search);
  const currentUrl = window.location.href;
  
  // Check for success indicators
  const isFormSuccess = urlParams.get("form") === "success" || 
                       urlParams.get("language") === "en" ||
                       document.referrer.includes("formspree.io/thanks");

  if (isFormSuccess) {
    // Clear form fields if the form exists
    if (form) {
      form.reset();
    }

    // Show a thank you message
    if (feedback) {
      feedback.textContent = "Thanks for reaching out! Your message has been sent.";
      feedback.style.display = "block";
      feedback.className = "form-feedback success";
    // Auto-hide the message after 5 seconds
      setTimeout(() => {
        feedback.style.display = "none";
      }, 5000);
    }

    // ✅ Clean up URL to remove query parameters
    const cleanUrl = window.location.protocol + "//" + 
                    window.location.host + 
                    window.location.pathname + 
                    window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // ✅ Store form data in localStorage before submission (as backup)
  if (form) {
    form.addEventListener("submit", function (e) {
      // Clear previous errors
      const formGroups = document.querySelectorAll(".form-group");
      formGroups.forEach((group) => {
        group.classList.remove("error");
        const error = group.querySelector(".error-message");
        if (error) error.textContent = "";
      });

      if (feedback) feedback.style.display = "none";

      let hasErrors = false;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      // Validation
      if (name === "") {
        showError("name", "Name is required");
        hasErrors = true;
      }

      if (email === "") {
        showError("email", "Email is required");
        hasErrors = true;
      } else if (!validateEmail(email)) {
        showError("email", "Enter a valid email address");
        hasErrors = true;
      }

      if (message === "") {
        showError("message", "Message is required");
        hasErrors = true;
      } else if (message.length < 10) {
        showError("message", "Message must be at least 10 characters");
        hasErrors = true;
      }

      if (hasErrors) {
        e.preventDefault(); // Prevent submission
        return;
      }

      // If validation passes, store a flag in localStorage
      localStorage.setItem('formSubmitted', 'true');
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });
  }

  // ✅ Check localStorage for recent form submission
  if (localStorage.getItem('formSubmitted') === 'true') {
    // Clear the flag
    localStorage.removeItem('formSubmitted');
    
    // Clear form and show success message
    if (form) {
      form.reset();
    }
    
    if (feedback) {
      feedback.textContent = "Thank you! Your message has been sent successfully.";
      feedback.style.display = "block";
      feedback.className = "form-feedback success";
      
      setTimeout(() => {
        feedback.style.display = "none";
      }, 5000);
    }
  }

  function showError(id, message) {
    const input = document.getElementById(id);
    const group = input.closest(".form-group");

    group.classList.add("error");

    let error = group.querySelector(".error-message");
    if (!error) {
      error = document.createElement("div");
      error.className = "error-message";
      group.appendChild(error);
    }
    error.textContent = message;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
});