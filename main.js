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

function goToReservation() {
    const name = document.querySelector('input[name="name"]').value;
    const phone =
        document.querySelector('input[name="B_TEL1"]').value +
        document.querySelector('input[name="B_TEL2"]').value +
        document.querySelector('input[name="B_TEL3"]').value;
    const carrierSelect = document.querySelector('select[name="package"]');
    const carrier = carrierSelect.options[carrierSelect.selectedIndex].text;

    // 필수 입력 체크
    if (!name || !phone || !carrier || carrier === "패키지 종류") {
        alert("이름, 연락처, 캐리어 종류를 모두 입력해주세요!");
        return;
    }

    // localStorage에 저장
    localStorage.setItem("reservation_name", name);
    localStorage.setItem("reservation_phone", phone);
    localStorage.setItem("reservation_carrier", carrier);

    window.location.href = "delivery_reservation.html";
    window.location.href = "keep_reservation.html";// 또는 keep_reservation.html
}
