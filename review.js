// ✅ Supabase 연결 정보 입력
const SUPABASE_URL = "https://zgrjjnifqoactpuqolao.supabase.co"; // ← 본인 Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0";       // ← 본인 anon key

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
    return;
  }

  renderReviews(data);
  renderPagination(count, page);
}

// 후기 카드 렌더링
function renderReviews(reviews) {
  const list = document.getElementById('review-list');
  list.innerHTML = '';

  reviews.forEach(item => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <div class="user">
        <img src="img/person.png" class="user-icon" alt="icon" />
        ${item.name}
      </div>
      <div class="title">${item.title}</div>
      <div class="content">${item.review_txt}</div>
    `;
    list.appendChild(div);
  });
}

// 페이지네이션 렌더링
function renderPagination(total, page) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(total / perPage);

  for (let i = 1; i <= totalPages; i++) {
    const a = document.createElement('a');
    a.textContent = i;
    a.href = '#';
    if (i === page) a.classList.add('active');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      fetchReviews(currentPage);
    });
    pagination.appendChild(a);
  }

  // 다음 페이지 버튼
  if (page < totalPages) {
    const next = document.createElement('a');
    next.innerHTML = '&rsaquo;';
    next.href = '#';
    next.addEventListener('click', (e) => {
      e.preventDefault();
      fetchReviews(currentPage + 1);
    });
    pagination.appendChild(next);
  }
}

// 초기 호출
fetchReviews(currentPage);
