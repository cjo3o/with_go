document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const quickForm = document.getElementById("quick-form");

    toggleBtn.addEventListener("click", function () {
        if (quickForm.style.left === "0px") {
            quickForm.style.left = "-250px"; // 숨김 상태로 변경
        } else {
            quickForm.style.left = "0px"; // 보이도록 이동
        }
    });
});