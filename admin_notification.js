document.addEventListener("DOMContentLoaded", async function () {
    // ✅ header, footer 불러오기
    await loadHeaderAndFooter();

    // ✅ Supabase 설정
    const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

    // ✅ 공지사항 불러오기
    async function loadNotices() {
        console.log("공지사항 불러오는 중...");

        const { data, error } = await supabase
            .from("withgo_notifications")
            .select("id, title, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("공지사항 불러오기 실패:", error);
            return;
        }

    // ✅ 공지사항 추가 이벤트
    document.querySelector(".bt1").addEventListener("click", addNotice);
    document.querySelector(".bt2").addEventListener("click", updateNotice);
});

// ✅ header, footer 불러오는 함수
async function loadHeaderAndFooter() {
    try {
        const headerResponse = await fetch("header.html");
        const footerResponse = await fetch("footer.html");
        if (headerResponse.ok) {
            document.querySelector(".header").innerHTML = await headerResponse.text();
        }
        if (footerResponse.ok) {
            document.querySelector(".footer").innerHTML = await footerResponse.text();
        }
    } catch (error) {
        console.error("헤더/푸터 로드 실패:", error);
    }
}

// ✅ 공지사항 목록 불러오기
async function loadNotices() {
    const { data, error } = await supabase.from("withgo_notifications").select("*").order("created_at", { ascending: false });
    if (error) {
        console.error("공지사항 불러오기 실패:", error);
        return;
    }

    const noticeList = document.getElementById("notice-list");
    noticeList.innerHTML = ""; // 기존 내용 초기화

    data.forEach(notice => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${notice.id}</td>
            <td>${notice.title}</td>
            <td>${new Date(notice.created_at).toLocaleDateString()}</td>
            <td>
                <button class="edit-btn" onclick="editNotice(${notice.id})">수정</button>
                <button class="delete-btn" onclick="deleteNotice(${notice.id})">삭제</button>
            </td>
        `;
        noticeList.appendChild(row);
    });
}

// ✅ 공지사항 추가
async function addNotice(event) {
    event.preventDefault();
    const title = document.getElementById("notice-title").value;
    const content = document.getElementById("notice-content").value;
    const date = document.getElementById("notice-date").value;

    if (!title || !content || !date) {
        alert("모든 필드를 입력해주세요!");
        return;
    }

    const { data, error } = await supabase.from("withgo_notifications").insert([{ title, content, created_at: date }]);
    if (error) {
        console.error("공지사항 추가 실패:", error);
        return;
    }

    alert("공지사항이 추가되었습니다!");
    loadNotices();
}

// ✅ 공지사항 수정
async function updateNotice(event) {
    event.preventDefault();
    const id = document.getElementById("notice-id").value;
    const title = document.getElementById("notice-title").value;
    const content = document.getElementById("notice-content").value;
    const date = document.getElementById("notice-date").value;

    if (!id || !title || !content || !date) {
        alert("모든 필드를 입력해주세요!");
        return;
    }

    const { error } = await supabase.from("withgo_notifications").update({ title, content, created_at: date }).eq("id", id);
    if (error) {
        console.error("공지사항 수정 실패:", error);
        return;
    }

    alert("공지사항이 수정되었습니다!");
    loadNotices();
}

// ✅ 공지사항 삭제
async function deleteNotice(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("withgo_notifications").delete().eq("id", id);
    if (error) {
        console.error("공지사항 삭제 실패:", error);
        return;
    }

    alert("공지사항이 삭제되었습니다!");
    loadNotices();
}

// ✅ 수정 버튼 클릭 시 폼에 데이터 넣기
async function editNotice(id) {
    const { data, error } = await supabase.from("withgo_notifications").select("*").eq("id", id).single();
    if (error) {
        console.error("공지사항 조회 실패:", error);
        return;
    }

    document.getElementById("notice-id").value = data.id;
    document.getElementById("notice-title").value = data.title;
    document.getElementById("notice-content").value = data.content;
    document.getElementById("notice-date").value = data.created_at.split("T")[0];
}
