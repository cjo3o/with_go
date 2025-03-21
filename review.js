// Supabase 연결
const supabaseUrl = "https://zgrjjnifqoactpuqolao.supabase.co";
const supabasePassword = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";

var supabase = window.supabase.createClient(supabaseUrl, supabasePassword);

// 페이지 설정
const perPage = 9;
let currentPage = 1;

// 후기 목록 불러오기
async function fetchReviews(page = 1) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('review')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('데이터 불러오기 오류:', error.message);
    alert("후기 목록을 불러오지 못했습니다.");
    return;
  }

  renderReviews(data);
  renderPagination(count, page);
}

// 후기 카드 렌더링
function renderReviews(reviews) {
  const list = document.getElementById('review-list');
  list.innerHTML = '';

  reviews.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <div class="user">
        <img src="images/person.png" class="user-icon" alt="icon" />
        ${item.name}
      </div>
      <div class="title">${item.title}</div>
      <!--<div class="content">${item.review_txt}</div>-->
      ${
        item.file_url
            ? `<img src="${item.file_url}" alt="첨부 이미지" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 6px;" />`
            : ""
    }
    `;
    list.appendChild(div);
  });
}

// 페이지네이션 렌더링
function renderPagination(total, page) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(total / perPage);

    // 이전 버튼
  if (page > 1) {
    const prev = createPaginationButton("&lsaquo;", () => {
      fetchReviews(--currentPage);
    });
    pagination.appendChild(prev);
  }

    // 페이지 번호
  for (let i = 1; i <= totalPages; i++) {
    const btn = createPaginationButton(i, () => {
      currentPage = i;
      fetchReviews(currentPage);
    });
    if (i === page) btn.classList.add("active");
    pagination.appendChild(btn);
  }

  // 다음 버튼
  if (page < totalPages) {
    const next = createPaginationButton("&rsaquo;", () => {
      fetchReviews(++currentPage);
    });
    pagination.appendChild(next);
  }
}

// 페이지네이션 버튼 생성 함수
function createPaginationButton(text, onClick) {
  const a = document.createElement("a");
  a.innerHTML = text;
  a.href = "#";
  a.addEventListener("click", (e) => {
    e.preventDefault();
    onClick();
  });
  return a;
}

// 글쓰기 버튼
document.getElementById("write-btn").addEventListener("click", async function (e) {
  e.preventDefault();

  const { value: uuidInput } = await Swal.fire({
    title: "UUID 인증",
    input: "text",
    inputLabel: "당신의 UUID를 입력하세요",
    inputPlaceholder: "예: a3f0f2b6-... 등",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소"
  });

  if (!uuidInput) return;

  // 사용자 인증
  const { data, error } = await supabase
      .from("users")
      .select("*") // 전체 정보 가져오기
      .eq("id", uuidInput)
      .single();

  if (error || !data) {
    await Swal.fire({
      icon: "error",
      title: "인증 실패",
      text: "인증되지 않았습니다.",
    });
    return;
  }

  // 인증 성공: 사용자 정보 localStorage 저장
  localStorage.setItem("user_id", data.id);

  await Swal.fire({
    icon: "success",
    title: "인증되었습니다!",
    confirmButtonText: "확인"
  });

  // 작성 페이지로 이동
  window.location.href = "review_write.html";
});

// 페이지 로드 시 후기 불러오기
document.addEventListener("DOMContentLoaded", function () {
  fetchReviews(currentPage);
});
