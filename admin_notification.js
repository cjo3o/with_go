const supabaseUrl = "https://wunmezoxjspgtstkpgwv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bm1lem94anNwZ3RzdGtwZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MjUwMTgsImV4cCI6MjA1NTAwMTAxOH0.MoL5es2vyhmm-WyRx585rgd6he-zn5I3YopLrdHQ4cc";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", async function () {
    loadNotices(); // ✅ 공지사항 목록 불러오기

    document.getElementById("notice-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        saveNotice();
    });
});

// ✅ 공지사항 목록 불러오기
async function loadNotices() {
    let { data, error } = await supabase
        .from("withgo_notifications") // ✅ 테이블 이름 맞게 설정
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("📌 공지사항 불러오기 실패:", error);
        return;
    }

    const noticeList = document.getElementById("notice-list");
    noticeList.innerHTML = "";

    data.forEach(notice => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${notice.id}</td>
            <td>${notice.title}</td>
            <td>${new Date(notice.created_at).toLocaleDateString()}</td>
            <td>
                <button onclick="editNotice(${notice.id}, '${notice.title}', '${notice.content}', '${notice.created_at}')">수정</button>
                <button onclick="deleteNotice(${notice.id})">삭제</button>
            </td>
        `;
        noticeList.appendChild(row);
    });
}

// ✅ 공지사항 추가 / 수정
async function saveNotice() {
    const id = document.getElementById("notice-id").value;
    const title = document.getElementById("notice-title").value;
    const content = document.getElementById("notice-content").value;
    const date = document.getElementById("notice-date").value;

    if (!title || !content || !date) {
        alert("📌 모든 필드를 입력해주세요!");
        return;
    }

    if (id) {
        // ✅ 수정하기
        let { error } = await supabase
            .from("withgo_notifications")
            .update({ title, content, created_at: date })
            .eq("id", id);

        if (error) {
            console.error("📌 공지사항 수정 실패:", error);
        } else {
            alert("📌 공지사항이 수정되었습니다!");
        }
    } else {
        // ✅ 추가하기
        let { error } = await supabase
            .from("withgo_notifications")
            .insert([{ title, content, created_at: date }]);

        if (error) {
            console.error("📌 공지사항 추가 실패:", error);
        } else {
            alert("📌 공지사항이 추가되었습니다!");
        }
    }

    document.getElementById("notice-form").reset();
    document.getElementById("notice-id").value = "";
    loadNotices(); // ✅ 목록 다시 불러오기
}

// ✅ 공지사항 수정 버튼 클릭 시
function editNotice(id, title, content, created_at) {
    document.getElementById("notice-id").value = id;
    document.getElementById("notice-title").value = title;
    document.getElementById("notice-content").value = content;
    document.getElementById("notice-date").value = created_at.split("T")[0]; // 날짜만 가져오기
}

// ✅ 공지사항 삭제
async function deleteNotice(id) {
    if (!confirm("📌 정말 삭제하시겠습니까?")) return;

    let { error } = await supabase
        .from("withgo_notifications")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("📌 공지사항 삭제 실패:", error);
    } else {
        alert("📌 공지사항이 삭제되었습니다!");
        loadNotices();
    }
}
