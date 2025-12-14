window.addEventListener('DOMContentLoaded', () => {
    // Animate navbar
    const nav = document.getElementById('navMenu');
    setTimeout(() => {
        nav.classList.add('active');
    }, 100); // small delay for smoother effect

    // Animate contact container
    const contactSection = document.getElementById('contact-area');
    setTimeout(() => {
        contactSection.classList.add('active');
    }, 300); // after navbar animation
});
