document.addEventListener('DOMContentLoaded', async () => {
    await BoardData();
});

async function BoardData() {
    const { data, error } = await supabase
        .from('question')
        .select('text_num, type, title, name, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    const boardList = document.getElementById('board_list');

    if (data.length === 0) {
        boardList.innerHTML = `<tr><td colspan="6">등록된 게시글이 없습니다.</td></tr>`;
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.text_num}</td>
            <td>${item.type}</td>
            <td class="title"><a href="view.html?id=${item.id}">${item.title}</a></td>
            <td>${item.name}</td>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td>${item.status}</td>
        `;

        row.style.marginBottom = '20px';

        row.onclick = () => {
            window.location.href = `view.html?id=${item.id}`;
        };

        boardList.appendChild(row);
    });
}



let currentPage = 1; // 현재 페이지
const itemsPerPage = 10; // 한 페이지에 표시할 게시글 수

async function getTotalItems() {
    const { data, error, count } = await supabase
        .from('question')
        .select('*', { count: 'exact' });

    return count;
}

async function loadPostsAndPagination() {
    const totalItems = await getTotalItems();

    if (totalItems === 0) {
        document.getElementById('pageBtns').innerHTML = '등록된 게시글이 없습니다.';
        return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    console.log("총 페이지 수:", totalPages);

    renderPagination(totalPages);
    loadPage(currentPage);
}

// 페이지 번호 버튼을 렌더링하는 함수
function renderPagination(totalPages) {
    const pageBtnsContainer = document.getElementById('pageBtns');
    pageBtnsContainer.innerHTML = '';  // 기존 페이지 버튼 초기화

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;  // 페이지 번호 텍스트
        pageBtn.classList.add('page-btn');  // 기본 스타일 클래스

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        // 클릭 이벤트: 페이지 번호 버튼 클릭 시 해당 페이지로 이동
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderPagination(totalPages);  // 페이지 번호를 다시 렌더링
            loadPage(currentPage);  // 해당 페이지 데이터 로드
        });

        pageBtnsContainer.appendChild(pageBtn);  // 페이지 번호 버튼을 컨테이너에 추가
    }
}

// 게시글을 로드하는 함수 (페이지 번호에 맞춰 데이터 로드)
async function loadPage(page) {
    const offset = (page - 1) * itemsPerPage;  // 데이터의 시작 위치 (예: 0, 10, 20... 등의 인덱스를 만들기 위함)

    const { data, error } = await supabase
        .from('question')
        .select('text_num, type, title, name, created_at')
        .range(offset, offset + itemsPerPage - 1);  // 페이지에 맞는 데이터 로드 (예: 첫 번째 페이지는 0~9번 인덱스)

    if (error) {
        console.error("게시글을 로드하는 데 오류가 발생했습니다:", error);
        return;
    }

    console.log("현재 페이지 데이터:", data);  // 데이터 확인
    // 여기에 데이터를 화면에 표시하는 로직을 추가하세요.
}

// 처음 로드 시 실행
loadPostsAndPagination();

