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
    if (page === 1) {
      const prev = createPaginationButton("&lsaquo;", () => {
        fetchReviews(currentPage);
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
    if (page === totalPages) {
      const next = createPaginationButton("&rsaquo;", () => {
        fetchReviews(currentPage);
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