// Form validation 

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
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Reset error states
    formGroups.forEach((group) => {
      group.classList.remove("error");
    });
    feedbackElement.style.display = "none";

    // Run validations
    let hasErrors = false;

    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required");
      hasErrors = true;
    }

    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      hasErrors = true;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, "Email is not valid");
      hasErrors = true;
    }

    if (messageInput.value.trim() === "") {
      showError(messageInput, "Message is required");
      hasErrors = true;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Message must be at least 10 characters");
      hasErrors = true;
    }

    // If errors exist, don't submit
    if (hasErrors) return;

    // Otherwise, submit via Formspree
  //   try {
  //     const formData = new FormData(contactForm);

  //     const response = await fetch(contactForm.action, {
  //       method: contactForm.method,
  //       headers: { Accept: "application/json" },
  //       body: formData,
  //     });

      // if (response.ok) {
      //   showFeedback("success", "Message sent successfully!");
      //   contactForm.reset();
      // } else {
      //   showFeedback("error", "Oops! Something went wrong. Please try again.");
      // }
  //   } catch (error) {
  //     showFeedback("error", "Network error. Please try again later.");
  //   }
  });
});