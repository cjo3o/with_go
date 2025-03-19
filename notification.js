const supabase = window.supabase.createClient(
    'https://wunmezoxjspgtstkpgwv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bm1lem94anNwZ3RzdGtwZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MjUwMTgsImV4cCI6MjA1NTAwMTAxOH0.MoL5es2vyhmm-WyRx585rgd6he-zn5I3YopLrdHQ4cc'
);
console.log('Supabase 객체:', supabase);


// ✅ Supabase에서 공지사항 가져오기
async function getNotifications() {
    let { data, error } = await supabase
        .from("withgo_notifications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("📌 공지사항 불러오기 실패:", error);
        return [];
    }

    console.log("📌 Supabase에서 가져온 공지사항 데이터:", data);

    return data;
}

// ✅ 페이지 로드 후 실행 (중복 방지!)
document.addEventListener("DOMContentLoaded", async function () {
    const noticeList = document.getElementById("notice-list"); // 공지사항 목록
    const noticeTable = document.querySelector(".notice-table tbody"); // 테이블
    const searchInput = document.querySelector(".search-box input"); // 검색창

    if (!noticeList || !noticeTable || !searchInput) {
        console.error("📌 오류: 필수 HTML 요소를 찾을 수 없습니다!");
        return;
    }

    // ✅ 기존 하드코딩된 공지사항 (기본 데이터)
    let notices = [
        { id: 1, title: "[KTX특송] 3월 미운영 매장 공지", created_at: "2025-02-27" },
        { id: 2, title: "[보관함] 대구관광안내소 보관함 철거 안내", created_at: "2025-02-28" },
        { id: 3, title: "[짐배송] 가격 인상 안내", created_at: "2025-03-10" }
    ];

    // ✅ Supabase에서 공지사항 가져오기
    const supabaseData = await getNotifications();

    // ✅ Supabase 데이터가 있으면 덮어쓰기
    if (supabaseData.length > 0) {
        notices = supabaseData;
    }

    // ✅ 공지사항 테이블 표시 함수
    function renderTable(filteredNotices) {
        noticeTable.innerHTML = "";
        filteredNotices.forEach((notice, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><a href="notice-detail.html?id=${notice.id}">${notice.title}</a></td>
                <td>${new Date(notice.created_at).toLocaleDateString()}</td>
            `;
            noticeTable.appendChild(row);
        });
    }

    renderTable(notices); // ✅ 초기 공지사항 목록 표시

    // ✅ 검색 기능 추가
    searchInput.addEventListener("input", function () {
        const keyword = searchInput.value.trim().toLowerCase();
        const filteredNotices = notices.filter(notice =>
            notice.title.toLowerCase().includes(keyword) || notice.created_at.includes(keyword)
        );
        renderTable(filteredNotices);
    });
});
