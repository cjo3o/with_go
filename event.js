
const supabase = window.supabase.createClient(
    'https://zgrjjnifqoactpuqolao.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0'
);
document.addEventListener("DOMContentLoaded", async function () {
    // 🔹 header/footer 삽입
    fetch("header.html")
        .then(res => res.text())
        .then(data => (document.getElementById("header").innerHTML = data));

    fetch("footer.html")
        .then(res => res.text())
        .then(data => (document.getElementById("footer").innerHTML = data));

    const eventList = document.querySelector(".event-list");
    if (!eventList) {
        console.error("event-list를 찾을 수 없습니다!");
        return;
    }

    const { data: faqs, error } = await supabase
        .from("withgo_faqs") // 테이블 이름 확인 필요!
        .select("*");

    if (error) {
        console.error("FAQ 불러오기 실패:", error);
        return;
    }

    const pageSize = Math.ceil(faqs.length / 2);
    const page1Data = faqs.slice(0, pageSize);
    const page2Data = faqs.slice(pageSize);

    renderFAQ("page1", page1Data);
    renderFAQ("page2", page2Data);
    showPage(1); // 초기엔 1페이지 보여줌
});

function showPage(pageNumber) {
    document.querySelectorAll(".faq-container").forEach((container, idx) => {
        container.style.display = idx === pageNumber - 1 ? "block" : "none";
    });

    document.querySelectorAll(".page-button").forEach((btn, idx) => {
        btn.classList.toggle("active", idx === pageNumber - 1);
    });
}

function renderFAQ(containerId, faqList) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // 초기화

    faqList.forEach(faq => {
        const faqItem = document.createElement("div");
        faqItem.classList.add("faq-item");
        faqItem.innerHTML = `
      <h3 class="faq-question">${faq.question}</h3>
      <p class="faq-answer">${faq.answer}</p>
    `;
        container.appendChild(faqItem);
    });
}
