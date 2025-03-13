document.addEventListener("DOMContentLoaded", function () {
    // ✅ 기본적으로 첫 번째 페이지 보이기
    showPage(1);

    // ✅ FAQ 질문 클릭하면 답변 토글
    document.querySelectorAll('.question').forEach(item => {
        item.addEventListener('click', function () {
            const answer = this.nextElementSibling;

            // ✅ 다른 열린 answer 닫기
            document.querySelectorAll('.answer').forEach(ans => {
                if (ans !== answer) {
                    ans.classList.remove('active');
                    ans.style.maxHeight = "0";
                    ans.style.opacity = "0"; // ✅ 숨기기
                }
            });

            // ✅ 현재 클릭한 answer 열기/닫기
            answer.classList.toggle('active');

            if (answer.classList.contains('active')) {
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.opacity = "1"; // ✅ 보이기
                }, 10);
            } else {
                answer.style.maxHeight = "0";
                answer.style.opacity = "0"; // ✅ 다시 숨기기
            }
        });
    });
});

// ✅ 페이지 변경 함수
function showPage(page) {
    document.getElementById('page1').style.display = (page === 1) ? 'block' : 'none';
    document.getElementById('page2').style.display = (page === 2) ? 'block' : 'none';

    // ✅ 버튼 스타일 업데이트
    document.querySelectorAll('.page-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.page-button')[page - 1].classList.add('active');
}
