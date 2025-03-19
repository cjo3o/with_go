// ✅ Supabase 연결
const supabaseUrl = "https://wunmezoxjspgtstkpgwv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bm1lem94anNwZ3RzdGtwZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MjUwMTgsImV4cCI6MjA1NTAwMTAxOH0.MoL5es2vyhmm-WyRx585rgd6he-zn5I3YopLrdHQ4cc"; // 실제 anon 키 입력
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// ✅ URL에서 `id` 가져오기
const urlParams = new URLSearchParams(window.location.search);
const noticeId = urlParams.get("id");

// ✅ 공지사항 데이터 가져오기 (Supabase)
async function getNoticeDetail(id) {
    let { data, error } = await supabase
        .from("withgo_notifications")  // ✅ Supabase 테이블에서 데이터 가져오기
        .select("*")
        .eq("id", id)
        .single();  // ✅ 단일 결과만 가져오기

    if (error) {
        console.error("📌 공지사항 불러오기 실패:", error);
        return null;
    }
    return data;
}

// ✅ 공지사항 상세 페이지 업데이트
document.addEventListener("DOMContentLoaded", async function () {
    if (!noticeId) {
        document.getElementById("notice-title").textContent = "공지사항을 찾을 수 없습니다!";
        document.getElementById("notice-text").innerHTML = "<p>존재하지 않는 공지사항입니다.</p>";
        return;
    }

    const notice = await getNoticeDetail(noticeId);

    if (notice) {
        document.getElementById("notice-title").textContent = notice.title;
        document.getElementById("notice-date").textContent = new Date(notice.created_at).toLocaleDateString();
        document.getElementById("notice-text").innerHTML = notice.content || "내용 없음";
    } else {
        document.getElementById("notice-title").textContent = "공지사항을 찾을 수 없습니다!";
        document.getElementById("notice-text").innerHTML = "<p>존재하지 않는 공지사항입니다.</p>";
    }
});
