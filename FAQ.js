document.addEventListener("DOMContentLoaded", function () {
    showPage(1);

    document.querySelectorAll('.question').forEach(item => {
        item.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');

            if (answer.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px"; // 높이를 자동으로 조절
            } else {
                answer.style.maxHeight = "0";
            }
        });
    });
});

function showPage(page) {
    document.getElementById('page1').style.display = (page === 1) ? 'block' : 'none';
    document.getElementById('page2').style.display = (page === 2) ? 'block' : 'none';

    document.querySelectorAll('.page-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.page-button')[page - 1].classList.add('active');
}
