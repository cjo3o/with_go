
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

    // Supabase에서 이벤트 데이터 불러오기
    const { data: events, error } = await supabase
        .from("withgo_event")
        .select("*")
        .order("date", { ascending: true });

    if (error) {
        console.error("Supabase에서 이벤트 불러오기 실패:", error);
        return;
    }

    // 데이터 렌더링
    events.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        eventItem.innerHTML = `
          <a href="${event.link_url}" target="_blank" class="event-link">
            <img src="${event.img_url}" alt="${event.title}">
            <div class="event-text">
              <h3>${event.title}</h3>
              <p>${event.date}</p>
            </div>
          </a>
        `;
        eventList.appendChild(eventItem);
    });
});

