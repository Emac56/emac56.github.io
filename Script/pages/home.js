document.getElementById("homeImage").style.animation = "moveUpDown 1.5s ease-in-out infinite";

window.addEventListener('load', () => {
    const elements = document.querySelectorAll('#animate');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('show');
        }, index * 300);
    });
});

window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.animateNav');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('show');
        }, index * 300);
    });
});