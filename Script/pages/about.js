document.addEventListener("DOMContentLoaded", () => {
    // Navbar slide down
    const navbar = document.getElementById("navMenu");
    setTimeout(() => {
        navbar.classList.add("nav-slide-down");
    }, 100);

    // Sections slide up
    const sections = document.querySelectorAll(".animate");
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add("slide-up");
        }, 500 + index * 200); // staggered animation
    });
});
