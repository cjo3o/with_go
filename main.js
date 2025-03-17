document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const quickForm = document.getElementById("quick-form");

    toggleBtn.addEventListener("click", function () {
        let isVisible = quickForm.style.left === "0px"; // `0px` 비교 → `parseInt()`로 변환 가능
        quickForm.style.left = isVisible ? "-250px" : "0px";
    });
});