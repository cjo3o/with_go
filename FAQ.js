const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", async function () {
    const faqData = await loadFAQ();
    if (faqData.length > 0) {
        renderFAQ(faqData);
        showPage(1);
    } else {
        console.error("📌 FAQ 데이터가 없습니다!");
    }

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("question")) {
            const answer = event.target.nextElementSibling;
            document.querySelectorAll(".answer").forEach((ans) => {
                if (ans !== answer) {
                    ans.classList.remove("active");
                    ans.style.maxHeight = "0";
                    ans.style.opacity = "0";
                }
            });

            answer.classList.toggle("active");
            if (answer.classList.contains("active")) {
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.opacity = "1";
                }, 10);
            } else {
                answer.style.maxHeight = "0";
                answer.style.opacity = "0";
            }
        }
    });
});

// ✅ Supabase에서 FAQ 데이터 불러오기
async function loadFAQ() {
    let { data, error } = await supabase
        .from("withgo_faqs")  // ✅ 테이블 이름 수정!!
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("📌 FAQ 데이터를 불러오는 중 오류 발생:", error);
        return [];
    }
    return data;
}

// ✅ FAQ 동적 생성 함수
function renderFAQ(faqData) {
    const page1Container = document.getElementById("page1");
    const page2Container = document.getElementById("page2");

    page1Container.innerHTML = "";
    page2Container.innerHTML = "";

    faqData.forEach((item, index) => {
        const faqItem = document.createElement("div");
        faqItem.classList.add("faq-item");

        const question = document.createElement("div");
        question.classList.add("question");
        question.innerHTML = item.question;

        const answer = document.createElement("div");
        answer.classList.add("answer");
        answer.innerHTML = item.answer;

        faqItem.appendChild(question);
        faqItem.appendChild(answer);

        if (index < 8) {
            page1Container.appendChild(faqItem);
        } else {
            page2Container.appendChild(faqItem);
        }
    });
}

// ✅ 페이지 변경 함수
function showPage(page) {
    document.getElementById("page1").style.display = page === 1 ? "block" : "none";
    document.getElementById("page2").style.display = page === 2 ? "block" : "none";

    document.querySelectorAll(".page-button").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".page-button")[page - 1].classList.add("active");
}
