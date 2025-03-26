// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";

const supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

// 페이지 설정
const perPage = 5;
let currentPage = 1;
let currentType = 'all';  // 필터 상태 (all, 보관, 배송)

// 후기 목록 불러오기
async function fetchReviews(page = 1, type = 'all') {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
        .from("review")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (type !== "all") {
        query = query.eq("type", type);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("데이터 오류:", error.message);
        return;
    }

    renderReviews(data);
    renderPagination(Math.ceil(count / perPage));
}
// 후기 카드 렌더링
function renderReviews(reviews) {
    const list = document.getElementById("review-list");
    list.innerHTML = "";

    reviews.forEach((item) => {
        const div = document.createElement("div");
        div.className = "review-item";

        const createdDate = new Date(item.created_at).toLocaleDateString();

        div.innerHTML = `
      <div class="review-content">
        <div class="review-text">
          <div class="title">
            <div class="type">[${item.type}]</div>
            <div class="title-text">${item.title}</div>
          </div>
          <div class="content">${item.review_txt}</div>
          <div class="name-date">
            <span class="name">${item.name}</span><br>
            <span class="date">${createdDate}</span>
          </div>
        </div>
        <div class="review-image-box">
          ${
            item.file_url
                ? `<img src="${item.file_url}" class="review-image" alt="첨부 이미지" />`
                : ""
        }
        </div>
      </div>
    `;

        // 클릭 시 상세 페이지 이동
        div.addEventListener("click", () => {
            window.location.href = `review_detail.html?review_num=${item.review_num}`;
        });

        list.appendChild(div);
    });
}

// 페이지네이션 렌더링
function renderPagination(totalPages) {
    const pageBtnsContainer = document.getElementById("pageBtns");
    pageBtnsContainer.innerHTML = "";

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // 이전 버튼 상태
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage(totalPages);
        }
    };

    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-btn");
        if (i === currentPage) pageBtn.classList.add("active");

        pageBtn.onclick = () => {
            currentPage = i;
            updatePage(totalPages);
        };

        pageBtnsContainer.appendChild(pageBtn);
    }

    // 다음 버튼 상태
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage(totalPages);
        }
    };
}

// 페이지 업데이트
function updatePage(totalPages) {
    renderPagination(totalPages);
    fetchReviews(currentPage, currentType);
}


// 글쓰기 버튼 이벤트
const writeBtn = document.getElementById("write-btn");
if (writeBtn) {
    writeBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user?.id) {
            await Swal.fire({
                icon: "warning",
                title: "로그인이 필요합니다",
                text: "로그인을 하고 다시 시도해주세요.",
                confirmButtonText: "확인"
            });
            return;
        }

        window.location.href = "review_write.html";
    });
}

// 페이지 로드 시 후기 불러오기
document.addEventListener("DOMContentLoaded", () => {
    fetchReviews(currentPage);
});


// 필터 버튼
document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        currentType = e.target.dataset.type;
        currentPage = 1;

        fetchReviews(currentPage, currentType);

        // 버튼 UI 변경
        document.querySelectorAll(".filter-btn").forEach((b) =>
            b.classList.remove("active")
        );
        e.target.classList.add("active");
    });
});

// 초기 로딩
document.addEventListener("DOMContentLoaded", () => {
    fetchReviews(currentPage, currentType);
});
