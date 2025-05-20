document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");

  // ✅ Detect if redirected after successful Formspree submission
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("form") === "success") {
    // Clear form fields if the form exists
    if (form) form.reset();

    // Show a thank you message
    if (feedback) {
      feedback.textContent = "Thanks for reaching out! Your message has been sent.";
      feedback.style.display = "block";
      feedback.className = "form-feedback success";
    }

    // ✅ Clean up URL to remove query string
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }

  // ✅ Add form validation before submit
  form.addEventListener("submit", function (e) {
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
      e.preventDefault(); // Prevent submission to Formspree
    }
  });

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
