document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");

  // Detect if redirected after submission
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("form") === "success") {
    if (form) form.reset();
    if (feedback) {
      showFeedback("Thanks for reaching out! Your message has been sent.", "success");
    }

    // Clean the URL so "?form=success" goes away
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }

  // On form submit (for validation)
  form.addEventListener("submit", function (e) {
    const formGroups = document.querySelectorAll(".form-group");

    // Clear previous errors
    formGroups.forEach((group) => {
      group.classList.remove("error");
      const error = group.querySelector(".error-message");
      if (error) error.textContent = "";
    });
    feedback.style.display = "none";

    let hasErrors = false;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name === "") {
      setError("name", "Name is required");
      hasErrors = true;
    }

    if (email === "") {
      setError("email", "Email is required");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setError("email", "Enter a valid email address");
      hasErrors = true;
    }

    if (message === "") {
      setError("message", "Message is required");
      hasErrors = true;
    } else if (message.length < 10) {
      setError("message", "Message must be at least 10 characters");
      hasErrors = true;
    }

    if (hasErrors) {
      e.preventDefault(); // Prevent Formspree submission
    }
  });

  // Helper: Show field error
  function setError(id, message) {
    const input = document.getElementById(id);
    const group = input.closest(".form-group");
    group.classList.add("error");
    const error = group.querySelector(".error-message");
    error.textContent = message;
  }

  // Helper: Basic email validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  // Helper: Show feedback banner
  function showFeedback(message, type = "success") {
    feedback.textContent = message;
    feedback.style.display = "block";
    feedback.className = `form-feedback ${type}`;
  }
});
