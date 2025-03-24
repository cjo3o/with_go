// ✅ Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// ✅ URL에서 `id` 가져오기
const urlParams = new URLSearchParams(window.location.search);
const noticeId = urlParams.get("id");

// ✅ 공지사항 상세 1건 불러오기
async function getNoticeDetail(id) {
    const {data, error} = await supabase
        .from("withgo_notifications")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("📌 공지사항 상세 불러오기 실패:", error);
        return null;
    }

    return data;
}

// ✅ 현재 공지를 제외한 최근 공지 2개 불러오기
async function getLatestNoticesExceptCurrent(currentId, limit = 2) {
    const {data, error} = await supabase
        .from("withgo_notifications")
        .select("id, title, created_at")
        .order("created_at", {ascending: false});

    if (error) {
        console.error("다른 공지 불러오기 실패:", error);
        return [];
    }

    const filtered = data.filter(notice => notice.id != currentId).slice(0, limit);
    return filtered;
}

// ✅ 페이지 로딩 후 실행
document.addEventListener("DOMContentLoaded", async function () {
    // 공지 ID 없으면 에러 처리
    if (!noticeId) {
        document.getElementById("notice-title").textContent = "공지사항을 찾을 수 없습니다!";
        document.getElementById("notice-text").innerHTML = "<p>존재하지 않는 공지사항입니다.</p>";
        return;
    }

    // 공지 상세 표시
    const notice = await getNoticeDetail(noticeId);

    if (notice) {
        document.getElementById("notice-title").textContent = notice.title;
        document.getElementById("notice-date").textContent = new Date(notice.created_at).toLocaleDateString();
        document.getElementById("notice-text").innerHTML = notice.content || "내용 없음";
    } else {
        document.getElementById("notice-title").textContent = "공지사항을 찾을 수 없습니다!";
        document.getElementById("notice-text").innerHTML = "<p>존재하지 않는 공지사항입니다.</p>";
        return;
    }

    // 하단 다른 공지 표시
    const others = await getLatestNoticesExceptCurrent(noticeId);
    const otherList = document.getElementById("other-notice-list");

    if (otherList) {
        otherList.innerHTML = "";
        others.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <a href="notice-detail.html?id=${item.id}">
                    ${item.title} <span style="color:gray;font-size:12px;">(${new Date(item.created_at).toLocaleDateString()})</span>
                </a>
            `;
            otherList.appendChild(li);
        });
    }
});
