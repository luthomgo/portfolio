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
//Call once on page load
animateSkillBars();

// Then attach resize listener (outside the function!)
window.addEventListener("resize", () => {
  animateSkillBars();
});