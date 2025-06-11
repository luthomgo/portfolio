document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");

  function clearForm() {
    if (form) {
      form.reset();
      console.log('Form cleared!');
      
      // Also clear any custom styling/classes
      const formGroups = document.querySelectorAll(".form-group");
      formGroups.forEach((group) => {
        group.classList.remove("error");
        const error = group.querySelector(".error-message");
        if (error) error.remove();
      });
    }
  }


  // ✅ Multiple ways to detect successful form submission
  function checkForFormSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUrl = window.location.href;
    const referrer = document.referrer;
    
    
    // Method 1: Check URL parameters (custom redirect)
    const hasSuccessParam = urlParams.get("form") === "success";
    
    // Method 2: Check if coming from Formspree thanks page
    const fromFormspree = referrer.includes("formspree.io/thanks") || 
                         referrer.includes("formspree.io") ||
                         urlParams.get("language") === "en";
    
    // Method 3: Check localStorage flag
    const hasLocalStorageFlag = localStorage.getItem('formSubmitted') === 'true';
    
    // Method 4: Check sessionStorage (for same-tab navigation)
    const hasSessionFlag = sessionStorage.getItem('formJustSubmitted') === 'true';
    
    return hasSuccessParam || fromFormspree || hasLocalStorageFlag || hasSessionFlag;
  }

  // ✅ Handle successful form submission
  if (checkForFormSuccess()) {
    console.log('Form success detected!'); // Debug log
    
    // Clear all flags
    localStorage.removeItem('formSubmitted');
    sessionStorage.removeItem('formJustSubmitted');
    localStorage.removeItem('formSubmissionTime');
    
    // Clear form and show success
    clearForm();
    showSuccessMessage();


    // Clean up URL parameters
    if (window.location.search) {
      const cleanUrl = window.location.protocol + "//" + 
                      window.location.host + 
                      window.location.pathname + 
                      window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // ✅ Form submission handler
  if (form) {
    form.addEventListener("submit", function (e) {
      console.log('Form submission started'); // Debug log
      
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
        e.preventDefault();
        return;
      }

      // ✅ IMMEDIATE CLEAR: Clear form right after successful validation
      // This ensures the form clears even if detection methods fail
      setTimeout(() => {
        clearForm();
        showSuccessMessage();
      }, 100); // Small delay to ensure form submission starts
  

   // ✅ Set flags for backup detection methods
      console.log('Setting submission flags');
      localStorage.setItem('formSubmitted', 'true');
      sessionStorage.setItem('formJustSubmitted', 'true');
      
      // Set a timestamp to avoid stale flags
      const timestamp = new Date().getTime();
      localStorage.setItem('formSubmissionTime', timestamp.toString());
      
      // Show loading state briefly
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Reset button after form clears
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }

      // ✅ Backup detection for when user returns from Formspree
      setTimeout(() => {
        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('pageshow', handlePageShow);
      }, 1000);
    });
  }

  // ✅ Handle when user returns to the tab/page (backup method)
  function handleWindowFocus() {
    console.log('Window focused, checking for form success');
    checkAndHandleReturn();
  }

  function handlePageShow(event) {
    console.log('Page shown, checking for form success');
    if (event.persisted) {
      checkAndHandleReturn();
    }
  }

  function checkAndHandleReturn() {
    const submissionTime = localStorage.getItem('formSubmissionTime');
    const now = new Date().getTime();
    
    // Only check if submission was recent (within last 5 minutes)
    if (submissionTime && (now - parseInt(submissionTime)) < 300000) {
      if (localStorage.getItem('formSubmitted') === 'true' || 
          sessionStorage.getItem('formJustSubmitted') === 'true') {
        
        console.log('Detected return from form submission');
        
        // Clear flags
        localStorage.removeItem('formSubmitted');
        localStorage.removeItem('formSubmissionTime');
        sessionStorage.removeItem('formJustSubmitted');
        
        // Clear form and show success
        clearForm();
        showSuccessMessage();
        
        // Remove event listeners to prevent multiple triggers
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('pageshow', handlePageShow);
      }
    }
  }

  // ✅ Clean up old localStorage entries on page load
  const submissionTime = localStorage.getItem('formSubmissionTime');
  if (submissionTime) {
    const now = new Date().getTime();
    // Remove flags older than 5 minutes
    if ((now - parseInt(submissionTime)) > 300000) {
      localStorage.removeItem('formSubmitted');
      localStorage.removeItem('formSubmissionTime');
      sessionStorage.removeItem('formJustSubmitted');
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