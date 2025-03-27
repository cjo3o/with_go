// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";
const supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

// 페이지 설정
const perPage = 5;
let currentPage = 1;
let currentType = 'all';  // 필터 상태

// 후기 불러오기
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
    const list = document.getElementById('review-list');
    list.innerHTML = '';

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
                    <span class="name">${item.name}</span>
                    <span class="date">${createdDate}</span>
                </div>
            </div>
            <div class="review-image-box">
                ${item.file_url ? `<img src="${item.file_url}" class="review-image" />` : ""}
            </div>
        </div>
        `;

        div.addEventListener("click", () => openModal(item));
        list.appendChild(div);
    });
}

// 모달 열기 함수
function openModal(review) {
    const modal = document.getElementById('review-modal');
    const modalBody = document.getElementById('modal-body');
    const createdDate = new Date(review.created_at).toLocaleDateString();

    modalBody.innerHTML = `
        <h2>${review.title}</h2>
        <p><strong>작성자:</strong> ${review.name}</p>
        <p><strong>작성일:</strong> ${createdDate}</p>
        <p><strong>내용:</strong><br>${review.review_txt}</p>
        ${review.file_url ? `<img src="${review.file_url}" style="width:100%; margin-top:15px; border-radius:8px;" />` : ""}
    `;

    // 수정 버튼 클릭 시 비밀번호 확인 후 이동
    const editBtn = document.getElementById('edit-btn');
    editBtn.onclick = async () => {
        const { value: password } = await Swal.fire({
            title: "비밀번호 확인",
            input: "password",
            inputLabel: "작성 시 등록한 비밀번호를 입력해주세요",
            inputPlaceholder: "비밀번호",
            inputAttributes: {
                maxlength: 8,
                autocapitalize: "off",
                autocorrect: "off",
            },
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        });

        if (!password) return;

        const { data, error } = await supabase
            .from("review")
            .select("password")
            .eq("review_num", review.review_num)
            .single();

        if (error || !data) {
            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: "비밀번호 확인 중 오류가 발생했습니다.",
            });
            return;
        }

        if (data.password !== password) {
            Swal.fire({
                icon: "error",
                title: "비밀번호 불일치",
                text: "비밀번호가 일치하지 않습니다.",
            });
            return;
        }

        // 성공: 수정 페이지로 이동
        window.location.href = `review_write.html?mode=edit&review_num=${review.review_num}`;
    };

    modal.style.display = 'block';
}

// 모달 닫기
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('review-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('review-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 페이지네이션
function renderPagination(totalPages) {
    const pageBtnsContainer = document.getElementById("pageBtns");
    pageBtnsContainer.innerHTML = "";

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage(totalPages);
        }
    };

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

    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage(totalPages);
        }
    };
}

function updatePage(totalPages) {
    renderPagination(totalPages);
    fetchReviews(currentPage, currentType);
}

// 필터 버튼
document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        currentType = e.target.dataset.type;
        currentPage = 1;

        fetchReviews(currentPage, currentType);

        document.querySelectorAll(".filter-btn").forEach((b) =>
            b.classList.remove("active")
        );
        e.target.classList.add("active");
    });
});

// 글쓰기 버튼
document.getElementById("write-btn")?.addEventListener("click", async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.id) {
        await Swal.fire({
            icon: "warning",
            title: "로그인이 필요합니다",
            text: "로그인 후 이용해주세요.",
        });
        return;
    }

    window.location.href = "review_write.html";
});

// 초기 로딩
document.addEventListener("DOMContentLoaded", () => {
    fetchReviews(currentPage, currentType);
});
