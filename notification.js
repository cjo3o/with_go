document.addEventListener("DOMContentLoaded", function () {
    const notices = {
        "1": { title: "[KTX특송] 3월 미운영 매장 공지", date: "02-27" },
        "2": { title: "[보관함] 대구관광안내소 보관함 철거 안내", date: "02-28" },
        "3": { title: "[짐배송] 가격 인상 안내", date: "03-10" }
    };

    const noticeTable = document.querySelector(".notice-table tbody");
    const searchInput = document.querySelector(".search-box input"); // ✅ 검색 입력창 추가

    // 공지사항 테이블을 렌더링하는 함수
    function renderTable(filteredNotices) {
        noticeTable.innerHTML = ""; // 기존 리스트 초기화

        Object.keys(filteredNotices).forEach(id => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${id}</td>
                <td><a href="notice-detail.html?id=${id}">${filteredNotices[id].title}</a></td>
                <td>${filteredNotices[id].date}</td>
            `;
            noticeTable.appendChild(row);
        });
    }

    // 초기 공지사항 리스트 출력
    renderTable(notices);

    // 검색 기능 추가
    searchInput.addEventListener("input", function () {
        const keyword = searchInput.value.trim().toLowerCase(); // 검색어 소문자로 변환
        const filteredNotices = Object.fromEntries(
            Object.entries(notices).filter(([id, notice]) =>
                notice.title.toLowerCase().includes(keyword) || notice.date.includes(keyword)
            )
        );
        renderTable(filteredNotices); // 검색 결과 업데이트
    });
});