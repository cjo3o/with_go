document.addEventListener("DOMContentLoaded", function () {
    const sections = [
        document.querySelector(".main_section"),
        document.querySelector(".main_section2"),
        document.querySelector(".main_section3")
    ];

    let currentIndex = 0;
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollCooldown = 800;

    window.addEventListener("wheel", function (e) {
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown || isScrolling) return;
        isScrolling = true;

        if (e.deltaY > 30) {
            currentIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else if (e.deltaY < -30) {
            currentIndex = Math.max(currentIndex - 1, 0);
        } else {
            isScrolling = false;
            return;
        }

        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
        lastScrollTime = now;

        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    });
});
